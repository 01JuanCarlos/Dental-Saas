import Navbar from '../components/landing/Navbar.jsx'
import Hero from '../components/landing/Hero.jsx'
import Features from '../components/landing/Features.jsx'
import HowItWorks from '../components/landing/HowItWorks.jsx'
import Pricing from '../components/landing/Pricing.jsx'
import Testimonials from '../components/landing/Testimonials.jsx'
import Footer from '../components/landing/Footer.jsx'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-root">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />

      {/* Final CTA */}
      <section className="cta-section">
        <div className="cta-orb" />
        <div className="section-inner cta-inner">
          <div className="section-eyebrow" style={{ color: '#a78bfa', textAlign: 'center' }}>¿Listo para empezar?</div>
          <h2 className="cta-h2">Tu consultorio merece<br />trabajar más inteligente</h2>
          <p className="cta-sub">Únete a más de 320 odontólogos que ya generan recetas profesionales en segundos. 14 días gratis, sin compromisos.</p>
          <div className="cta-btns">
            <button className="btn-primary" onClick={() => navigate('/app')}>
              Comenzar gratis ahora <span className="btn-arrow">→</span>
            </button>
            <button className="btn-ghost">Hablar con ventas</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}