const testimonials = [
  { stars: 5, text: 'Antes tardaba 5 minutos por receta. Ahora son 20 segundos. Mis pacientes no pueden creer la rapidez con la que salgo a atenderlos.', name: 'Dra. Ana Paula García', role: 'Odontóloga · Huamachuco', initials: 'AP', color: '#2563eb' },
  { stars: 5, text: 'La función de plantilla personalizada es increíble. Subí el diseño de mi recetario oficial y quedó exactamente igual. Mis pacientes lo notan.', name: 'Dr. Carlos Mendoza', role: 'Periodoncista · Lima', initials: 'CM', color: '#7c3aed' },
  { stars: 5, text: 'Los protocolos pediátricos me salvan la vida. Antes siempre buscaba las dosis para niños. Ahora el sistema las calcula solo según la edad.', name: 'Dra. Rosa Gutiérrez', role: 'Odontopediatra · Trujillo', initials: 'RG', color: '#059669' },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="section-inner">
        <div className="section-header">
          <div className="section-eyebrow">Testimonios</div>
          <h2 className="section-h2">Lo que dicen nuestros odontólogos</h2>
          <p className="section-sub">Más de 320 profesionales confían en Recepta cada día.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}>{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}