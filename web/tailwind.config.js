/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF9F6",
        "paper-dim": "#F1EFE9",
        ink: "#1C1B1A",
        "ink-soft": "#5B5850",
        rule: "#E4E1D8",
        pen: "#3B4A6B",
        "pen-soft": "#5A6A8F",
        sage: "#6B7B5E",
        rust: "#A23E32",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        sm: "3px",
      },
    },
  },
  plugins: [],
};
