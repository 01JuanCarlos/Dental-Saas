import { useEffect, useRef } from 'react'

// Campos que son de una sola línea (ancla = centro vertical del texto)
const SINGLE_LINE_FIELDS = ['nombre', 'edad', 'fecha']
// Campos multilinea (ancla = borde superior del bloque de texto)
const MULTILINE_FIELDS = ['prescripcion', 'indicaciones']

export default function RecipePreview({ form, fecha, previewConfig, previewBlobUrl }) {
  const containerRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    function adjust() {
      if (!containerRef.current || !innerRef.current || previewConfig) return
      const scale = containerRef.current.offsetWidth / 1122
      innerRef.current.style.transform = `scale(${scale})`
    }
    adjust()
    window.addEventListener('resize', adjust)
    return () => window.removeEventListener('resize', adjust)
  }, [previewConfig])

  const aspectRatio = previewConfig
    ? `${previewConfig.pageWidth} / ${previewConfig.pageHeight}`
    : '1122 / 794'

  return (
    <div className="w-full lg:w-3/4 flex justify-center items-start">
      <div ref={containerRef} className="receta-container" style={{ aspectRatio }}>

        {/* DEFAULT HTML TEMPLATE */}
        {!previewConfig && (
          <div ref={innerRef} className="receta-inner">
            <div style={{ position:'absolute', left:24, top:24, width:100, height:100, borderRadius:'50%', background:'linear-gradient(135deg,#c2a37d,#a07d55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
              <span style={{ color:'#fff', fontSize:32, fontWeight:800 }}>🦷</span>
            </div>
            <div style={{ background:'linear-gradient(135deg,#243e36,#1a2d27)', height:140, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', paddingLeft:130, paddingRight:40, textAlign:'center' }}>
              <h1 style={{ fontFamily:'serif', color:'white', fontSize:22, letterSpacing:'0.2em', margin:0, fontWeight:400 }}>Consultorio Odontológico</h1>
              <h2 style={{ fontFamily:'serif', color:'#c2a37d', fontSize:38, fontWeight:700, letterSpacing:'0.1em', margin:'4px 0', textTransform:'uppercase' }}>Alta Gracia</h2>
              <div style={{ display:'flex', justifyContent:'space-between', width:'100%', paddingLeft:40, paddingRight:40, marginTop:16, fontSize:11, color:'rgba(255,255,255,0.8)', fontStyle:'italic' }}>
                <div>CD. ANA PAULA GARCIA MIRANDA <span style={{ marginLeft:16, color:'#c2a37d' }}>COP: 58688</span></div>
                <div style={{ textAlign:'right', lineHeight:1.4 }}>CITAS: 936311361<br/>LEONCIO PRADO 960 _ HUAMACHUCO</div>
              </div>
            </div>
            <div style={{ padding:'20px 64px 12px', display:'flex', justifyContent:'space-between', alignItems:'flex-end', fontSize:11, fontWeight:700, color:'#374151' }}>
              <div style={{ flexGrow:1, display:'flex', borderBottom:'1px solid #9ca3af', paddingBottom:4, fontStyle:'italic', textTransform:'uppercase' }}>
                PACIENTE: <span style={{ fontWeight:400, marginLeft:12, color:'#000', fontStyle:'normal', textTransform:'uppercase' }}>{form.paciente}</span>
              </div>
              <div style={{ width:128, display:'flex', borderBottom:'1px solid #9ca3af', paddingBottom:4, marginLeft:24, marginRight:24, fontStyle:'italic', textTransform:'uppercase' }}>
                EDAD: <span style={{ fontWeight:400, marginLeft:12, color:'#000', fontStyle:'normal' }}>{form.edad}</span>
              </div>
              <div style={{ width:176, display:'flex', borderBottom:'1px solid #9ca3af', paddingBottom:4, justifyContent:'flex-end', fontStyle:'italic', textTransform:'uppercase' }}>
                FECHA: <span style={{ fontWeight:400, marginLeft:12, color:'#000', fontStyle:'normal' }}>{fecha}</span>
              </div>
            </div>
            <div style={{ display:'flex', flexGrow:1, padding:'20px 64px', position:'relative' }}>
              <div style={{ position:'absolute', left:'50%', top:20, bottom:20, width:1, background:'#d1d5db' }} />
              <div style={{ width:'50%', paddingRight:48, zIndex:1 }}>
                <h3 style={{ textAlign:'center', fontWeight:700, color:'#9ca3af', letterSpacing:'0.4em', fontSize:9, marginBottom:20, textTransform:'uppercase' }}>Prescripción</h3>
                <div style={{ fontSize:11, color:'#1f2937', whiteSpace:'pre-line', lineHeight:1.6, fontStyle:'italic', minHeight:250 }}>{form.prescripcion}</div>
              </div>
              <div style={{ width:'50%', paddingLeft:48, zIndex:1 }}>
                <h3 style={{ textAlign:'center', fontWeight:700, color:'#9ca3af', letterSpacing:'0.4em', fontSize:9, marginBottom:20, textTransform:'uppercase' }}>Indicaciones</h3>
                <div style={{ fontSize:11, color:'#1f2937', whiteSpace:'pre-line', lineHeight:1.6, fontStyle:'italic', minHeight:250 }}>{form.indicaciones}</div>
              </div>
            </div>
            <div style={{ background:'#243e36', padding:'14px 40px', textAlign:'center' }}>
              <p style={{ color:'white', fontSize:10, letterSpacing:'0.7em', fontWeight:300, fontStyle:'italic', textTransform:'uppercase', margin:0 }}>¡ Cuidamos tu salud dental !</p>
            </div>
          </div>
        )}

        {/* CUSTOM TEMPLATE */}
        {previewConfig && previewBlobUrl && (
          <CustomTemplatePreview
            form={form}
            fecha={fecha}
            config={previewConfig}
            blobUrl={previewBlobUrl}
          />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ANCHOR CONTRACT — two modes depending on field type:
//
// SINGLE-LINE (nombre, edad, fecha):
//   Marker pill:  transform: translate(0, -50%)
//   → center of pill = click point
//   Preview div:  transform: translateY(-50%)
//   → vertical center of text = click point  ✓
//
// MULTILINE (prescripcion, indicaciones):
//   Marker pill:  transform: translate(0, -50%)
//   → center of pill = click point  (pill is small, looks fine)
//   Preview div:  transform: translateY(0)
//   → TOP of text block = click point
//   This makes sense: you click where the text should START
// ─────────────────────────────────────────────────────────────
function CustomTemplatePreview({ form, fecha, config, blobUrl }) {
  const containerRef = useRef(null)
  const overlayRef   = useRef(null)

  const valores = {
    nombre:       form.paciente.toUpperCase(),
    edad:         form.edad,
    fecha,
    prescripcion: form.prescripcion,
    indicaciones: form.indicaciones,
  }

  useEffect(() => {
    function scaleFonts() {
      if (!containerRef.current || !overlayRef.current) return
      const ratio = containerRef.current.offsetWidth / config.pageWidth
      overlayRef.current.style.setProperty('--font-ratio', ratio)
    }
    scaleFonts()
    const ro = new ResizeObserver(scaleFonts)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [config.pageWidth])

  return (
    <div ref={containerRef} style={{ position:'absolute', inset:0 }}>
      <img
        src={blobUrl}
        style={{ width:'100%', height:'100%', objectFit:'fill', display:'block', userSelect:'none' }}
        alt="Plantilla"
        draggable={false}
      />

      <div ref={overlayRef} style={{ position:'absolute', inset:0, '--font-ratio':1 }}>
        {Object.entries(config.campos).map(([key, campo]) => {
          const texto = valores[key]
          if (!texto) return null

          const xPct = campo.xPct !== undefined
            ? campo.xPct
            : campo.x / config.pageWidth

          const yPct = campo.yPct !== undefined
            ? campo.yPct
            : (config.pageHeight - campo.y - (campo.size || config.fontSize)) / config.pageHeight

          const baseFontPx = campo.size || config.fontSize
          const isMultiline = MULTILINE_FIELDS.includes(key)

          return (
            <div
              key={key}
              style={{
                position:   'absolute',
                left:       `${xPct * 100}%`,
                top:        `${yPct * 100}%`,
                // Single-line: center text vertically on the click point
                // Multiline:   top of text block at the click point
                transform:  isMultiline ? 'translateY(0)' : 'translateY(-50%)',
                fontSize:   `calc(${baseFontPx}px * var(--font-ratio))`,
                lineHeight: campo.lineHeight
                              ? `calc(${campo.lineHeight}px * var(--font-ratio))`
                              : 1.35,
                maxWidth:   campo.maxWidth
                              ? `${(campo.maxWidth / config.pageWidth) * 100}%`
                              : '45%',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontStyle:  campo.font === 'italic' ? 'italic' : 'normal',
                color:      '#000',
                whiteSpace: 'pre-wrap',
                pointerEvents: 'none',
              }}
            >
              {texto}
            </div>
          )
        })}
      </div>
    </div>
  )
}
