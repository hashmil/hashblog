/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ff6b9d",
        secondary: "#c471ed",
        dark: "#1a1a1a",
        "dark-lighter": "#2a2a2a",
        "text-light": "#e5e5e5",
        "text-muted": "#a0a0a0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #ff6b9d 0%, #c471ed 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
