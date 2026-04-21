/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        verde: {
          DEFAULT: '#243e36',
          light: '#3a5c51',
          pale: '#e8f5f0',
        },
        naranja: {
          DEFAULT: '#d85a30',
          pale: '#fff3ee',
        },
        gold: '#c2a37d',
      },
      fontFamily: {
        syne: ['Poppins', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
