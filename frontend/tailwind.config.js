/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e8f5ee",
          100: "#c3e6d0",
          200: "#9ad6b0",
          300: "#6ec690",
          400: "#4dba78",
          500: "#2aad61",
          600: "#1d9e56",
          700: "#0d8c48",
          800: "#007a3b",
          900: "#005a25",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
