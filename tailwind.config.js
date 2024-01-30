/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./src/scripts/*.js",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          silver: "#c9c8de",
          dark: "#111928",
          light: "#172236",
          lightMelo: "#2c4269",
          lightClr: "#1f2940",
          lightGray: "#cccccc5c",
          lightBlue: "#79CBF3",
          green: "#15803d",
          red: "#b91c1c",
          yellow: "#b9821c",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [require("flowbite/plugin")],
};
