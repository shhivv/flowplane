const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', fontFamily.sans],
        heading: ['Kanit', fontFamily.sans],
      },
      colors: {
        background: "#0f0f0f"
      }
    },
  },
  plugins: [],
};
