import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowLeft, Save, RotateCcw } from 'lucide-react'
import { FIELD_DEFS, savePlantilla } from '../../utils/db.js'

// ─────────────────────────────────────────────────────────────
// COORDINATE SYSTEM — single source of truth: PERCENTAGES
//
// All positions are stored as { xPct, yPct } in range [0, 1]
// relative to the real image dimensions (top-left origin).
//
// xPct = pixelX / img.width
// yPct = pixelY / img.height   (0 = top, 1 = bottom)
//
// PDF-lib uses bottom-left origin, so when saving to PDF:
//   pdf_x = xPct * pageWidth
//   pdf_y = pageHeight - yPct * pageHeight - fontSize
//
// Preview HTML uses top-left origin, so:
//   css_left = xPct * 100 + '%'
//   css_top  = yPct * 100 + '%'
//
// Canvas markers are rendered at:
//   marker_left = xPct * canvas.clientWidth
//   marker_top  = yPct * canvas.clientHeight
// ─────────────────────────────────────────────────────────────

export default function StepCalibrate({ blob, blobUrl, savedConfig, onSave, onBack }) {
  const [placements, setPlacements] = useState({})   // { key: { xPct, yPct } }
  const [activeField, setActiveField] = useState(null)
  // fontSize starts at 0 (unknown) until the image loads and we can calculate
  // a proportional default based on the image width.
  const [fontSize, setFontSize] = useState(0)
  const [saving, setSaving] = useState(false)
  const [canvasReady, setCanvasReady] = useState(false)

  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  const draggingRef = useRef(null)      // key being dragged
  const dragStartRef = useRef(null)     // { mouseX, mouseY, origXpct, origYpct }

  // ── Load image into canvas ──────────────────────────────────
  useEffect(() => {
    if (!blobUrl) return
    const img = new window.Image()
    img.onload = () => {
      imgRef.current = img
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext('2d').drawImage(img, 0, 0)
      // Auto-calculate a proportional font size based on image width.
      // The reference is 28pt for a 1122px-wide image (~2.5% of width).
      const autoFontSize = Math.max(8, Math.min(72, Math.round(img.naturalWidth * 0.025)))

      // If there's a saved config, restore placements and fontSize from it
      if (savedConfig?.campos) {
        const restored = {}
        Object.entries(savedConfig.campos).forEach(([key, campo]) => {
          if (campo.xPct !== undefined && campo.yPct !== undefined) {
            restored[key] = { xPct: campo.xPct, yPct: campo.yPct }
          } else if (campo.x !== undefined && campo.y !== undefined) {
            // Fallback: convert legacy absolute coords back to percentages
            restored[key] = {
              xPct: campo.x / img.naturalWidth,
              yPct: (img.naturalHeight - campo.y - (campo.size || savedConfig.fontSize || 28)) / img.naturalHeight,
            }
          }
        })
        setPlacements(restored)
        setFontSize(savedConfig.fontSize || autoFontSize)
      } else {
        setFontSize(autoFontSize)
      }

      setCanvasReady(true)
    }
    img.src = blobUrl
  }, [blobUrl, savedConfig])

  // ── Click on canvas: place field ───────────────────────────
  const handleCanvasClick = useCallback((e) => {
    if (!activeField || draggingRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const xPct = (e.clientX - rect.left)  / rect.width
    const yPct = (e.clientY - rect.top)   / rect.height

    setPlacements(prev => ({ ...prev, [activeField]: { xPct, yPct } }))
    setActiveField(null)
  }, [activeField])

  // ── Mouse move: drag marker ─────────────────────────────────
  const handleMouseMove = useCallback((e) => {
    if (!draggingRef.current || !dragStartRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dx = (e.clientX - dragStartRef.current.mouseX) / rect.width
    const dy = (e.clientY - dragStartRef.current.mouseY) / rect.height

    const xPct = Math.max(0, Math.min(1, dragStartRef.current.origXpct + dx))
    const yPct = Math.max(0, Math.min(1, dragStartRef.current.origYpct + dy))

    setPlacements(prev => ({ ...prev, [draggingRef.current]: { xPct, yPct } }))
  }, [])

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null
    dragStartRef.current = null
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const startDrag = useCallback((e, key) => {
    e.stopPropagation()
    e.preventDefault()
    draggingRef.current = key
    dragStartRef.current = {
      mouseX:    e.clientX,
      mouseY:    e.clientY,
      origXpct:  placements[key].xPct,
      origYpct:  placements[key].yPct,
    }
  }, [placements])

  // ── Save config ─────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const img = imgRef.current
      const W = img?.naturalWidth  || 1122
      const H = img?.naturalHeight || 794

      // fontSize in PDF points. We scale it relative to page width
      // so it looks consistent regardless of image resolution.
      const pdfFontSize = fontSize
      const lineHeight  = Math.round(pdfFontSize * 1.4)
      const maxWidth    = Math.round(W * 0.38)

      const campos = {}
      FIELD_DEFS.forEach((f) => {
        const p = placements[f.key]
        if (!p) return

        // Convert pct → PDF coords (pdf-lib: origin bottom-left)
        const pdf_x = Math.round(p.xPct * W)
        const pdf_y = Math.round(H - p.yPct * H - pdfFontSize)

        campos[f.key] = {
          x:    pdf_x,
          y:    pdf_y,
          // also store percentages so preview can use them directly
          xPct: p.xPct,
          yPct: p.yPct,
          size: pdfFontSize,
          font: f.font,
          ...((f.key === 'prescripcion' || f.key === 'indicaciones')
            ? { lineHeight, maxWidth } : {}),
        }
      })

      const config = {
        pageWidth:  W,
        pageHeight: H,
        fontSize:   pdfFontSize,
        campos,
      }

      await savePlantilla(blob || new Blob(), config)
      const finalUrl = blob ? URL.createObjectURL(blob) : blobUrl
      onSave(config, finalUrl, blob)
    } catch (err) {
      console.error('Error al guardar:', err)
    } finally {
      setSaving(false)
    }
  }, [fontSize, placements, blob, blobUrl, onSave])

  const placedCount = Object.keys(placements).length

  return (
    <div className="flex flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 130px)' }}>

      {/* ── LEFT PANEL ── */}
      <div className="w-full lg:w-80 xl:w-96 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">

        <div className="p-6 border-b border-gray-100">
          <h2 className="font-syne font-bold text-xl text-gray-900 mb-1">Calibrar campos</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Selecciona un campo y haz clic en la imagen para posicionarlo.
          </p>
        </div>

        <div className="mx-4 mt-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl p-3">
          <p className="text-xs text-green-800 leading-relaxed">
            <strong>Flujo:</strong> Selecciona campo → clic en la imagen → arrastra para ajustar → Guardar
          </p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Campos · {placedCount}/{FIELD_DEFS.length} posicionados
          </div>

          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-verde rounded-full transition-all duration-500"
              style={{ width: `${(placedCount / FIELD_DEFS.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            {FIELD_DEFS.map((f) => {
              const placed  = !!placements[f.key]
              const isActive = activeField === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveField(isActive ? null : f.key)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold text-left flex items-center gap-3 transition-all ${
                    isActive
                      ? 'border-naranja text-naranja bg-naranja-pale outline outline-2 outline-naranja shadow-md'
                      : placed
                        ? 'border-verde text-verde bg-verde-pale'
                        : 'border-gray-200 text-gray-600 bg-gray-50 hover:border-verde/40'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold ${
                    isActive ? 'bg-naranja text-white' : placed ? 'bg-verde text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {placed ? '✓' : isActive ? '→' : '+'}
                  </span>
                  <span>{f.label}</span>
                  {isActive && <span className="ml-auto text-[10px] text-naranja font-normal">Clic en imagen →</span>}
                  {placed && !isActive && (
                    <span className="ml-auto text-[10px] text-gray-400 font-normal tabular-nums">
                      {Math.round(placements[f.key].xPct * 100)}%, {Math.round(placements[f.key].yPct * 100)}%
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-6">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Tamaño de fuente · {fontSize}pt
            </div>
            <input
              type="range" min={8} max={72} step={1}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-300 mt-1">
              <span>8pt</span><span>72pt</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={handleSave}
            disabled={saving || placedCount === 0}
            className="w-full py-3.5 bg-verde text-white rounded-xl text-sm font-bold hover:bg-verde-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando…' : `Guardar y continuar (${placedCount}/${FIELD_DEFS.length})`}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onBack} className="py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-semibold hover:border-gray-300 transition-colors flex items-center justify-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Cambiar imagen
            </button>
            <button onClick={() => setPlacements({})} className="py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-semibold hover:border-red-200 hover:text-red-500 transition-colors flex items-center justify-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Limpiar todo
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Canvas ── */}
      <div className="flex-1 p-4 lg:p-6 bg-gray-50 flex flex-col">
        <div className="text-xs text-gray-400 text-center mb-3 font-medium min-h-[20px]">
          {activeField
            ? `✦ Haz clic donde quieres colocar "${FIELD_DEFS.find(f => f.key === activeField)?.label}"`
            : canvasReady
              ? 'Selecciona un campo del panel izquierdo'
              : 'Cargando imagen…'}
        </div>

        {/* Canvas wrapper — markers are positioned with % so they stay pixel-perfect */}
        <div
          ref={wrapRef}
          className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg"
          style={{ cursor: activeField ? 'crosshair' : 'default' }}
        >
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />

          {/* Markers rendered with % positions matching the canvas visual */}
          {canvasReady && Object.entries(placements).map(([key, pos]) => {
            const def = FIELD_DEFS.find(f => f.key === key)
            return (
              <div
                key={key}
                onMouseDown={(e) => startDrag(e, key)}
                style={{
                  position: 'absolute',
                  left:   `${pos.xPct * 100}%`,
                  top:    `${pos.yPct * 100}%`,
                  transform: 'translate(0, -50%)',
                  background: 'rgba(36,62,54,0.92)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 5,
                  cursor: 'move',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  border: '1.5px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  zIndex: 10,
                  pointerEvents: 'all',
                }}
              >
                {def?.label || key}
              </div>
            )
          })}
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-3">
          Las etiquetas muestran su posición relativa (%) — se renderizarán igual en la vista previa y en el PDF
        </p>
      </div>
    </div>
  )
}