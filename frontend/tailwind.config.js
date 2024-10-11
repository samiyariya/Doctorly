/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#5F6FFF'
      },
      gridTemplateColumns: {
        // grid will automatically create as many columns as will fit (homepage doctor list)
        'auto':'repeat(auto-fit, minmax(200px, 1fr))'
      }
    },
  },
  plugins: [],
}