import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,html,js}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        parchment: {
          50: "#FDFBF7",
          100: "#F7F3E9",
          200: "#EFE6D5",
          900: "#2A2418",
        },
        midnight: {
          900: "#0B132B",
          950: "#050914",
        },
        gold: {
          400: "#E6C659",
          500: "#D4AF37",
          600: "#B89528",
        },
        zinc: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "Merriweather", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
