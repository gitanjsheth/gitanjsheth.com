# Cursor Build Brief — gitanjsheth.com

---

## What we're building

A fast, static, **fully bilingual (English + Hindi, extensible to more languages)** marketing website for an independent expert advisory firm — **G A Sheth & Associates.** The aesthetic is restrained and premium (heritage advisory / private-bank register): serif headings, generous whitespace, deep ink navy + antique gold on ivory, **no stock photography**. Polish comes from typography, spacing, and restraint.

## Tech stack (build from scratch — do NOT use a pre-made theme)

- **Astro** (latest) — static output, native i18n, fast.
- **Tailwind CSS** with the brand tokens below wired into the config.
- **Astro Content Collections** for testimonials, case studies, experts, services (content as data, not markup).
- **@fontsource** self-hosted fonts (no external font CDN).
- **Web3Forms** for the enquiry form (free, static-friendly, emails submissions).
- Deploy: **GitHub Pages** via **GitHub Actions** (the site already lives on GitHub Pages).



## Internationalisation (i18n) — core architecture, get this right first

**Symmetric, prefixed locales. No default language at the bare root.**

- Locales: `en`, `hi` (build the structure so adding `gu`, `es`, etc. later is trivial — one new locale entry + one translation set, no rearchitecting).
- Every content page lives under a locale prefix: `/en/home`, `/en/services`, `/en/case-studies`, `/hi/home`, `/hi/services`, and so on. Both languages are first-class; neither is privileged at the root.
- Astro config: `i18n: { locales: ["en","hi"], defaultLocale: "en", routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false } }` so even English is prefixed (`/en/...`). Set `site: "https://gitanjsheth.com"`.
- **The bare root** `/` **is the language gate only** (see below) — it holds no content, just routes the visitor into a locale.
- Generate every page for every locale (e.g. via `getStaticPaths` iterating the locales), so pages come from one template + per-locale strings, not hand-duplicated files. Adding a locale should not mean copy-pasting pages.
- Add **hreflang alternate** `<link>` tags in `<head>` for each locale version of a page, plus `x-default`. This makes each language independently findable in search and correct to share.



### Language gate (blocking, on first visit)

- On first ever visit, `/` shows a **full-screen blocking interstitial**: "Choose your language / भाषा चुनें", with **English pre-selected/highlighted** as default.
- On choice: store the locale in a **cookie (and/or localStorage)** and route to `/{locale}/home`.
- **Return visits:** `/` reads the stored locale and **skips the gate**, redirecting straight to `/{locale}/home`. No repeat interruption.
- Every page has a **language switcher in the header** that swaps to the same page in the other locale and updates the stored choice.
- If someone lands directly on a `/hi/...` or `/en/...` URL (shared link, search result), serve it in that language and sync the stored choice — don't force them back through the gate.



### What gets translated vs. what doesn't

- **Translated (per-locale):** all UI strings (nav, buttons, section headings, form labels, the gate), and marketing copy — Home, Our Story, the 10 service blurbs, How We Engage.
- **Translated (per-locale):** testimonial and case-study **display text too** — the pulled-quote shown on the site, plus section labels/chrome — carry a separate Hindi version (`quote_en` / `quote_hi`, and localised titles/descriptions). Case-study problem/approach/outcome are localised as well.
- **NOT translated (language-neutral, shown as-is in BOTH locales):** ONLY the **letterhead scan images** — they are photographs of physical, signed English artefacts and must never be altered or auto-translated. Everything rendered *around* them (quote text, name label, "View letter", the modal chrome) localises.
- Put UI + page copy in per-locale string files: `src/i18n/en.json`, `src/i18n/hi.json`. For now, `hi.json` may hold English placeholder values marked `TODO: Hindi` — real Hindi is added later.



## Brand tokens (Tailwind config / CSS variables)

```
Colors
  --ink:   #16233B   (primary dark — text, dark sections)
  --ink-2: #2C3A55   (secondary ink)
  --gold:  #B08A54   (accent ONLY — hairlines, small marks; never large fills)
  --ivory: #F6F1E7   (light background)
  --paper: #FFFFFF   (cards / contrast)
  --muted: #6B7280   (secondary text)

Typography (self-hosted via @fontsource)
  Display / headings: "Cormorant Garamond" (high-contrast serif, heritage)
  Body / UI:          "Inter" (clean humanist sans)
  Headings generous; all-caps get slightly open letter-spacing.
  Body line-height ~1.6, max line length ~68ch.
  UNITS: all type and layout spacing in RELATIVE units, never fixed px.
    - Use rem for type/spacing so everything scales from one root value AND honours
      the user's own browser/accessibility font setting (never override root font-size).
    - Use clamp() for anything that should flex with viewport, e.g. hero heading
      clamp(2rem, 5vw, 4rem): a sensible floor on phones, fluid with width, capped on
      large screens — fluid type without a pile of breakpoints.
    - Any size figures elsewhere in this brief are TARGET INTENT, not literal CSS —
      implement them in rem/clamp via Tailwind's scale, not hardcoded px.
    - px is reserved ONLY for hairlines/borders (a 1px gold rule stays 1px at all
      sizes) and fine fixed details (small icon strokes). Do not scale those with rem.
    - Prefer Tailwind's built-in spacing/type scale (outputs rem) and its responsive
      prefixes (md:, lg:) for breakpoints; reach for clamp() on fluid headings.
  NOTE: for Hindi, include a Devanagari-capable font (e.g. "Tiro Devanagari Hindi"
  or "Noto Serif Devanagari" for headings, "Noto Sans Devanagari" for body) via
  @fontsource, applied on the /hi/ locale.

Style rules
  - Lots of whitespace. Gold is a hairline/accent only — never big blocks.
  - Thin 1px rules for separation, not heavy boxes. Corners 0–4px.
  - Subtle, fast transitions. No parallax, no heavy animation.
```



## Brand assets & source files (use the standard Astro layout; copy my files in during setup)

My raw files currently sit in a folder named `consultancy/` with two subfolders:

- `consultancy/logo/` — GS mark SVGs (ink, reversed/ivory, black, transparent) + horizontal wordmark lockup + favicon files.
- `consultancy/letters_and_pics/` — testimonial **letter PDFs**, and **signatory photos** (JPG/jpg/jpeg/PNG) of the person who signed each letter.

**During setup, Cursor should:** create the standard Astro folders and **copy** my files into them (don't make me move things by hand):

- Logo/wordmark/favicon → `src/assets/logo/` (and favicon files → `public/`).
- Signatory photos → `src/assets/people/` (imported + optimised by Astro).
- Letter scans → handled via the conversion step below (see Testimonials), output to `public/letters/`.

Usage: reversed/ivory mark on dark (ink) sections; ink mark on light sections.

## Site structure (per locale)



### Home (`/{locale}/home`) — anchored long-scroll

1. **Header/nav** — sticky, minimal: wordmark left; links (Story, Services, Case Studies, Testimonials, Experts, How We Engage, Contact); language switcher; "Enquire" button. Clean mobile menu.
2. **Hero** — mark/name, one strong positioning line (placeholder: "The problem that belongs to no one."), sub-line, primary CTA ("Request an intro call"). Type-led, no image.
3. **Our Story** (short) — 2–3 paragraphs (placeholder).
4. **Services overview** — the 10 services as a restrained grid; each card = symptom-first title + one line. Links to Services page.
5. **Featured case study** — one highlighted (placeholder), links to Case Studies.
6. **Testimonials** — a row of **6–7 featured** short pulled-quotes (name + company) + a **"View all"** button. Pull quotes only here; never full letters inline.
7. **How We Engage** (teaser) — 3–4 lines, link to full page.
8. **Enquiry CTA band.**
9. **Footer** — contact, nav, mark, copyright.



### Dedicated pages (each per locale)

- `/{locale}/services` — all 10 services (symptom-first heading + short description). Optional `/{locale}/services/[slug]` detail — scaffold structure.
- `/{locale}/case-studies` — grid from **caseStudies** collection; `/{locale}/case-studies/[slug]` detail.
- `/{locale}/testimonials` — **all** testimonials from the **testimonials** collection. Each card:
  - the locale-appropriate pulled quote (quote_en / quote_hi);
  - the signatory's **photo in a SQUARE crop** (keep it square — max 4px corner radius; NOT circular, which reads social/casual and cheapens the gravitas) with name / company / city beside it;
  - a small **letter-thumbnail cutout** (the first-page preview) with the label **"View testimonial letter"** — the thumbnail signals it's a formal signed document before the click, since "testimonial letter" isn't a universally understood object;
  - clicking opens the **full letter PNG in a modal/lightbox** (the untranslated English artefact, shown identically in both locales; never all full letters stacked together).
- `/{locale}/experts` — empanelled experts from the **experts** collection.
- `/{locale}/how-we-engage` — engagement page. **No price list.** Prose: free first call; no upfront charge or commitment; if a visit is needed, only travel/stay at actuals; scope and consideration decided mutually once value is delivered. (Placeholder copy.)
- `/{locale}/contact` — contact details + enquiry form.



## Content Collections (content as data)

**testimonials** (one file per person; the displayed quote carries BOTH languages, the letter image is shared):

```
name, company, city, industry, date,
quote_en (SHORT, varied),   <- shown on /en/
quote_hi (SHORT, varied),   <- shown on /hi/  (placeholder "TODO: Hindi" for now)
photo (e.g. "people/dilip-bhatt.jpg")        <- signatory's face; SQUARE crop
letterImage (e.g. "/letters/swapna.png")     <- full letter scan (PNG from the conversion script)
letterThumb (e.g. "/letters/thumbs/swapna.png") <- first-page thumbnail for the preview cutout
featured (bool), order
```

Render `quote_en` on English pages and `quote_hi` on Hindi pages; render the same `letterImage` in both.
**caseStudies:** `slug, sector, client (name or "Confidential"), featured, order, image?` + localised `title/problem/approach/outcome` per locale (en + hi).
**experts:** `name, domain, blurb`
**services:** `slug, order` + localised `title/symptomLine/description` (either per-locale entries or fields keyed by locale)

Seed each with **3–5 realistic placeholder entries** so every page looks complete on first build. Mark placeholders clearly for easy find-and-replace.

## Enquiry form → email

Use **Web3Forms** (free, no server):

- POST to `https://api.web3forms.com/submit` with a hidden `access_key` (I'll create a free account tied to **[hello@gitanjsheth.com](mailto:hello@gitanjsheth.com)** — a Google Workspace mailbox — and paste the key into an env var / clearly-marked constant).
- Fields: Name, Company, Email, Phone, "What's the problem / hunch?" (textarea), hidden **honeypot**. Labels localised per locale.
- On success: clean inline confirmation, no reload jank. Submissions email to **[hello@gitanjsheth.com](mailto:hello@gitanjsheth.com)**.
- (Formspree free tier is an equivalent fallback if needed.)



## Images & letter scans — how they work (almost none)

- **No stock photography** by design.
- Real images used: the **GS mark** (SVG), **signatory photos**, and **letter scans**.
- Files in `/public` are served as-is at the site root (`public/letters/selan.jpg` -> `/letters/selan.jpg`). Signatory photos go in `src/assets/people/` (Astro-optimised).
- Do not fetch images from external URLs.



### Letter scans: convert PDFs to images first (separate script)

The letters arrive as **PDFs** in `consultancy/letters_and_pics/`. PDFs don't render inline cleanly. So:

- Cursor writes a **standalone Python script** (e.g. `scripts/convert_letters.py`) that converts every letter PDF into a **high-resolution, lossless image** — render each PDF page at ~200–300 DPI and save as **PNG** (lossless; prefer PNG over JPG to avoid text artefacts on documents). Use `pdf2image`+Poppler or `PyMuPDF` (fitz). Output to `public/letters/` with a slug filename matching each testimonial (e.g. `public/letters/swapna-srushti.png`).
- After conversion the site references only the **PNGs** — no PDFs shipped or embedded. Simpler everywhere.
- The script also generates a small **first-page thumbnail** per letter (e.g. `public/letters/thumbs/swapna-srushti.png`) for the preview cutout on the card.
- Include the script's run command in the README so re-running it after adding a new letter PDF is one step.
- Until real letters arrive, render a **clean labelled placeholder box** ("Testimonial letter — Company Name") so layouts look intentional.



## Quality bar

- **Responsive**, mobile-first (nav collapses, sections stack, comfortable tap targets).
- Interactivity is fine and expected on static hosting: the blocking language gate, header dropdowns, **letterhead lightbox/modal**, hover states, smooth transitions — all client-side JS, all work on GitHub Pages.
- **Accessible:** semantic HTML, alt text, contrast, keyboard-navigable, `lang` attribute set per locale.
- **Fast:** static output, self-hosted fonts, minimal JS. Target near-100 Lighthouse.
- **SEO:** per-page localised `<title>` + meta description, hreflang alternates + x-default, Open Graph (GS mark as OG image), `sitemap.xml` via `@astrojs/sitemap` (include both locales).
- Clean, commented, well-organised code for easy future edits via Cursor.



## Deploy — GitHub Pages via GitHub Actions

- `astro.config`: `site: "https://gitanjsheth.com"`, `base: "/"` (custom domain at apex, so base is root).
- Add `public/CNAME` containing `gitanjsheth.com` (preserves the custom domain).
- Add a GitHub Actions workflow at `.github/workflows/deploy.yml` using the official `withastro/action` to build and deploy to Pages on every push to `main`.
- In the repo: Settings → Pages → Source = **GitHub Actions**.
- DNS is already configured (the current site is on Pages). **Confirm both** `gitanjsheth.com` **and** `www.gitanjsheth.com` **resolve**, since the business-card QR points to `www` — if `www` doesn't load, add the DNS record so it redirects to the apex.
- Every `git push` to `main` redeploys automatically.



## Deliverables from Cursor (in order)

1. Scaffold Astro + Tailwind + i18n (locales en/hi, prefixed, symmetric) + self-hosted fonts (incl. Devanagari) + brand tokens. Create the standard folders and **copy** my files from `consultancy/logo/` and `consultancy/letters_and_pics/` into them (logos -> src/assets/logo + favicon -> public; photos -> src/assets/people).
2. Build the bare-root **language gate** (blocking first-visit, cookie/localStorage memory, English default, return-visit skip).
3. Build the Home long-scroll + all dedicated pages, generated per locale from templates + per-locale string files.
4. Write `scripts/convert_letters.py` (PDF -> lossless PNG + thumbnails into public/letters/), and create the four content collections + 3–5 placeholder entries each.
5. Wire the enquiry form (Web3Forms, key as env/constant), localised labels.
6. Add SEO/meta/hreflang/OG/sitemap, favicon, per-locale `lang`.
7. Add the GitHub Actions deploy workflow + `CNAME`.
8. Write a short README: run locally, add a testimonial/case study, add a new language, deploy.

