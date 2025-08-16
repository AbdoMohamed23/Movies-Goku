/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        H1: '#ffffff',
        color: '#14171A',
        card: '#1F232C',
        background: '#181B22',
      },
    },
  },
  plugins: [],
}
