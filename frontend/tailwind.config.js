/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        secondary: '#181818',
        veryLightGrey: '#b3b3b3',
        lightBlue: '#2596BE',
        charcoal: '#404040',
      },
    },
  },
  plugins: [],
};
