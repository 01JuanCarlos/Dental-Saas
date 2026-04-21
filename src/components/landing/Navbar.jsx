import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      transition: 'all 0.35s ease',
      background: scrolled ? 'rgba(8,15,30,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      padding: scrolled ? '12px 0' : '22px 0',
    }}>
      <div className="nav-inner">
        <div className="nav-logo">
          <div className="nav-logo-icon">🦷</div>
          Recepta
        </div>
        <div className="nav-links">
          {[['#features','Características'],['#how','Cómo funciona'],['#pricing','Precios'],['#testimonials','Testimonios']].map(([href, label]) => (
            <a key={href} href={href} className="nav-link">{label}</a>
          ))}
        </div>
        <button className="nav-cta" onClick={() => navigate('/app')}>Abrir App →</button>
      </div>
    </nav>
  )
}