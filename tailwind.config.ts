import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        indigo: {
          50: "#F3F0EC",
          100: "#E8E1D7",
          200: "#D0C1A9",
          300: "#B29F82",
          400: "#84644E",
          500: "#5C341E",
          600: "#4A2918",
          700: "#3D2113",
          800: "#351D11",
          900: "#2F180B",
          950: "#190C05",
        },
        sky: {
          50: "#FFFAEF",
          100: "#FFF2CF",
          200: "#FFE49C",
          300: "#FFD36A",
          400: "#E7BA55",
          500: "#D0C1A9",
          600: "#B9873B",
          700: "#95662E",
          800: "#764F2A",
          900: "#624226",
          950: "#38220F",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
