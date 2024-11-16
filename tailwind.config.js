/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          shake: 'shake 0.3s ease-in-out',
        },
        keyframes: {
          shake: {
            '0%, 100%': { transform: 'translateX(0)' },
            '25%': { transform: 'translateX(-5px)' },
            '50%': { transform: 'translateX(5px)' },
            '75%': { transform: 'translateX(-5px)' },
          },
        },
      },
    },
    plugins: [],
  }