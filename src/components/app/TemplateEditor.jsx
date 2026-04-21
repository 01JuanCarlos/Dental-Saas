import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Upload } from 'lucide-react'
import { FIELD_DEFS, CONFIG_DEFAULT, savePlantilla, deletePlantilla, getPlantillaConfig } from '../../utils/db.js'

export default function TemplateEditor({ onClose, onSave, onReset }) {
  const [hasImage, setHasImage] = useState(false)
  const [placements, setPlacements] = useState({})
  const [activeField, setActiveField] = useState(null)
  const [fontSize, setFontSize] = useState(28)
  const [saving, setSaving] = useState(false)
  const [currentBlob, setCurrentBlob] = useState(null)
  const [currentCfg, setCurrentCfg] = useState(CONFIG_DEFAULT)

  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  const draggingRef = useRef(null)
  const dragOffRef = useRef({ x: 0, y: 0 })
  const markersRef = useRef([])

  // Load existing template
  useEffect(() => {
    getPlantillaConfig().then(({ imageBytes, config }) => {
      setCurrentCfg(config)
      if (imageBytes) {
        const blob = new Blob([imageBytes])
        setCurrentBlob(blob)
        const url = URL.createObjectURL(blob)
        loadImageToCanvas(url, config)
        setHasImage(true)
      }
    }).catch(() => {})
  }, [])

  const loadImageToCanvas = useCallback((src, config) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      // Restore placements from config
      if (config?.campos) {
        const newPlacements = {}
        Object.entries(config.campos).forEach(([key, campo]) => {
          const rect = canvas.getBoundingClientRect()
          const scaleX = rect.width / img.width || 1
          const scaleY = rect.height / img.height || 1
          const yCSS = img.height - campo.y - (campo.size || config.fontSize || 13)
          newPlacements[key] = {
            xCSS: campo.x * scaleX,
            yCSS: yCSS * scaleY,
            xPDF: campo.x,
            yPDF: campo.y,
          }
        })
        setPlacements(newPlacements)
      }
    }
    img.src = src
  }, [])

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    setCurrentBlob(file)
    setPlacements({})
    const url = URL.createObjectURL(file)
    loadImageToCanvas(url, null)
    setHasImage(true)
    setActiveField(null)
  }, [loadImageToCanvas])

  const handleCanvasClick = useCallback((e) => {
    if (!activeField || draggingRef.current) return
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return

    const rect = canvas.getBoundingClientRect()
    const cssX = e.clientX - rect.left
    const cssY = e.clientY - rect.top
    const scaleX = img.width / rect.width
    const scaleY = img.height / rect.height
    const xPDF = Math.round(cssX * scaleX)
    const yPDF = Math.round(img.height - cssY * scaleY - fontSize)

    setPlacements((prev) => ({
      ...prev,
      [activeField]: { xCSS: cssX, yCSS: cssY, xPDF, yPDF },
    }))
    setActiveField(null)
  }, [activeField, fontSize])

  const handleMouseMove = useCallback((e) => {
    if (!draggingRef.current) return
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!wrap || !canvas || !img) return

    const wrapR = wrap.getBoundingClientRect()
    const canvR = canvas.getBoundingClientRect()
    const cssX = e.clientX - wrapR.left - dragOffRef.current.x
    const cssY = e.clientY - wrapR.top - dragOffRef.current.y
    const scaleX = img.width / canvR.width
    const scaleY = img.height / canvR.height

    setPlacements((prev) => ({
      ...prev,
      [draggingRef.current]: {
        xCSS: cssX, yCSS: cssY,
        xPDF: Math.round(cssX * scaleX),
        yPDF: Math.round(img.height - cssY * scaleY - fontSize),
      },
    }))
  }, [fontSize])

  useEffect(() => {
    const handleUp = () => { draggingRef.current = null }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [handleMouseMove])

  const startDrag = useCallback((e, key) => {
    e.stopPropagation()
    const wrap = wrapRef.current
    if (!wrap) return
    const wrapR = wrap.getBoundingClientRect()
    draggingRef.current = key
    dragOffRef.current = {
      x: e.clientX - wrapR.left - placements[key].xCSS,
      y: e.clientY - wrapR.top - placements[key].yCSS,
    }
  }, [placements])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const img = imgRef.current
      const lineHeight = Math.round(fontSize * 1.4)
      const maxWidth = Math.round((img?.width || 1122) * 0.38)
      const campos = {}

      FIELD_DEFS.forEach((f) => {
        if (placements[f.key]) {
          campos[f.key] = {
            x: placements[f.key].xPDF,
            y: placements[f.key].yPDF,
            size: fontSize,
            font: f.font,
            ...((f.key === 'prescripcion' || f.key === 'indicaciones')
              ? { lineHeight, maxWidth } : {}),
          }
        } else if (currentCfg?.campos?.[f.key]) {
          campos[f.key] = currentCfg.campos[f.key]
        }
      })

      const config = {
        pageWidth: img?.width || 1122,
        pageHeight: img?.height || 794,
        fontSize,
        campos,
      }

      await savePlantilla(currentBlob || new Blob(), config)
      const blobUrl = currentBlob ? URL.createObjectURL(currentBlob) : null
      onSave(config, blobUrl)
      onClose()
    } catch (err) {
      console.error('Error al guardar:', err)
    } finally {
      setSaving(false)
    }
  }, [fontSize, placements, currentCfg, currentBlob, onSave, onClose])

  const handleReset = useCallback(async () => {
    if (!confirm('¿Restablecer la plantilla original del consultorio?')) return
    await deletePlantilla()
    setPlacements({})
    setCurrentBlob(null)
    setCurrentCfg(CONFIG_DEFAULT)
    setHasImage(false)
    onReset()
    onClose()
  }, [onReset, onClose])

  return (
    <div className="modal-overlay" style={{ alignItems: 'flex-start', overflowY: 'auto', padding: '24px 12px' }}>
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-verde p-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-base" style={{ fontFamily: 'Syne' }}>Configurar plantilla</h3>
            <p className="text-white/60 text-xs mt-0.5">Sube tu imagen y posiciona cada campo haciendo clic</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/15 border-none text-white w-8 h-8 rounded-full cursor-pointer flex items-center justify-center hover:bg-white/25 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">

          {/* Drop zone */}
          {!hasImage && (
            <label
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer bg-slate-50 flex flex-col items-center gap-2 hover:bg-slate-100 transition-colors block mb-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
            >
              <Upload className="w-9 h-9 text-slate-400" />
              <div className="font-semibold text-gray-700 text-sm">Subir plantilla</div>
              <div className="text-gray-400 text-xs">PNG o JPG · haz clic o arrastra aquí</div>
              <input
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </label>
          )}

          {/* Canvas */}
          {hasImage && (
            <div
              ref={wrapRef}
              className="relative border border-slate-200 rounded-xl overflow-hidden mb-4"
              style={{ cursor: activeField ? 'crosshair' : 'default' }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{ display: 'block', width: '100%', height: 'auto' }}
              />
              {/* Markers */}
              {Object.entries(placements).map(([key, pos]) => {
                const def = FIELD_DEFS.find((f) => f.key === key)
                return (
                  <div
                    key={key}
                    className="cal-marker"
                    style={{ left: pos.xCSS, top: pos.yCSS }}
                    onMouseDown={(e) => startDrag(e, key)}
                  >
                    {def?.label || key}
                  </div>
                )
              })}
            </div>
          )}

          {/* Editor controls */}
          {hasImage && (
            <div>
              <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-3 text-xs text-green-800 mb-4">
                <strong>Instrucciones:</strong> Selecciona un campo → haz clic donde quieres que aparezca → arrastra para ajustar → Guardar.
              </div>

              {/* Field buttons */}
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Campos</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {FIELD_DEFS.map((f) => {
                  const placed = !!placements[f.key]
                  const isActive = activeField === f.key
                  return (
                    <button
                      key={f.key}
                      onClick={() => setActiveField(isActive ? null : f.key)}
                      className={`px-3 py-2 rounded-lg border text-xs font-semibold text-left flex items-center gap-2 transition-all ${
                        isActive
                          ? 'border-naranja text-naranja bg-naranja-pale outline outline-2 outline-naranja'
                          : placed
                            ? 'border-verde text-verde bg-verde-pale'
                            : 'border-slate-200 text-gray-600 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span>{placed ? '✓' : '+'}</span>
                      {f.label}
                    </button>
                  )
                })}
              </div>

              {/* Font size */}
              <div className="flex items-center gap-3 mb-6 text-sm">
                <label className="text-gray-500 whitespace-nowrap">Tamaño fuente:</label>
                <input
                  type="range"
                  min={10} max={80} step={1}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="font-bold text-verde min-w-[40px]">{fontSize}pt</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-verde text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-verde-light transition-colors disabled:opacity-70 min-w-[160px]"
                >
                  {saving ? 'Guardando…' : 'Guardar configuración'}
                </button>
                <button
                  onClick={() => { setHasImage(false); setCurrentBlob(null); setPlacements({}) }}
                  className="px-4 py-3 bg-transparent border border-slate-200 rounded-xl text-sm text-gray-500 cursor-pointer hover:border-slate-400 transition-colors"
                >
                  Cambiar imagen
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 bg-transparent border border-slate-200 rounded-xl text-sm text-gray-500 cursor-pointer hover:border-red-300 hover:text-red-600 transition-colors"
                >
                  Restablecer original
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
