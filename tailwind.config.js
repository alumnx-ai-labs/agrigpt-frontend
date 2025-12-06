/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,tsx}",
    "./src/pages/**/*.{js,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          default: 'rgb(55, 53, 47)',
          secondary: 'rgba(55, 53, 47, 0.65)',
          tertiary: 'rgba(55, 53, 47, 0.4)',
          blue: 'rgb(35, 131, 226)',
          green: 'rgb(15, 123, 108)',
          red: 'rgb(235, 87, 87)',
        },
        'notion-bg': {
          default: 'rgb(255, 255, 255)',
          gray: 'rgb(251, 251, 250)',
          hover: 'rgba(55, 53, 47, 0.04)',
          active: 'rgba(55, 53, 47, 0.08)',
        }
      },
    },
  },
  plugins: [],
}
