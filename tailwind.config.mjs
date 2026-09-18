/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      // --- Brand palette --------------------------------------------------
      // Gold is an ACCENT ONLY (hairlines, small marks) — never large fills.
      colors: {
        ink: {
          DEFAULT: "#16233B", // primary dark — text, dark sections
          2: "#2C3A55", // secondary ink
        },
        gold: "#B08A54", // accent only — surgical use
        ivory: "#F7F5F1", // clean warm-white background
        paper: "#FFFFFF", // cards / contrast
        muted: "#6B7280", // secondary text
      },

      // --- Typography -----------------------------------------------------
      // Modern grotesque display + humanist sans body. Anek Devanagari is
      // appended so the /hi/ locale renders cleanly using the same families.
      fontFamily: {
        display: [
          '"Space Grotesk"',
          '"Anek Devanagari Variable"',
          "system-ui",
          "sans-serif",
        ],
        body: [
          '"Inter"',
          '"Anek Devanagari Variable"',
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"Space Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },

      // Max comfortable line length (~68ch) for body copy.
      maxWidth: {
        prose: "68ch",
      },

      letterSpacing: {
        // Slightly open tracking for all-caps labels.
        caps: "0.12em",
      },

      borderRadius: {
        // Corners 0–4px only.
        card: "4px",
      },

      transitionDuration: {
        // Subtle, fast transitions.
        250: "250ms",
      },
    },
  },
  plugins: [],
};
