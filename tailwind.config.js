/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        H1: '#ffffff',
        color: '#0b0d13',
        card: '#141721',
        background: '#0a0c11',
      },
    },
  },
  plugins: [],
}
