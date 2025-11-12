// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // ...other paths
  ],
  theme: {
    extend: {
      // ...existing code...
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        aurora: {
          from: {
            transform: 'translate(0px, 0px) rotate(0deg)',
          },
          to: {
            transform: 'translate(1000px, 700px) rotate(360deg)',
          },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'aurora': 'aurora 30s linear infinite' // تغییر از 60s به 30s
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionDuration: {
        '2000': '2000ms',
      }
    }
  },
  plugins: [
    // ...existing plugins
  ],
}