const { colors } = require('./src/utils/colors');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '360px',
      },
      colors: {
        // Light mode colors
        lightBg: colors.lightBg,
        darkerLightBg: colors.darkerLightBg,
        darkText: colors.darkText, 

        // Dark mode colors
        darkBg: colors.darkBg,
        secDarkBg: colors.secDarkBg,
        lightDark: colors.lightDark,
        lightText: colors.lightText,

        lightHighlight: colors.lightHighlight,
        darkHighlight: colors.darkHighlight,

        primary: colors.primary, 
        darkDrawer: colors.darkDrawer, 

        darkBlue: colors.darkBlue,
        mangaItemBg: colors.mangaItemBg,
      }
    },
  },
  plugins: [],
  darkMode: "class",
}

