import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "pulse-scale": "pulse-scale 2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "stagger-1": "fade-in-up 0.4s ease-out 0.1s both",
        "stagger-2": "fade-in-up 0.4s ease-out 0.2s both",
        "stagger-3": "fade-in-up 0.4s ease-out 0.3s both",
        "stagger-4": "fade-in-up 0.4s ease-out 0.4s both",
        "fade-up": "fade-up 0.2s ease-out forwards",
        "fade-down": "fade-down 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
