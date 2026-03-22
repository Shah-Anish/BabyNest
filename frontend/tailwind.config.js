/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          from: { height: "0", opacity: "0" },
          to: { height: "auto", opacity: "1" },
        },
        slideUp: {
          from: { height: "auto", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
      },
      animation: {
        slideDown: "slideDown 0.2s ease-out",
        slideUp: "slideUp 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
