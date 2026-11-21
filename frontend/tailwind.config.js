/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        traffic: {
          red: '#EF4444',
          yellow: '#F59E0B',
          green: '#10B981',
          dark: '#0F172A',
          card: '#1E293B'
        }
      }
    },
  },
  plugins: [],
}
