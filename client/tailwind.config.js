/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    './components/**/*.{html,js}'
  ],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '998px',
        xl: '1440px',
      },
      colors: {
        background: '#F2F2F2',
        primary: '',
        secundary: '',
        accent: '#3296BE',
        accentHover: '#367e9b',
        focusRing:'#3195BD',
        darkBg: '#1D1D1E',
        darkSecundaryBg: '#101011',
        darkPrimary: '',
        darkSecundary: '',
        darkAccent: '',
        darkAccentHover: '',
        translated:'#e3e3e3',
        translatedDark:'#2d2d2d',
        translateBt:'#F2F2F2',
        translatedBtDark:''
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif']
      }
    },
  },
  plugins: [require('tailwind-scrollbar'), require('@tailwindcss/forms')],
}