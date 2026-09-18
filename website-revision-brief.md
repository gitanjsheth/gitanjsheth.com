# Website Revision Brief — gitanjsheth.com (v5, applied to the existing project)

These are **revisions to the site already scaffolded**, not a rebuild. Keep the stack (Astro + Tailwind + i18n + GitHub Pages), the content-as-data structure, the PDF→PNG letter conversion, and the bilingual /en/ /hi/ routing. Change what's below.

---

## 0. Naming (applies everywhere)

- **Firm / legal entity:** "G A Sheth & Associates" — this is the *vehicle*. Use it in the footer, How-We-Engage / engagement terms, contact block, legal/meta, and copyright.
- **Foregrounded brand:** "Gitanj Sheth" — the *person*. The site's masthead and narrative lead with the person, not the firm.
- Replace every remaining "Gitanj Sheth & Co." string accordingly.



## 1. Design direction — shift from "heritage" to "contemporary authority"

The current look reads like a 120-year-old law/wealth firm. Move it to *modern, sharp, confident, still serious* — the register of a modern strategy/design studio, NOT a startup and NOT a private bank.

- **Typography (biggest lever):** replace the delicate high-contrast serif (Cormorant Garamond) with a **modern grotesque display** for headings — use **Space Grotesk** or **General Sans** (free, self-host via @fontsource) — paired with **Inter** for body. Drop the old serif entirely. (Devanagari: pair with a clean modern Devanagari like **Anek Devanagari** for /hi/.)
- **Alignment:** left-align all section headings and the closing CTA (remove centered blocks). Bigger type-scale jumps between heading and body.
- **Eyebrow labels** ("OUR STORY", "WHAT WE DO"): set in a **tight tracked mono or grotesque caps**, not gold serif caps. Consider a monospace (e.g. Space Mono) for these labels — reads "modern studio".
- **Buttons:** solid confident fill (ink or accent), not thin outlines.
- **Palette:** keep **ink navy** `#16233B` as the serious anchor. Shift the background from parchment-ivory toward a **cleaner warm white** (`#F7F5F1` or lighter). Keep **gold** `#B08A54` but use it *surgically* (small accents/hairlines), not as the dominant accent — it's aging the page when overused.
- **Units:** all type/spacing in `rem`/`clamp()` as already specified; px only for hairlines. (Unchanged.)



## 2. Header / navigation (rebuild)

- Generous space after the masthead; do not cram links against the name.
- Reduce to **4 top-level items + Enquire button + language switcher**, evenly spaced:
  1. **About** ▾ (dropdown, opens on hover AND click): *Our Story*, *Gitanj Sheth, Empanelled Experts*
  2. **Work** ▾ (dropdown): *Case Studies*, *Testimonials*
  3. **How We Engage** (single link)
  4. **Contact** (single link)
  - **Enquire** button (solid, right)
  - **Language switcher** (see §7)
- Dropdowns: clean panel, accessible (keyboard + hover + click), closes on outside click. No "Testimonials" as a bare top-level item.
- Sticky, slim, single row on desktop; hamburger on mobile.



## 3. Hero (rework — currently empty)

- **Split layout:** left column = eyebrow (mono caps) + the big statement ("The problem that belongs to no one.") + one-line subhead + a solid CTA ("Request an intro call"). Right column = **an editorial portrait of Gitanj** (placeholder square/portrait box until the real photo is supplied; put it at `src/assets/people/gitanj.jpg`).
- The portrait both fills the void and foregrounds the person from the first screen.
- Vertically balance the content; kill the large dead navy space.
- Keep it type-led and confident; no stock imagery beyond the founder portrait.



## 4. THE PERSON — new, prominent section + page (the core addition)

The site must establish *who Gitanj is* early and strongly. Add a **dedicated "Gitanj Sheth" page** (under About) AND a strong **founder section on the Home scroll** (placed high — right after the hero/story). Principle: **show, don't tell.** No self-praise adjectives ("exceptional/brilliant/scholar"). Let concrete facts carry it.

**Content to feature (all real — from the provided profile):**

- **Positioning line:** an operator and builder, not a career consultant — someone who has run and fixed real businesses, not produced slide decks. Brings an owner's eye from inside a business family, plus an engineer's and a strategist's mind.
- **The rare combination:** engineering (B.Tech, Nirma) + management (MBA, XLRI Jamshedpur) + computer science (M.S. CS) + real operating track record. Not a corporate lifer.
- **Proof-of-calibre (let these speak, don't editorialise):**
  - CAT — Gujarat State Rank 1 (2018)
  - GSRTC DGPS survey — 50 lakh+ sq m mapped to centimetre accuracy in 7 weeks
  - GAIC subsidy digitisation — 22,000+ subsidies across 5 lakh+ acres, on custom tamper-proof software
  - A live quantitative ML trading platform (hundreds of models, real deployment)
  - Cross-border remittance backend; e-commerce ops (18,000+ orders); grants from Microsoft Founders Hub and AWS
  - Guest Lecturer, Nirma University (since 2021); Mentor, IGNITE startup incubator
- **Pedigree (qualitative, NOT a rupee figure):** "from an established, multi-company business family; a director across several of its companies." Do **not** print a specific "₹X crore" figure unless the owner explicitly confirms it and wants it public.
- **The "why":** having solved hard problems across his own family's businesses and for people around him, he now brings that same outside, first-principles eye to others' toughest problems — for the problems, not the fee.
- **Selectivity (implies non-desperation without stating it):** takes a limited number of engagements; the first conversation is free; chooses the problems worth solving. Never write "I don't need clients" or "my time is invaluable" — convey it through posture and selectivity only.

Layout: portrait + a lead paragraph, then the credentials/track-record as a clean, scannable set (logos-of-scale style: the numbers and institutions, not walls of text). This section is what converts "a firm" into "*this* person, worth taking seriously."

## 5. Services → two open categories (replace the 10-card grid)

- Delete the 3×N fixed-service grid.
- Replace with **two large boxes**, side by side (stack on mobile):
  1. **Repair** — "Something in the business is broken — it's leaking money, time, or quality, and what you've tried hasn't fixed it." (for: broken existing functioning)
  2. **Boost** — "The business runs fine, but it isn't growing the way it should — or you want growth and don't yet know how." (for: healthy but stuck/ambitious)
- Deliberately **open-ended** — do not enumerate whether the fix is tech/strategy/process. The whole point: the diagnosis is ours to make; fixed sub-services would presume the answer and box us in.
- Below the two boxes: a line + link — **"See a few problems we've untangled →"** leading to Case Studies. The case studies are where range shows (a spread of tech/ops/strategy/finance situations), *camouflaged as relatable cases* rather than advertised as service lines. Rationale to preserve in tone: if a visitor already knows exactly what's wrong and how to fix it, they don't need us.
- Keep the `services` content collection out of the Home UI for now (or repurpose it to power the case-study sub-type tags). The two boxes are static, curated copy.



## 6. Testimonials (rebuild as a carousel)

- Replace the 3×2 grid with a **single-row carousel**: one **center card** in focus, with the previous/next cards **peeking** (partially cropped) on left and right.
- **Responsive:** as width shrinks, the peeking cards narrow until, on phones, only the center card remains.
- **Interaction:** left/right **swipe** (touch) + **hover-revealed arrow controls** on the sides for desktop. Optional dots.
- **Each card contains, top to bottom:**
  1. the locale-appropriate pulled quote (quote_en / quote_hi);
  2. a **square photo box** of the signatory (left of the name/company) — placeholder until photos supplied, from `src/assets/people/`;
  3. name / company / field;
  4. a **glimpse of the testimonial letter** — the letter image shown as a cutout that **fades out (increasing transparency toward the bottom)**, with a **"View testimonial letter"** button/label; clicking opens the full letter PNG in a lightbox/modal.
- Restore the photo and the letter-glimpse that were dropped in the current build.



## 7. Language switcher + first-visit gate (redesign + fix)

- **Switcher:** replace the "English / हिंदी" side-by-side text with a **globe icon + the currently-selected language name + a caret** (e.g. "🌐 English ⌄"). Hover/click opens a **dropdown list** of languages. This scales to 4+ languages; side-by-side names do not.
- **First-visit blocking gate is currently NOT appearing — fix it.** On first visit (no stored locale), show the full-screen blocking language chooser (English pre-selected), store the choice (cookie/localStorage), route to `/{locale}/home`, and skip on return visits. Verify the storage-check logic actually runs and the modal renders above everything.
- Both the gate and the switcher read from / write to the same stored locale.



## 8. Empanelled Experts (restore)

- Add the **Experts** section/page back (it's missing from the current build). Render from the `experts` collection (name, domain, blurb). Present as a restrained set — this supports the "bench behind the principal" story. Reachable from About ▾ → Empanelled Experts, and a short teaser on Home.



## 9. Footer / entity

- Footer carries the **firm entity**: "G A Sheth & Associates", contact ([hello@gitanjsheth.com](mailto:hello@gitanjsheth.com)), nav, GS mark, © 2026 G A Sheth & Associates.
- Keep it quiet and clean; the firm name lives here, the person lives up top.



## 10. Order of the Home scroll (revised)

1. Header
2. Hero (statement + founder portrait)
3. **The Person — Gitanj** (who / why / proof-of-calibre) ← moved high, this is the hook
4. The Firm & Story (short — the bench, the model)
5. **Repair / Boost** two boxes + "see a few cases →"
6. Featured case study
7. Testimonials carousel
8. Empanelled Experts (teaser)
9. How We Engage (teaser)
10. Enquiry CTA band
11. Footer

---



## Summary of what changes vs. what stays

**Stays:** Astro + Tailwind + i18n, /en/ /hi/ routing, content-as-data, PDF→PNG letter conversion, GitHub Pages deploy, Web3Forms → [hello@gitanjsheth.com](mailto:hello@gitanjsheth.com), no stock photography (except the founder portrait).

**Changes:** firm name → G A Sheth & Associates (person foregrounded); typography → modern grotesque; header → 4 grouped items + dropdowns; hero → split with portrait; NEW prominent founder section/page; 10 services → 2 open boxes + cases teaser; testimonials → peeking swipeable carousel with photo + faded letter-glimpse + view; language switcher → globe+current+dropdown and fix the blocking gate; restore Experts; footer carries the firm entity.