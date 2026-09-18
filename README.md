# Gitanj Sheth — website

A fast, static, **fully bilingual (English + Hindi)** marketing site for
**Gitanj Sheth** (the person, foregrounded) / **G A Sheth & Associates** (the
firm entity). Built from scratch with **Astro**, **Tailwind CSS**, **Astro
Content Collections**, and **self-hosted fonts** (Space Grotesk display · Space
Mono eyebrows · Inter body · Anek Devanagari for /hi/). Deploys to **GitHub
Pages** via **GitHub Actions**.

> **Naming:** the site leads with the person, **Gitanj Sheth** (masthead,
> narrative). The firm entity, **G A Sheth & Associates**, is the vehicle and
> lives in the footer, contact block, engagement terms, `author` meta and
> copyright. Both are set in `src/i18n/*.json` under `site.person` / `site.firm`.

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
  components/      Header (About/Work dropdowns), Footer, Logo, LanguageSwitcher
                   (globe + dropdown), FounderPortrait, TestimonialsCarousel,
                   EnquiryForm
  pages/
    index.astro           the bare-root LANGUAGE GATE
    [locale]/             home, gitanj-sheth, case-studies, testimonials,
                          experts, how-we-engage, contact  (generated per locale)
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

### Add / edit a case study or expert

Add a JSON file under the matching `src/content/<collection>/` folder. Localised
fields carry both languages, e.g. `"title": { "en": "...", "hi": "..." }`.

Seed entries are clearly marked (`"placeholder": true`, obvious sample names) so
they're easy to find and replace.

> **Services** are no longer a public page. Home presents two open categories —
> **Repair** and **Boost** (static curated copy in `i18n` under `solutions`) —
> deliberately not enumerated as fixed sub-services. The `services/` content
> collection and schema are retained as data (unused by the UI) for possible
> reuse as case-study tags later.

### The founder ("The Person")

Copy lives in `i18n` under `person` (positioning, `trackRecord[]` of
value/label proof points, education, roles, pedigree, why, selectivity). It
drives both the Home founder section and the dedicated `/{locale}/gitanj-sheth`
page. Drop the real editorial portrait at `src/assets/people/gitanj.jpg` (any
common extension) — `FounderPortrait.astro` swaps the placeholder for it
automatically.

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
   `quote_gu` for testimonials + read it in `TestimonialsCarousel`).

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
  content) — have a native speaker review before launch. Firm/person names are
  kept in Latin in the masthead to match the wordmark; the founder section
  heading uses Devanagari.
- **Testimonials are placeholders.** Real letters/photos sit in
  `letters_and_pics/`; run the conversion script and replace the placeholder
  JSON when ready. The testimonials carousel shows a square photo + a faded
  letter-glimpse; supplying `letterImage` turns the glimpse into a clickable
  lightbox.
- **Founder portrait** placeholder shows until `src/assets/people/gitanj.jpg`
  is supplied (used in the hero, the Home founder section, and the dedicated
  page).
- **Favicon & wordmark** currently derive from the GS mark. Drop in dedicated
  files (`public/favicon.svg`, a horizontal wordmark) when available.
- Brand tokens live in `tailwind.config.mjs` and mirror `:root` vars in
  `src/styles/global.css`. Type/spacing use `rem`/`clamp()`; `px` is reserved
  for hairlines only.
