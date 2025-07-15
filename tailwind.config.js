/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        twitter: {
          blue: '#1DA1F2',
          'dark-blue': '#1A91DA',
          black: '#14171A',
          'dark-gray': '#657786',
          'light-gray': '#AAB8C2',
          'extra-light-gray': '#E1E8ED',
          'extra-extra-light-gray': '#F7F9FA',
        },
      },
    },
  },
  plugins: [],
} 