// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// The production site. Custom domain sits at the apex, so `base` is root ("/").
const SITE = "https://gitanjsheth.com";

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: "/",
  trailingSlash: "ignore",

  // --- Internationalisation ---------------------------------------------
  // Symmetric, prefixed locales. Even the default locale (en) is prefixed
  // (`/en/...`), so neither language is privileged at the bare root.
  // Adding a new locale later = one entry here + one `src/i18n/<code>.json`.
  i18n: {
    locales: ["en", "hi"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      // Emit hreflang alternates in the sitemap for both locales.
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", hi: "hi" },
      },
    }),
  ],
});
