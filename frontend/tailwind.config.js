/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: { DEFAULT: "#0A0908", soft: "#131110" },
        reel: { DEFAULT: "#171310", line: "#2B241C" },
        amber: { DEFAULT: "#E8A33D", soft: "#F2C778", dim: "#8A631F" },
        ember: { DEFAULT: "#D65B3D", soft: "#E88764" },
        parchment: { DEFAULT: "#EDE6D6", dim: "#C9C0AC" },
        fog: { DEFAULT: "#9C9385" },
      },
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
        body: ["'Manrope'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "vignette": "radial-gradient(ellipse at center, transparent 40%, #0A0908 100%)",
        "fade-up": "linear-gradient(to top, #0A0908 0%, rgba(10,9,8,0.85) 25%, rgba(10,9,8,0.15) 60%, transparent 100%)",
        "fade-side": "linear-gradient(to right, #0A0908 0%, rgba(10,9,8,0.5) 35%, transparent 70%)",
        "sprocket": "repeating-linear-gradient(to right, #E8A33D 0 6px, transparent 6px 16px)",
      },
      boxShadow: {
        glow: "0 0 0 2px rgba(232,163,61,0.9), 0 18px 40px -12px rgba(0,0,0,0.85)",
      },
      keyframes: {
        fadein: { "0%": { opacity: "0", transform: "translateY(10px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        reelspin: { "0%": { strokeDashoffset: "0" }, "100%": { strokeDashoffset: "-126" } },
        "scroll-up": { "0%": { transform: "translateY(0)" }, "100%": { transform: "translateY(-50%)" } },
      },
      animation: {
        fadein: "fadein 0.6s ease-out both",
        reelspin: "reelspin 3s linear infinite",
        "scroll-up-slow": "scroll-up 34s linear infinite",
        "scroll-up-fast": "scroll-up 15s linear infinite",
      },
    },
  },
  plugins: [],
}
