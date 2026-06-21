/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Slate-blue primary — professional, trustworthy, property-market feel
        primary:  { DEFAULT: "#1D3557", light: "#2E4F78", hover: "#162840" },
        // Warm amber accent — warmth of home, cuts through the dark blue
        accent:   { DEFAULT: "#E07B39", hover: "#C86A2A" },
        // Clean off-white surface — not pure white, easier on the eyes
        surface:  { DEFAULT: "#F7F5F2", card: "#FFFFFF", border: "#E5E1DB" },
        // Text scale
        ink:      { DEFAULT: "#1A1A2E", muted: "#6B7280", light: "#9CA3AF" },
      },
      fontFamily: {
        display: ["'DM Serif Display'", "Georgia", "serif"],
        body:    ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
