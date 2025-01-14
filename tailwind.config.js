/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E97F5",
        "primary-light": "#36D3FF",
        "check-border": "#E7E6E7",
      },
    },
  },
  plugins: [],
};
