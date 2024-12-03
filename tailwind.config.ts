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
          DEFAULT: "#4A6FA5", // Softer blue
          dark: "#3B5883",
        },
        secondary: {
          DEFAULT: "#98B6E4", // Light periwinkle
          dark: "#7B9AD8",
        },
        accent: {
          DEFAULT: "#E4A853", // Warm gold
          dark: "#D19443",
        },
        warning: "#E4C7B7", // Soft peach
        background: "#F5F7FA", // Light gray-blue
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Pacifico", "cursive"],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
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
      },
    },
  },
  // eslint-disable-next-line
  plugins: [require("tailwindcss-animate")],
};
export default config;
