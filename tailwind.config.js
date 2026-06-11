/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* ── Colors ───────────────────────────────────────── */
      colors: {
        slate: {
          950: "#0B0F19", // new base bg
          925: "#0F1320",
          900: "#111827",
        },
        accent: {
          blue: "#38BDF8",
          teal: "#2DD4BF",
          purple: "#A78BFA",
        },
      },

      /* ── Typography ───────────────────────────────────── */
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },

      /* ── Letter spacing ───────────────────────────────── */
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.04em",
        tight: "-0.03em",
      },

      /* ── Border radius ────────────────────────────────── */
      borderRadius: {
        "2xl": "18px",
        "3xl": "24px",
        "4xl": "32px",
      },

      /* ── Box shadows ──────────────────────────────────── */
      boxShadow: {
        "glow-blue": "0 0 32px rgba(56,189,248,0.35)",
        "glow-teal": "0 0 32px rgba(45,212,191,0.35)",
        "glow-purple": "0 0 32px rgba(167,139,250,0.35)",
        card: "0 24px 48px rgba(0,0,0,0.35)",
        "card-hover": "0 32px 64px rgba(0,0,0,0.5)",
      },

      /* ── Animations ───────────────────────────────────── */
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.5s ease both",
        "slide-right": "slide-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
      },

      /* ── Background sizes ─────────────────────────────── */
      backgroundSize: {
        300: "300% 300%",
      },
    },
  },
  plugins: [],
};
