const { colors } = require('./src/utils/colors');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        lightBg: colors.lightBg, 
        darkText: colors.darkText, 

        // Dark mode colors
        darkBg: colors.darkBg,
        secDarkBg: colors.secDarkBg,
        lightDark: colors.lightDark,
        lightText: colors.lightText, 

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

