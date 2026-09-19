/**
 * Site-wide constants & environment-backed settings.
 *
 * WEB3FORMS_ACCESS_KEY: create a free account at https://web3forms.com tied to
 * hello@gitanjsheth.com and paste the key here or, preferably, set it in a
 * `.env` file as PUBLIC_WEB3FORMS_ACCESS_KEY (Astro exposes PUBLIC_* to the
 * client, which the enquiry form needs). The literal below is the fallback so
 * the site builds before the key exists.
 */
// Web3Forms access keys are public by design (used from the browser), so the
// real key ships in the client bundle. An env override still wins if set.
export const WEB3FORMS_ACCESS_KEY =
  import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ||
  "ba5e1ab6-1559-4f28-8b4a-efda20365b88";

export const CONTACT_EMAIL = "hello@gitanjsheth.com";

/** Cookie/localStorage key the language gate reads & writes. */
export const LOCALE_STORAGE_KEY = "gsco_locale";
