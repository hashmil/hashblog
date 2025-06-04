/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: "#FFFFFF",
        accent: "#FF5682",
        dark: "#1a1a1a",
        "dark-lighter": "#2a2a2a",
        "text-light": "#FFFFFF",
        "text-muted": "#a0a0a0",
      },
      fontFamily: {
        sans: ["Work Sans", "system-ui", "sans-serif"],
        serif: ["Libre Baskerville", "Georgia", "serif"],
        primary: ["Work Sans", "system-ui", "sans-serif"],
        secondary: ["Libre Baskerville", "Georgia", "serif"],
        text: ["Libre Baskerville", "Georgia", "serif"],
        accent: ["Work Sans", "system-ui", "sans-serif"],
      },
      fontWeight: {
        primary: "800",
        secondary: "400",
        text: "400",
        accent: "500",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #FF5682 0%, #ff8fa3 100%)",
        "gradient-dark": "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out both",
        "slide-down": "slideDown 0.5s ease-out both",
        "slide-left": "slideLeft 0.5s ease-out both",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        menu: "20px",
      },
      boxShadow: {
        "accent-glow": "0 0 20px rgba(255, 86, 130, 0.3)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
