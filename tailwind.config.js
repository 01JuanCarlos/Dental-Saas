/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta principal: Rojo + Blanco (logo Recepta)
        verde: {
          DEFAULT: '#E8253A',   // rojo principal (reemplaza verde #243e36)
          light: '#ff4d62',     // rojo claro para hovers
          pale: '#fff0f2',      // fondo suave rojizo (reemplaza verde-pale)
        },
        naranja: {
          DEFAULT: '#c41e31',   // rojo oscuro (reemplaza naranja #d85a30)
          pale: '#fff0f2',
        },
        gold: '#E8253A',        // unificado al rojo
      },
      fontFamily: {
        syne: ['Poppins', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}