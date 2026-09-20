import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Content as data, not markup. Every collection is a folder of JSON files
 * loaded via the glob loader; the file name becomes the entry `id`/slug.
 *
 * Display text carries BOTH languages via the `localized` shape below, so the
 * same entry renders `en` on /en/ pages and `hi` on /hi/ pages. Shared,
 * language-neutral artefacts (the letter scan image) are single fields.
 */
const localized = z.object({
  en: z.string(),
  hi: z.string(),
});

// -- services -----------------------------------------------------------------
const serviceCategories = [
  "flagship",
  "strategy",
  "technology",
  "operations",
  "finance",
] as const;

const services = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/services" }),
  schema: z.object({
    order: z.number(),
    category: z.enum(serviceCategories),
    title: localized, // symptom-first heading
    discipline: localized, // the formal discipline name (small tag)
    symptomLine: localized, // one-line hook
    description: localized, // fuller paragraph
  }),
});

// -- testimonials -------------------------------------------------------------
const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/testimonials" }),
  schema: z.object({
    name: z.string(),
    company: z.string(),
    city: z.string(), // shown with company: "VRS Infrastructures, Mohali"
    industry: z.string(), // next line, e.g. "Real Estate"
    date: z.string().optional(),
    quote_en: z.string(), // shown on /en/
    quote_hi: z.string(), // shown on /hi/
    photo: z.string().optional(), // e.g. "people/dilip-bhatt.jpg" (SQUARE crop)
    letterImage: z.string().optional(), // e.g. "/letters/swapna.png" (shared, untranslated)
    letterThumb: z.string().optional(), // e.g. "/letters/thumbs/swapna.png"
    featured: z.boolean().default(false),
    order: z.number().default(0),
    placeholder: z.boolean().default(false),
  }),
});

// -- case studies -------------------------------------------------------------
const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/caseStudies" }),
  schema: z.object({
    sector: localized,
    client: z.string(), // a name or "Confidential"
    confidential: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    image: z.string().optional(),
    title: localized,
    problem: localized,
    approach: localized,
    outcome: localized,
    placeholder: z.boolean().default(false),
  }),
});

// -- experts ------------------------------------------------------------------
const experts = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/experts" }),
  schema: z.object({
    name: z.string(),
    domain: localized, // the role / discipline
    education: localized.optional(), // e.g. "B.E. · MBA" (shown under the name)
    blurb: localized, // short line (home carousel card)
    description: localized.optional(), // fuller bio (experts page section); falls back to blurb
    photo: z.string().optional(), // e.g. "people/apurva-sheth.jpg" (3:4 portrait crop)
    order: z.number().default(0),
    placeholder: z.boolean().default(false),
  }),
});

export const collections = { services, testimonials, caseStudies, experts };
