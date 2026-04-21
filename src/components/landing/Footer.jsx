export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">🦷</div>
              Recepta
            </div>
            <p className="footer-tagline">La plataforma de recetas odontológicas más rápida de Latinoamérica. Hecha por y para dentistas.</p>
            <div className="footer-socials">
              {['in', 'tw', 'ig', 'yt'].map(s => (
                <div key={s} className="social-chip">{s}</div>
              ))}
            </div>
          </div>
          {[
            { title: 'Producto', links: ['Características', 'Precios', 'Changelog', 'Roadmap'] },
            { title: 'Recursos', links: ['Documentación', 'Blog', 'Tutoriales', 'Soporte'] },
            { title: 'Legal', links: ['Privacidad', 'Términos', 'Cookies', 'Contacto'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="footer-col-title">{col.title}</h4>
              {col.links.map((link) => (
                <a key={link} href="#" className="footer-link">{link}</a>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 Recepta. Todos los derechos reservados.</span>
          <span>Hecho con ❤️ para odontólogos en Latinoamérica</span>
        </div>
      </div>
    </footer>
  )
}