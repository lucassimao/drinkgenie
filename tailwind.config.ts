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
      screens: {
        // md: "640px", // instead of 768
      },

      colors: {
        palette: {
          yale_blue: {
            DEFAULT: "#083d77",
            100: "#020c18",
            200: "#031930",
            300: "#052548",
            400: "#07325f",
            500: "#083d77",
            600: "#0d63bf",
            700: "#2889f0",
            800: "#70b0f5",
            900: "#b7d8fa",
          },
          beige: {
            DEFAULT: "#ebebd3",
            100: "#3d3d1c",
            200: "#7a7a38",
            300: "#b2b258",
            400: "#cece95",
            500: "#ebebd3",
            600: "#eeeedb",
            700: "#f2f2e4",
            800: "#f7f7ed",
            900: "#fbfbf6",
          },
          naples_yellow: {
            DEFAULT: "#f4d35e",
            100: "#3f3204",
            200: "#7e6509",
            300: "#bd970d",
            400: "#efc21e",
            500: "#f4d35e",
            600: "#f6dc7d",
            700: "#f8e59e",
            800: "#faedbe",
            900: "#fdf6df",
          },
          sandy_brown: {
            DEFAULT: "#ee964b",
            100: "#391d05",
            200: "#723b0b",
            300: "#ab5810",
            400: "#e47615",
            500: "#ee964b",
            600: "#f1ab6d",
            700: "#f5c092",
            800: "#f8d5b6",
            900: "#fceadb",
          },
          tomato: {
            DEFAULT: "#f95738",
            100: "#3b0b02",
            200: "#771704",
            300: "#b22206",
            400: "#ed2e07",
            500: "#f95738",
            600: "#fa7a61",
            700: "#fb9b88",
            800: "#fdbdb0",
            900: "#feded7",
          },
        },

        background: "var(--naples-yellow)",
        foreground: "hsl(var(--foreground))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "var(--tomato)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  // eslint-disable-next-line
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/line-clamp")],
};
export default config;
