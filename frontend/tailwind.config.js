/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: "#E21D27",
          blue: "#5055FB",
        },
        dark: {
          DEFAULT: "#010101",
          gray: "#1F1F1F",
          card: "#121212",
        },
        light: {
          DEFAULT: "#F6F6F6",
          white: "#FFFFFF",
        }
      }
    },
  },
  plugins: [],
}
