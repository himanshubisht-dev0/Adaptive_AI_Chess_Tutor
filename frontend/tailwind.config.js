/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chess: {
          dark: '#769656',
          light: '#eeeed2',
          highlight: '#f6f669'
        }
      }
    },
  },
  plugins: [],
}
