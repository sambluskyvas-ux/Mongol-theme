/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mongol: {
          dark: '#070605',
          earth: '#18120c',
          bronze: '#8c6239',
          gold: '#c69c6d',
          dirtyIvory: '#ded1b8',
          steel: '#3a4042',
          deepRed: '#4a0e0e',
          blood: '#781212',
          darkTeal: '#0e1f1f'
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Trajan Pro', 'Georgia', 'serif'],
        sans: ['Cinzel Decorative', 'Cinzel', 'sans-serif'],
      },
      letterSpacing: {
        cinematic: '0.35em',
        widest: '0.25em'
      }
    },
  },
  plugins: [],
};