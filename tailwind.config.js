/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,css,scss}"],
  theme: {
    extend: {
      keyframes: {
        glowPop: {
          '0%, 100%': { 
            boxShadow: '0 0 5px 2px rgba(59, 130, 246, 0)', 
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 15px 6px rgba(59, 130, 246, 0.8)', 
            transform: 'scale(1.02)'
          },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        glowPop: 'glowPop 1.2s ease-in-out forwards',
        fadeOut: 'fadeOut 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}