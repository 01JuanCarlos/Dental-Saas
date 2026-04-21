import { useNavigate } from 'react-router-dom'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="hero-section">
      <div className="hero-bg-orb hero-orb-1" />
      <div className="hero-bg-orb hero-orb-2" />
      <div className="hero-bg-orb hero-orb-3" />

      <div className="section-inner hero-grid">
        <div className="hero-copy">
          <div className="badge-pill">
            <span className="badge-dot" />
            Nueva versión disponible · Exportación WhatsApp
          </div>

          <h1 className="hero-h1">
            Recetas dentales<br />
            en <span className="hero-gradient-text">segundos</span>,<br />
            no en minutos
          </h1>

          <p className="hero-sub">
            La plataforma SaaS para odontólogos que automatiza prescripciones, genera PDFs con tu membrete y centraliza el historial de tus pacientes.
          </p>

          <div className="hero-ctas">
            <button className="btn-primary" onClick={() => navigate('/app')}>
              Prueba gratis 14 días
              <span className="btn-arrow">→</span>
            </button>
            <button className="btn-ghost">Ver demo</button>
          </div>

          <div className="hero-social-proof">
            <div className="avatar-stack">
              {['AP','CM','RG','LM'].map((i, idx) => (
                <div key={i} className="avatar-chip" style={{ zIndex: 4 - idx, marginLeft: idx === 0 ? 0 : -10 }}>{i}</div>
              ))}
            </div>
            <span className="proof-text">+320 odontólogos ya usan Recepta</span>
          </div>
        </div>

        <div className="hero-mockup">
          <div className="mockup-glow" />
          <div className="mockup-card">
            <div className="mockup-topbar">
              <div className="mockup-dots">
                <span style={{background:'#ef4444'}} />
                <span style={{background:'#f59e0b'}} />
                <span style={{background:'#22c55e'}} />
              </div>
              <span className="mockup-title-bar">Recepta Pro</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-tag">✓ Vista previa en tiempo real</div>
              <div className="mockup-section-title">Nueva Receta</div>
              <div className="mockup-field">
                <div className="mockup-field-label">Paciente</div>
                <div className="mockup-field-value">Juan Carlos Pérez</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                <div className="mockup-field">
                  <div className="mockup-field-label">Edad</div>
                  <div className="mockup-field-value">34 años</div>
                </div>
                <div className="mockup-field">
                  <div className="mockup-field-label">Fecha</div>
                  <div className="mockup-field-value">10/04/2026</div>
                </div>
              </div>
              <div className="mockup-proc-tag">Extracción Dental</div>
              <div className="mockup-rx">
                - Amoxicilina 500mg × 5 días<br />
                - Dolocordralan × 2 días<br />
                <em style={{color:'rgba(255,255,255,0.45)', fontSize:11}}>Después de cada comida</em>
              </div>
              <button className="mockup-btn">⬇ GENERAR PDF + COMPARTIR</button>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-brands">
        <span className="hero-brands-label">Compatible con</span>
        {['WHATSAPP','GOOGLE DRIVE','PDF-LIB','MERCADO PAGO','CALENDLY'].map(b => (
          <span key={b} className="hero-brand-item">{b}</span>
        ))}
      </div>
    </section>
  )
}