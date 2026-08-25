/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        tinder: {
          primary: "#000000",
          "primary-content": "#ffffff",
          secondary: "#e8e8e8",
          "secondary-content": "#000000",
          accent: "#cd130a",
          "accent-content": "#ffffff",
          neutral: "#cb1130",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#ffffff",
          "base-300": "#ffffff",
          "base-content": "#000000",
          info: "#4592e3",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#cd130a",
        },
      },
    ],
  },
};
