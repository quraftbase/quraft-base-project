// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        futuristic: {
          background: '#0f172a',
          text: '#38bdf8',
          border: '#94a3b8',
          button: '#0ea5e9',
        },
        dragonball: {
          background: '#1f2937',
          text: '#facc15',
          border: '#f59e0b',
          button: '#facc15',
        },
      },
    },
  },
  plugins: [],
}
