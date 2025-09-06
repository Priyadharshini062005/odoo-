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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "850px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    animation: {
      blink: "blink 2s infinite",
      fadeIn: "fadeIn 5s ease-in-out",
    },
    keyframes: {
      blink: {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0" },
      },
      fadeIn: {
        "0%": { opacity: "0" },
        "100%": { opacity: "1" },
      },
    },
    plugins: [],
  },
};
export default config;
