/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'corn-yellow': '#FFD700',
        'farm-green': '#228B22',
      }
    },
  },
  plugins: [],
}