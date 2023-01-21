/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#FFAE35',
        },
        secondary: {
          400: '#242424',
        },
        'in-secondary': {
          400: '#FFFFFF',
        },
      },
    },
    fontFamily: {
      sans: ['Cedarville Cursive', 'cursive'],
    },
  },
  plugins: [],
}
