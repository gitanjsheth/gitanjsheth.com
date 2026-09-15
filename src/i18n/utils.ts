/**
 * i18n helpers — single source of truth for locales and string lookup.
 *
 * Adding a language later is a two-step change:
 *   1. Add its code to `locales` below (and to `astro.config.mjs`).
 *   2. Add `src/i18n/<code>.json` (copy en.json, translate the values).
 * Every page is generated from templates via `getStaticPaths`, so no page
 * files need to be touched.
 */
import en from "./en.json";
import hi from "./hi.json";

export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Human-facing label for each locale (shown in the switcher & gate). */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
};

/** `lang`/`hreflang` attribute value for each locale (BCP-47). */
export const localeHreflang: Record<Locale, string> = {
  en: "en",
  hi: "hi",
};

const dictionaries: Record<Locale, Record<string, any>> = { en, hi };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** The full string dictionary for a locale. */
export function getStrings(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/**
 * Returns a translation function `t("a.b.c")` scoped to a locale.
 * Falls back to the default locale, then to the key itself, so a missing
 * string is visible rather than crashing the build.
 */
export function useTranslations(locale: Locale) {
  const dict = getStrings(locale);
  const fallback = getStrings(defaultLocale);
  return function t(key: string): any {
    return lookup(dict, key) ?? lookup(fallback, key) ?? key;
  };
}

function lookup(obj: Record<string, any>, key: string): any {
  return key.split(".").reduce<any>((acc, part) => (acc == null ? acc : acc[part]), obj);
}

/** Build a locale-prefixed, base-aware path, e.g. localizePath("hi", "services"). */
export function localizePath(locale: Locale, path = ""): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, ""); // "" when base is "/"
  const clean = path.replace(/^\/+/, "");
  return `${base}/${locale}${clean ? `/${clean}` : ""}`;
}

/** Extract the locale from a URL pathname; null if none present. */
export function getLocaleFromPath(pathname: string): Locale | null {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const seg = rest.replace(/^\/+/, "").split("/")[0];
  return isLocale(seg) ? seg : null;
}

/**
 * Given the current locale and the "page path" (locale-less, e.g. "services"
 * or "case-studies/foo"), return the same page in another locale.
 */
export function switchLocalePath(target: Locale, pagePath: string): string {
  return localizePath(target, pagePath);
}

/** `getStaticPaths` helper: one route per locale. */
export function localeStaticPaths() {
  return locales.map((locale) => ({ params: { locale }, props: { locale } }));
}
