import { useNavigate } from 'react-router-dom'

const plans = [
  {
    name: 'Básico', price: 'Gratis', period: 'Para siempre',
    features: ['50 recetas por mes','1 plantilla de receta','Exportación PDF','Procedimientos básicos'],
    cta: 'Comenzar gratis', featured: false,
  },
  {
    name: 'Pro', price: 'S/ 49', period: 'por mes',
    features: ['Recetas ilimitadas','Plantillas personalizadas','Envío por WhatsApp','Historial de pacientes','Protocolos pediátricos','Soporte prioritario'],
    cta: 'Prueba 14 días gratis', badge: 'Más popular', featured: true,
  },
  {
    name: 'Clínica', price: 'S/ 149', period: 'por mes · hasta 5 doctores',
    features: ['Todo lo de Pro','Múltiples usuarios','Panel administrativo','Estadísticas avanzadas','API access','Onboarding dedicado'],
    cta: 'Contactar ventas', featured: false,
  },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <section id="pricing" className="pricing-section">
      <div className="section-inner">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <div className="section-eyebrow">Precios</div>
          <h2 className="section-h2">Simple, sin sorpresas</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>Prueba gratis 14 días. Sin tarjeta de crédito.</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.name} className={plan.featured ? 'plan-card plan-featured' : 'plan-card'}>
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-period">{plan.period}</div>
              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f} className="plan-feature-item">
                    <span className="plan-check">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button
                className={plan.featured ? 'btn-plan-featured' : 'btn-plan'}
                onClick={() => navigate('/app')}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}