import { getPayload } from "payload";
import config from "@payload-config";
import {
  type Product,
  type BlogPost,
  type LegalPage,
  type SeoFields,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PayloadDoc = Record<string, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

const FONT_PAIRINGS: Record<
  string,
  { heading: string; body: string; ui: string }
> = {
  "classic-luxury": { heading: "Com 4 DL", body: "Mulish", ui: "Montserrat" },
  "modern-elegant": {
    heading: "Playfair Display",
    body: "Inter",
    ui: "Montserrat",
  },
  timeless: { heading: "Georgia", body: "Mulish", ui: "Open Sans" },
  contemporary: { heading: "Montserrat", body: "Inter", ui: "Montserrat" },
  traditional: {
    heading: "Cormorant Garamond",
    body: "Mulish",
    ui: "Open Sans",
  },
  "bold-statement": {
    heading: "Com 4 DL",
    body: "Montserrat",
    ui: "Montserrat",
  },
};

function resolveFontsFromPairing(
  pairing: string,
  heading?: string,
  body?: string,
  ui?: string,
) {
  const fonts = FONT_PAIRINGS[pairing] || FONT_PAIRINGS["classic-luxury"];
  return {
    headingFont: heading || fonts.heading,
    bodyFont: body || fonts.body,
    uiFont: ui || fonts.ui,
  };
}

function resolveMediaUrl(val: unknown): string {
  if (val && typeof val === "object" && "url" in val)
    return (val as { url: string }).url || "";
  if (typeof val === "string") return val;
  return "";
}

function mapProduct(doc: PayloadDoc): Product {
  const catName =
    typeof doc.category === "object" && doc.category?.name
      ? doc.category.name
      : typeof doc.category === "string"
        ? doc.category
        : "";
  const imageObj =
    typeof doc.image === "object" && doc.image !== null ? doc.image : null;
  const imageFromSrcset =
    typeof doc.imageSrcset === "string"
      ? doc.imageSrcset.split(",")[0]?.trim().split(/\s+/)[0] || ""
      : "";
  const imageUrl =
    imageFromSrcset ||
    imageObj?.url ||
    (typeof doc.image === "string" ? doc.image : "") ||
    "/assets/images/placeholder.svg";
  const imageAlt = imageObj?.alt || "";
  const seoGroup = doc.seo as Record<string, unknown> | undefined;
  const seo: SeoFields | undefined = seoGroup
    ? {
        title: (seoGroup.title as string) || undefined,
        description: (seoGroup.description as string) || undefined,
        ogImage: resolveMediaUrl(seoGroup.ogImage) || undefined,
      }
    : undefined;
  return {
    slug: doc.slug || "",
    name: doc.title || "",
    code: doc.code || "",
    metal: doc.metal || "gold",
    category: catName,
    weight: doc.weight || "",
    purity: doc.purity || "",
    description: doc.description || "",
    image: imageUrl,
    imageAlt,
    imageSrcset: doc.imageSrcset || "",
    seo,
  };
}

function mapBlogPost(doc: PayloadDoc): BlogPost {
  const rawBody = doc.body;
  const body = Array.isArray(rawBody)
    ? rawBody.map((block: PayloadDoc) => {
        if (block.type === "ul") {
          return {
            type: "ul" as const,
            items: (block.items || []).map((i: PayloadDoc) => i.item || i),
          };
        }
        return { type: block.type as "h2" | "p", text: block.text || "" };
      })
    : undefined;

  const thumbObj =
    typeof doc.thumbnail === "object" && doc.thumbnail !== null
      ? doc.thumbnail
      : null;
  const thumbUrl =
    thumbObj?.url || (typeof doc.thumbnail === "string" ? doc.thumbnail : "");
  const seoGroup = doc.seo as Record<string, unknown> | undefined;
  const seo: SeoFields | undefined = seoGroup
    ? {
        title: (seoGroup.title as string) || undefined,
        description: (seoGroup.description as string) || undefined,
        ogImage: resolveMediaUrl(seoGroup.ogImage) || undefined,
      }
    : undefined;

  return {
    slug: doc.slug || "",
    title: doc.title || "",
    thumbnail: thumbUrl,
    excerpt: doc.excerpt || "",
    date: doc.date || undefined,
    body,
    seo,
  };
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (!slugs.length) return [];
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "products",
    where: { slug: { in: slugs } },
    limit: slugs.length,
    depth: 1,
  });
  return docs.map(mapProduct);
}

export async function getRelatedProducts(
  metal: string,
  excludeSlug: string,
  limit = 4,
): Promise<Product[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "products",
    where: {
      and: [
        { metal: { equals: metal } },
        { slug: { not_equals: excludeSlug } },
      ],
    },
    limit,
    depth: 1,
  });
  return docs.map(mapProduct);
}

export async function getProductsByMetal(
  metal: string,
  categorySlug?: string,
): Promise<Product[]> {
  const payload = await getPayload({ config });

  const where: PayloadDoc = { metal: { equals: metal } };

  if (categorySlug) {
    const { docs: catDocs } = await payload.find({
      collection: "categories",
      where: { slug: { equals: categorySlug } },
      limit: 1,
    });
    if (catDocs.length > 0) {
      where.category = { equals: catDocs[0].id };
    }
  }

  const { docs } = await payload.find({
    collection: "products",
    where,
    limit: 500,
    depth: 1,
  });
  return docs.map(mapProduct);
}

export interface PaginatedProducts {
  products: Product[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
}

export async function getProductsByMetalPaginated(
  metal: string,
  page: number = 1,
  limit: number = 24,
  categorySlug?: string,
): Promise<PaginatedProducts> {
  const payload = await getPayload({ config });

  const where: PayloadDoc = { metal: { equals: metal } };

  if (categorySlug) {
    const { docs: catDocs } = await payload.find({
      collection: "categories",
      where: { slug: { equals: categorySlug } },
      limit: 1,
    });
    if (catDocs.length > 0) {
      where.category = { equals: catDocs[0].id };
    }
  }

  const { docs, totalDocs, totalPages } = await payload.find({
    collection: "products",
    where,
    page,
    limit,
    depth: 1,
  });

  return {
    products: docs.map(mapProduct),
    totalDocs,
    totalPages,
    page,
    hasNextPage: page < totalPages,
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "products",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  return docs[0] ? mapProduct(docs[0]) : undefined;
}

export async function getBlogPosts(limit = 100): Promise<BlogPost[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "blog-posts", limit });
  return docs.map(mapBlogPost);
}

export async function getRelatedBlogPosts(
  excludeSlug: string,
  limit = 3,
): Promise<BlogPost[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "blog-posts",
    where: { slug: { not_equals: excludeSlug } },
    limit,
  });
  return docs.map(mapBlogPost);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "blog-posts",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return docs[0] ? mapBlogPost(docs[0]) : undefined;
}

function mapLegalPage(doc: PayloadDoc): LegalPage {
  const sections = (doc.sections || []).map((section: PayloadDoc) => ({
    title: section.title || "",
    blocks: (section.blocks || []).map((block: PayloadDoc) => {
      if (block.type === "ul") {
        return {
          type: "ul" as const,
          items: (block.items || []).map(
            (item: PayloadDoc) => item.item || item,
          ),
        };
      }
      return { type: "p" as const, text: block.text || "" };
    }),
  }));
  const seoGroup = doc.seo as Record<string, unknown> | undefined;
  const seo: SeoFields | undefined = seoGroup
    ? {
        title: (seoGroup.title as string) || undefined,
        description: (seoGroup.description as string) || undefined,
        ogImage: resolveMediaUrl(seoGroup.ogImage) || undefined,
      }
    : undefined;
  return {
    slug: doc.slug || "",
    title: doc.title || "",
    sections,
    seo,
  };
}

export async function getLegalPageBySlug(
  slug: string,
): Promise<LegalPage | undefined> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "legal-pages",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return docs[0] ? mapLegalPage(docs[0]) : undefined;
}

const DEFAULT_CATEGORIES: Record<string, Array<{ name: string; slug: string }>> = {
  gold: [
    { name: "Bangles", slug: "bangles" },
    { name: "Bracelets", slug: "bracelet" },
    { name: "Pendant", slug: "pendant" },
    { name: "Necklace", slug: "necklace" },
    { name: "Rings", slug: "rings" },
    { name: "Earrings", slug: "earrings" },
  ],
  silver: [
    { name: "Bracelets", slug: "bracelet" },
    { name: "Necklace", slug: "necklace" },
    { name: "Idols", slug: "idols" },
    { name: "Anklets", slug: "anklets" },
  ],
  diamond: [
    { name: "Necklace", slug: "necklace" },
    { name: "Rings", slug: "rings" },
  ],
};

export async function getCategories(
  metal?: string,
): Promise<Array<{ name: string; slug: string }>> {
  try {
    const payload = await getPayload({ config });
    const query: PayloadDoc = {};
    if (metal) query.metal = { equals: metal };
    const { docs } = await payload.find({
      collection: "categories",
      where: query,
      limit: 100,
      sort: "displayOrder",
    });
    if (docs.length > 0) {
      return docs.map((d) => ({ name: d.name as string, slug: d.slug as string }));
    }
  } catch {
    // fall through to defaults
  }
  return metal ? DEFAULT_CATEGORIES[metal] || [] : [];
}

export interface SiteSettingsData {
  rateGold22: string;
  rateGold18: string;
  rateSilver: string;
  ratePlatinum: string;
  rateUpdated: string;
  heroSlides: Array<{
    heading: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    image: string;
  }>;
  reviews: Array<{ text: string; author: string; location: string }>;
  banners: Array<{
    blockType: string;
    image?: string;
    alt?: string;
    title?: string;
    ctaText?: string;
    href?: string;
    heading?: string;
    description?: string;
    ctaLink?: string;
    bgColor?: string;
  }>;
  features: Array<{
    blockType: string;
    title?: string;
    heading?: string;
    description?: string;
    image?: string;
    srcSet?: string;
    sizes?: string;
    alt?: string;
    ctaText?: string;
    ctaLink?: string;
  }>;
  heritage: Array<{
    heading: string;
    description: string;
    image: string;
    srcSet: string;
  }>;
  categories: Array<{
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    variant: string;
  }>;
  branches: Array<{
    name: string;
    address: string;
    phone: string;
    phoneFull: string;
    email: string;
    hours: string;
    mapQ: string;
    mapEmbedUrl: string;
  }>;
  footerAbout: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  storeTiming: string;
  bestsellerProducts: string;
  headingFont: string;
  bodyFont: string;
  uiFont: string;
  fontPairing: string;
  baseFontSize: string;
  headingScale: string;
  customFonts: string;
  aboutPage: {
    goldenOccasions: {
      heading: string;
      paragraphs: Array<{ text: string }>;
      image: string;
      alt: string;
    };
    tasteMeetsTradition: {
      heading: string;
      text: string;
    };
    origins: {
      heading: string;
      intro: string;
    };
    timeline: Array<{
      year: string;
      title: string;
      text: string;
      image: string;
    }>;
    ventures: {
      heading: string;
      subheading: string;
      image: string;
      alt: string;
      bullets: Array<{ text: string }>;
      cta1Text: string;
      cta1Href: string;
      cta2Text: string;
      cta2Href: string;
    };
  };
  defaultSeo: {
    title: string;
    description: string;
    ogImage: string;
  };
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  rateGold22: "7,450",
  rateGold18: "6,080",
  rateSilver: "92",
  ratePlatinum: "3,890",
  rateUpdated: "27-06-2026",
  heroSlides: [],
  reviews: [],
  banners: [],
  features: [],
  heritage: [],
  categories: [],
  branches: [],
  footerAbout: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  phone: "",
  whatsapp: "",
  email: "",
  storeTiming: "",
  bestsellerProducts: "",
  headingFont: "Com 4 DL",
  bodyFont: "Mulish",
  uiFont: "Montserrat",
  fontPairing: "classic-luxury",
  baseFontSize: "16px",
  headingScale: "1.25",
  customFonts: "",
  aboutPage: {
    goldenOccasions: {
      heading: "Golden Occasions & Gleaming Beginnings",
      paragraphs: [],
      image: "",
      alt: "About Kerala Jewellers",
    },
    tasteMeetsTradition: { heading: "Taste Meets Tradition", text: "" },
    origins: { heading: "The Origins", intro: "" },
    timeline: [],
    ventures: {
      heading: "Our Ventures",
      subheading: "Our Dedicated Wedding Hall",
      image: "",
      alt: "",
      bullets: [],
      cta1Text: "Know More About Us",
      cta1Href: "https://www.ayswariyamahal.com/",
      cta2Text: "Find Us",
      cta2Href: "https://maps.app.goo.gl/vP759GxjSJLK4oU88",
    },
  },
  defaultSeo: {
    title: "Kerala Jewellers — Exquisite Gold, Silver & Diamond Jewellery",
    description:
      "Kerala Jewellers offers exquisite gold, silver, and diamond jewellery crafted with precision. Shop traditional and modern designs.",
    ogImage: "",
  },
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const payload = await getPayload({ config });
  try {
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
    });
    const raw = {
      ...DEFAULT_SETTINGS,
      ...Object.fromEntries(
        Object.entries(settings || {}).map(([k, v]) => [
          k,
          v ?? DEFAULT_SETTINGS[k as keyof SiteSettingsData],
        ]),
      ),
    };
    return {
      ...raw,
      ...resolveFontsFromPairing(
        raw.fontPairing || "classic-luxury",
        raw.headingFont || undefined,
        raw.bodyFont || undefined,
        raw.uiFont || undefined,
      ),
      fontPairing: raw.fontPairing || "classic-luxury",
      heroSlides: (raw.heroSlides || []).map((s: PayloadDoc) => ({
        heading: s.heading || "",
        description: s.description || "",
        ctaText: s.ctaText || "",
        ctaHref: s.ctaHref || "",
        image: resolveMediaUrl(s.image),
      })),
      banners: (raw.banners || []).map((b: PayloadDoc) => {
        if (b.blockType === "imageBanner") {
          return {
            blockType: "imageBanner" as const,
            image: resolveMediaUrl(b.image),
            alt: b.alt || "",
            title: b.title || "",
            ctaText: b.ctaText || "",
            href: b.href || "",
          };
        }
        if (b.blockType === "textBanner") {
          return {
            blockType: "textBanner" as const,
            heading: b.heading || "",
            description: b.description || "",
            ctaText: b.ctaText || "",
            ctaLink: b.ctaLink || "",
            bgColor: b.bgColor || "",
          };
        }
        // Legacy array format fallback
        return {
          blockType: "imageBanner" as const,
          image: resolveMediaUrl(b.image),
          alt: b.alt || "",
          title: b.title || "",
          ctaText: b.ctaText || "",
          href: b.href || "",
        };
      }),
      features: (raw.features || []).map((f: PayloadDoc) => {
        if (f.blockType === "circleBanner") {
          return {
            blockType: "circleBanner" as const,
            title: f.title || "",
            description: f.description || "",
            image: resolveMediaUrl(f.image),
            srcSet: "",
            sizes:
              "(max-width: 479px) 81vw, (max-width: 767px) 49vw, (max-width: 991px) 356px, 462px",
            alt: f.alt || "",
          };
        }
        if (f.blockType === "rectangleBanner") {
          return {
            blockType: "rectangleBanner" as const,
            heading: f.heading || "",
            description: f.description || "",
            image: resolveMediaUrl(f.image),
            ctaText: f.ctaText || "Explore",
            ctaLink: f.ctaLink || "/products",
            alt: f.alt || "",
          };
        }
        // Legacy array format fallback
        return {
          blockType: "circleBanner" as const,
          title: f.title || "",
          description: f.description || "",
          image: resolveMediaUrl(f.image),
          srcSet: f.srcSet || "",
          sizes: f.sizes || "",
          alt: f.alt || "",
        };
      }),
      heritage: (raw.heritage || []).map((h: PayloadDoc) => ({
        heading: h.heading || "",
        description: h.description || "",
        image: resolveMediaUrl(h.image),
        srcSet: h.srcSet || "",
      })),
      aboutPage: (() => {
        const ap = raw.aboutPage as PayloadDoc | undefined;
        if (!ap) return DEFAULT_SETTINGS.aboutPage;
        const go = ap.goldenOccasions as PayloadDoc | undefined;
        const tm = ap.tasteMeetsTradition as PayloadDoc | undefined;
        const or = ap.origins as PayloadDoc | undefined;
        const ve = ap.ventures as PayloadDoc | undefined;
        return {
          goldenOccasions: {
            heading:
              go?.heading || DEFAULT_SETTINGS.aboutPage.goldenOccasions.heading,
            paragraphs: (go?.paragraphs || []).map((p: PayloadDoc) => ({
              text: p.text || "",
            })),
            image: go?.image ? resolveMediaUrl(go.image) : "",
            alt: go?.alt || "About Kerala Jewellers",
          },
          tasteMeetsTradition: {
            heading:
              tm?.heading ||
              DEFAULT_SETTINGS.aboutPage.tasteMeetsTradition.heading,
            text: tm?.text || "",
          },
          origins: {
            heading: or?.heading || DEFAULT_SETTINGS.aboutPage.origins.heading,
            intro: or?.intro || "",
          },
          timeline: (ap.timeline || []).map((t: PayloadDoc) => ({
            year: t.year || "",
            title: t.title || "",
            text: t.text || "",
            image: t.image || "",
          })),
          ventures: {
            heading: ve?.heading || DEFAULT_SETTINGS.aboutPage.ventures.heading,
            subheading: ve?.subheading || "Our Dedicated Wedding Hall",
            image: ve?.image || "",
            alt: ve?.alt || "",
            bullets: (ve?.bullets || []).map((b: PayloadDoc) => ({
              text: b.text || "",
            })),
            cta1Text: ve?.cta1Text || "Know More About Us",
            cta1Href: ve?.cta1Href || "https://www.ayswariyamahal.com/",
            cta2Text: ve?.cta2Text || "Find Us",
            cta2Href:
              ve?.cta2Href || "https://maps.app.goo.gl/vP759GxjSJLK4oU88",
          },
        };
      })(),
      defaultSeo: (() => {
        const ds = raw.defaultSeo as Record<string, unknown> | undefined;
        return {
          title: (ds?.title as string) || DEFAULT_SETTINGS.defaultSeo.title,
          description:
            (ds?.description as string) ||
            DEFAULT_SETTINGS.defaultSeo.description,
          ogImage: resolveMediaUrl(ds?.ogImage) || "",
        };
      })(),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
