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
        // --- Text theme (4 roles, high contrast) ------------------------
        // On light (ivory/paper): headings = hlight, content = muted.
        // On dark  (ink):         headings = hdark,  content = cdark.
        muted: "#333B47", // Color 3 — content on light (was a low-contrast grey)
        hlight: "#131A26", // Color 1 — headings on light
        hdark: "#FCFBF9", // Color 2 — headings on dark
        cdark: "#D4D9DE", // Color 4 — content on dark
      },

      // --- Typography -----------------------------------------------------
      // Modern grotesque display + humanist sans body. Anek Devanagari is
      // appended so the /hi/ locale renders cleanly using the same families.
      fontFamily: {
        display: [
          '"Space Grotesk"',
          '"Noto Sans Devanagari Variable"',
          "system-ui",
          "sans-serif",
        ],
        body: [
          '"Inter"',
          '"Noto Sans Devanagari Variable"',
          "system-ui",
          "sans-serif",
        ],
        // "mono" is used only for small UI labels (domain tags, section
        // numbers, qualifications), never real code — so use the legible body
        // sans instead of a quirky monospace.
        mono: [
          '"Inter"',
          '"Noto Sans Devanagari Variable"',
          "system-ui",
          "sans-serif",
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
