/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        devtinder: {
          primary: "#ff3d71",
          "primary-content": "#ffffff",
          secondary: "#ff8a3d",
          "secondary-content": "#ffffff",
          accent: "#8b5cf6",
          "accent-content": "#ffffff",
          neutral: "#1c2030",
          "neutral-content": "#e6e8ef",
          "base-100": "#0b0d14",
          "base-200": "#121521",
          "base-300": "#1b1f2e",
          "base-content": "#e6e8ef",
          info: "#38bdf8",
          success: "#22c55e",
          warning: "#fbbf24",
          error: "#f43f5e",
          "--rounded-box": "1.25rem",
          "--rounded-btn": "0.75rem",
          "--rounded-badge": "9999px",
          "--btn-focus-scale": "0.97",
        },
      },
    ],
  },
};
