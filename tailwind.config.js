/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#785fff',
          500: '#573cff',
          600: '#4930cc',
        }
      }
    },
  },
  plugins: [],
};