import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2e7d32",
          greenLight: "#4caf50",
          greenDark: "#1b5e20",
          blue: "#1565c0",
          blueLight: "#1976d2",
          blueDark: "#0d47a1",
          terracotta: "#d84315",
          terracottaLight: "#ff6f43",
          terracottaDark: "#bf360c",
          bg: "#f4f7f4",
          card: "#ffffff",
          sand: "#fdfbf7",
          olive: "#558b2f",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Poppins", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(46, 125, 50, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        card: "0 10px 30px -5px rgba(21, 101, 192, 0.07), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        elevated: "0 20px 40px -8px rgba(46, 125, 50, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
