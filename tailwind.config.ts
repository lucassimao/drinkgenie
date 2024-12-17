import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A6FA5",
          dark: "#3B5883",
        },
        secondary: {
          DEFAULT: "#98B6E4",
          dark: "#7B9AD8",
        },
        accent: {
          DEFAULT: "#E4A853",
          dark: "#D19443",
        },
        warning: "#E4C7B7",
        background: "#F5F7FA",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Pacifico", "cursive"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        "toast-slide-in":
          "toast-slide-in 0.3s cubic-bezier(0.21, 1.02, 0.73, 1)",
        "toast-progress": "toast-progress linear forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "toast-slide-in": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "toast-progress": {
          "0%": { transform: "scaleX(1)" },
          "100%": { transform: "scaleX(0)" },
        },
      },
    },
  },
  // eslint-disable-next-line
  plugins: [require("tailwindcss-animate")],
};
export default config;
