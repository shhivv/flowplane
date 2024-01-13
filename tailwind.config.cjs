const { fontFamily } = require("tailwindcss/defaultTheme");
const typo = require("@tailwindcss/typography");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", fontFamily.sans],
        heading: ["Kanit", fontFamily.sans],
      },
      colors: {
        background: "#171717",
      },
    },
  },
  plugins: [typo],
};
