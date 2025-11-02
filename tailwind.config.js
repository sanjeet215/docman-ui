import { Config } from "tailwindcss";

module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
        lightBgCust: '#F2EFE7',
        lightBgSecondarCust: '#9ACBD0',
        lightButtonCust: '#2973B2',
        lightButtonHoverCust: '#48A6A7',
        lightTextCust: '#09122C',

        darkBgCust: '#09122C',
        darkBgSecondarCust: '#872341',
        darkButtonCust: '#BE3144',
        darkButtonHoverCust: '#E17564',
        darkTextCust: '#FFFDF0',

      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
