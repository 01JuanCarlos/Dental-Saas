const steps = [
  { num: '01', title: 'Ingresa los datos del paciente', desc: 'Nombre, edad y tipo de paciente. El sistema detecta automáticamente si es adulto o pediátrico.' },
  { num: '02', title: 'Selecciona el procedimiento', desc: 'La prescripción e indicaciones se llenan automáticamente con protocolos preconfigurados.' },
  { num: '03', title: 'Genera, descarga y comparte', desc: 'PDF con tu membrete listo en un clic. Envíalo por WhatsApp o imprímelo. Historial guardado.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="how-section">
      <div className="how-bg-shape" />
      <div className="section-inner">
        <div className="section-header how-header">
          <div className="section-eyebrow" style={{ color: '#a78bfa' }}>Cómo funciona</div>
          <h2 className="section-h2" style={{ color: '#fff' }}>De la consulta al PDF<br />en menos de 30 segundos</h2>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.5)' }}>Un flujo pensado para tu ritmo de trabajo. Sin complicaciones.</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={s.num} className="step-card">
              <div className="step-num">{s.num}</div>
              {i < steps.length - 1 && <div className="step-connector" />}
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="how-stats">
          {[['320+','Odontólogos activos'],['98%','Satisfacción'],['< 30s','Por receta'],['50k+','PDFs generados']].map(([n, l]) => (
            <div key={l} className="stat-item">
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}