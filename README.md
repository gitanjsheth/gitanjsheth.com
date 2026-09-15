# Gitanj Sheth & Co. — website

A fast, static, **fully bilingual (English + Hindi)** marketing site for an
independent expert advisory firm. Built from scratch with **Astro**, **Tailwind
CSS**, **Astro Content Collections**, and **self-hosted fonts**. Deploys to
**GitHub Pages** via **GitHub Actions**.

- **No stock photography** — polish comes from typography, spacing and restraint.
- **Symmetric, prefixed locales** (`/en/...`, `/hi/...`); the bare root `/` is a
  language gate only.
- Adding a third language is a two-step change (see below) — no page rewrites.

---

## Run locally

Prereqs: **Node 18+** and **npm** (this project was built with Node 26).

```bash
npm install
npm run dev        # http://localhost:4321
```

Other scripts:

```bash
npm run build      # static build into dist/
npm run preview    # serve the built dist/ locally
npm run letters    # convert letter PDFs -> PNGs (see below)
```

> If `astro` errors trying to write telemetry config in a locked environment,
> prefix commands with `ASTRO_TELEMETRY_DISABLED=1`.

---

## Project layout

```
src/
  i18n/            en.json, hi.json  (all UI + copy)  + utils.ts (locale helpers)
  content/         services/ testimonials/ caseStudies/ experts/  (content as data)
  content.config.ts  collection schemas (bilingual fields)
  layouts/         BaseLayout.astro  (head, SEO, hreflang, fonts, header/footer)
  components/      Header, Footer, Logo, LanguageSwitcher, ServiceCard,
                   TestimonialQuote, TestimonialCard, EnquiryForm
  pages/
    index.astro           the bare-root LANGUAGE GATE
    [locale]/             home, services, case-studies, testimonials, experts,
                          how-we-engage, contact  (generated per locale)
  assets/          logo/  people/   (imported + optimised by Astro)
  styles/global.css   brand tokens + component classes
public/            favicon, og-image, CNAME, robots.txt, letters/ (generated)
scripts/           convert_letters.py
.github/workflows/ deploy.yml
```

Everything renders from **one template per page** iterating the locales, so the
`/en/` and `/hi/` trees are always in sync.

---

## Editing content

All display content lives as JSON data (not markup).

### Add / edit a testimonial

Create `src/content/testimonials/<slug>.json`:

```json
{
  "name": "Dilip Bhatt",
  "company": "Srushti Industries",
  "field": "Manufacturing",
  "quote_en": "Short pulled quote shown on /en/.",
  "quote_hi": "वही उद्धरण, /hi/ पर दिखाया गया।",
  "photo": "people/dilip-bhatt.jpg",
  "letterImage": "/letters/dilip-bhatt.png",
  "letterThumb": "/letters/thumbs/dilip-bhatt.png",
  "featured": true,
  "order": 1
}
```

- `photo` is a **square-cropped** signatory face in `src/assets/people/`.
- `letterImage` / `letterThumb` come from the PDF conversion step below. Omit
  them (or drop `placeholder: true`) and the card shows a clean labelled
  placeholder box until the real letter exists.
- Remove `"placeholder": true` once an entry is real (it drives the small
  "placeholder" badge).

### Add / edit a case study, service, or expert

Add a JSON file under the matching `src/content/<collection>/` folder. Localised
fields carry both languages, e.g. `"title": { "en": "...", "hi": "..." }`.
Services also have a `category` (`flagship`, `strategy`, `technology`,
`operations`, `finance`) and an `order`.

Seed entries are clearly marked (`"placeholder": true`, obvious sample names) so
they're easy to find and replace.

---

## Letter scans: PDF → image

Testimonial letters arrive as **PDFs** in `letters_and_pics/`. Convert them to
lossless PNGs (plus first-page thumbnails) before they can be shown:

```bash
pip install pymupdf pillow
npm run letters          # or: python3 scripts/convert_letters.py
```

This writes `public/letters/<slug>.png` and `public/letters/thumbs/<slug>.png`,
and prints the exact `letterImage` / `letterThumb` values to paste into each
testimonial JSON. Re-run it whenever you add a new letter PDF, then commit the
generated PNGs (they ship with the site — CI does not run Python).

Options: `--src`, `--out`, `--dpi` (default 250), `--thumb-width` (default 400).

---

## Adding a new language (e.g. Gujarati `gu`)

1. Add the code in **two** places:
   - `astro.config.mjs` → `i18n.locales` and the sitemap `i18n.locales`.
   - `src/i18n/utils.ts` → `locales`, `localeLabels`, `localeHreflang`.
2. Copy `src/i18n/en.json` to `src/i18n/gu.json` and translate the values;
   import it in `src/i18n/utils.ts` (`dictionaries`).
3. Add the matching `gu` field to each content JSON's localised objects (and
   `quote_gu` for testimonials + read it in `TestimonialCard`/home).

No page files need to change — every route is generated per locale.

---

## Enquiry form (Web3Forms)

The contact form posts to **Web3Forms** (free, static-friendly; emails to
`hello@gitanjsheth.com`). Create a free account at
[web3forms.com](https://web3forms.com) and set the access key:

- Locally: copy `.env.example` to `.env` and set
  `PUBLIC_WEB3FORMS_ACCESS_KEY`.
- In CI: add it as a repo secret (`Settings → Secrets → Actions →
  PUBLIC_WEB3FORMS_ACCESS_KEY`); the workflow already passes it through.

Until a key is set, the form renders and validates but submissions will fail —
the fallback constant lives in `src/config.ts`.

---

## Deploy — GitHub Pages via GitHub Actions

- `astro.config.mjs` sets `site: "https://gitanjsheth.com"` and `base: "/"`.
- `public/CNAME` preserves the custom apex domain.
- `.github/workflows/deploy.yml` builds with the official `withastro/action`
  and deploys on every push to `main`.

One-time repo setup: **Settings → Pages → Source = GitHub Actions**.

DNS is already configured. Confirm **both** `gitanjsheth.com` and
`www.gitanjsheth.com` resolve (the business-card QR points at `www`); if `www`
doesn't load, add a DNS record so it redirects to the apex.

---

## Notes for future edits

- **Hindi copy is a first-pass draft** (`src/i18n/hi.json` + the `hi` fields in
  content) — have a native speaker review before launch. The firm name is kept
  in Latin to match the wordmark.
- **Testimonials are placeholders.** Real letters/photos sit in
  `letters_and_pics/`; run the conversion script and replace the placeholder
  JSON when ready.
- **Favicon & wordmark** currently derive from the GS mark. Drop in dedicated
  files (`public/favicon.svg`, a horizontal wordmark) when available.
- Brand tokens live in `tailwind.config.mjs` and mirror `:root` vars in
  `src/styles/global.css`. Type/spacing use `rem`/`clamp()`; `px` is reserved
  for hairlines only.
