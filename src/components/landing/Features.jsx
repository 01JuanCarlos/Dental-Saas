const features = [
  { icon: '📄', title: 'Recetas con 1 clic', desc: 'Selecciona el procedimiento y los medicamentos se autocompletan. PDF en segundos con tu membrete.', accent: '#2563eb' },
  { icon: '🖼️', title: 'Plantilla personalizable', desc: 'Sube tu propio diseño y calibra los campos visualmente. Arrastra, posiciona y guarda.', accent: '#7c3aed' },
  { icon: '📱', title: 'Envío por WhatsApp', desc: 'Comparte la receta directamente con el paciente por WhatsApp o descarga el PDF para imprimir.', accent: '#059669' },
  { icon: '👶', title: 'Protocolos pediátricos', desc: 'Dosis automáticas para niños según rango de edad. Nunca más calcular dosis manualmente.', accent: '#0891b2' },
  { icon: '🔒', title: 'Datos seguros', desc: 'Historial encriptado. Cumple con regulaciones de privacidad médica. Tu info no sale de tu cuenta.', accent: '#dc2626' },
  { icon: '📊', title: 'Estadísticas del consultorio', desc: 'Procedimientos frecuentes, medicamentos más recetados y actividad semanal para decisiones clínicas.', accent: '#d97706' },
]

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="section-inner">
        <div className="section-header">
          <div className="section-eyebrow">Características</div>
          <h2 className="section-h2">Todo lo que tu consultorio<br />necesita en un solo lugar</h2>
          <p className="section-sub">Diseñado específicamente para odontólogos que quieren trabajar más rápido sin sacrificar calidad.</p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon-wrap" style={{ background: f.accent + '18', border: `1px solid ${f.accent}30` }}>
                <span style={{ fontSize: 22 }}>{f.icon}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-line" style={{ background: f.accent }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}