/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'homeImg': "url('/sky.jpg')",
        'savedImg': "url('/saved.jpg')",
        'cloudImg': "url('/cloudy.jpg')",
        'rainImg': "url('/rainy.jpg')",
      }
    },
  },
  plugins: [],
}