/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          beige: "#F5F0E8",
          cream: "#FDFAF5",
          sand: "#E8DDD0",
          dark: "#1C1C1C",
          charcoal: "#2A2A2A",
          warm: "#8B7355",
          accent: "#C9A96E",
          muted: "#6B5F55",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        display:  ["'DM Serif Display'", "Georgia", "serif"],
        body:     ["'DM Serif Display'", "Georgia", "serif"],
        artistic: ["'DM Serif Display'", "Georgia", "serif"],
        sans:     ["'DM Sans'", "'Jost'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
