/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#A8E3F5',
      },
    },
  },
  plugins: [
    
    // require('@tailwindcss/aspect-ratio'),
  ],
}