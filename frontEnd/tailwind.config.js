/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: '0 4px 6px 0.03px rgba(0, 0, 0, 0.04)',
        custom1: '0 3px 0px 0.03px rgba(5, 5, 5, 0.03)',
      }
    },
  },
  plugins: [],
}
