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
      },
      animation: {
        'neural-drift': 'neural-drift 8s ease-in-out infinite',
        'neural-warp': 'neural-warp 4s ease-in-out infinite',
        'scan-y': 'scan-y 3.5s linear infinite',
      },
      keyframes: {
        'neural-drift': {
          '0%, 100%': { transform: 'scale(1.0) translate(0, 0) skew(0deg) perspective(500px) rotateY(0deg)' },
          '25%': { transform: 'scale(1.1) translate(3%, 1.5%) skew(2deg) perspective(500px) rotateY(4deg)' },
          '50%': { transform: 'scale(1.05) translate(-2%, 3%) skew(-2deg) perspective(500px) rotateX(4deg)' },
          '75%': { transform: 'scale(1.15) translate(1.5%, -2%) skew(1deg) perspective(500px) rotateY(-4deg)' },
        },
        'neural-warp': {
          '0%, 100%': { opacity: '0.8', filter: 'brightness(1.2) contrast(1.1)' },
          '50%': { opacity: '1.0', filter: 'brightness(1.4) contrast(1.3)' },
        },
        'scan-y': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        }
      }
    },
  },
  plugins: [],
}
