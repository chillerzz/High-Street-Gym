/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'background-primary': '#F0F0F0',
      'myprimary': '#A4CBC9',
      'mysecondary': '#C6FFB1',
      'test': '#8FFF00'
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif']
    },
    extend: {},
  },
  plugins: [require("daisyui")],
}

