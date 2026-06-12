/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kaiDark: '#1a2035',
        kaiBg: '#f5f7fd',
        kaiPrimary: '#1572e8'
      },
      fontFamily: {
        sans: ['Public Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}