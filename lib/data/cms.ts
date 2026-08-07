import { getPayload } from "payload";
import config from "@payload-config";
import { Pool } from "pg";
import {
  type Product,
  type BlogPost,
  type LegalPage,
  type SeoFields,
} from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PayloadDoc = Record<string, any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

let _pool: Pool | null = null;
function getPool(): Pool {
  if (_pool) return _pool;
  const dbUri = process.env.DATABASE_URL || process.env.DATABASE_URI;
  if (!dbUri) throw new Error("No DB URI");
  _pool = new Pool({
    connectionString: dbUri,
    ssl: dbUri.startsWith("postgresql") ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
  return _pool;
}

const _cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;
function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = _cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return Promise.resolve(hit.data as T);
  return fn().then((data) => {
    _cache.set(key, { data, ts: Date.now() });
    return data;
  });
}

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
  if (val && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    if (typeof obj.cloudinaryPublicId === "string" && obj.cloudinaryPublicId) {
      return cloudinaryUrl(obj.cloudinaryPublicId);
    }
    if (typeof obj.url === "string") {
      return obj.url;
    }
  }
  if (typeof val === "string") return val;
  return "";
}

import { cloudinaryUrl } from "../cloudinary";

function firstSrcsetUrl(srcset?: string): string {
  if (!srcset) return "";
  const firstCandidate = srcset.split(",")[0]?.trim() || "";
  const match = firstCandidate.match(/^(.+?)\s+(?:\d+(?:\.\d+)?[wx])$/);
  return (match?.[1] || firstCandidate).trim();
}

function normalizeMigratedMediaUrl(url?: string): string {
  if (!url) return "";
  if (url.includes("66ae1d64b0ff185260ad9b44_Rectangle")) {
    return "/assets/images/66ae1d64b0ff185260ad9b44_Rectangle%20367%20(1).png";
  }
  if (url.includes("66ae22bea9cab6312ffdd45d_Rectangle")) {
    return "/assets/images/66ae22bea9cab6312ffdd45d_Rectangle%20367%20(7).png";
  }
  if (url.includes("66ae22bef52614a0871d61a2_Rectangle")) {
    return "/assets/images/66ae22bef52614a0871d61a2_Rectangle%20367%20(8).png";
  }
  if (url.includes("66a9d8eca2a871357e55ff2c_3_5405220")) {
    return "/assets/images/66a9d8eca2a871357e55ff2c_3%205405220.png";
  }
  return url;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSqlProduct(row: any): Product {
  let imageUrl: string;
  if (row.cloudinary_public_id) {
    imageUrl = cloudinaryUrl(row.cloudinary_public_id);
  } else if (row.image_url && row.image_url.startsWith("http")) {
    imageUrl = row.image_url;
  } else if (row.image_srcset) {
    const firstSrc = firstSrcsetUrl(row.image_srcset);
    if (firstSrc && firstSrc.startsWith("http")) {
      imageUrl = firstSrc;
    } else {
      imageUrl = "/assets/images/placeholder.svg";
    }
  } else {
    imageUrl = "/assets/images/placeholder.svg";
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let seo: any = undefined;
  if (row.seo) {
    try {
      const seoData = typeof row.seo === "string" ? JSON.parse(row.seo) : row.seo;
      if (seoData.title || seoData.description) {
        seo = {
          title: seoData.title || undefined,
          description: seoData.description || undefined,
          ogImage: seoData.ogImage ? resolveMediaUrl(seoData.ogImage) || undefined : undefined,
        };
      }
    } catch {}
  }
  return {
    slug: row.slug || "",
    name: row.title || "",
    code: row.code || "",
    metal: row.metal || "gold",
    category: row.category_name || "",
    weight: row.weight || "",
    purity: row.purity || "",
    description: row.description || "",
    image: imageUrl,
    imageAlt: row.image_alt || "",
    imageSrcset: row.image_srcset || "",
    seo,
  };
}

const PRODUCT_SQL_BASE = `
  SELECT p.id, p.title, p.slug, p.code, p.metal, p.weight, p.purity,
         p.description, p.image_srcset, p.seo,
         c.name AS category_name,
         m.url AS image_url, m.alt AS image_alt,
         m.cloudinary_public_id AS cloudinary_public_id
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  LEFT JOIN media m ON p.image_id = m.id
`;

function isPostgres(): boolean {
  const dbUri = process.env.DATABASE_URL || process.env.DATABASE_URI;
  return !!dbUri && dbUri.startsWith("postgresql");
}

async function sqlFindProducts(
  whereClause: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any[],
  limit: number,
  offset: number,
): Promise<{ products: Product[]; totalDocs: number }> {
  const pool = getPool();
  const countQ = await pool.query(
    `SELECT COUNT(*)::int AS cnt FROM products p ${whereClause}`,
    params,
  );
  const totalDocs: number = countQ.rows[0]?.cnt ?? 0;
  let rows;
  try {
    rows = await pool.query(
      `${PRODUCT_SQL_BASE} ${whereClause} ORDER BY p.id LIMIT ${limit} OFFSET ${offset}`,
      params,
    );
  } catch {
    const SIMPLE_BASE = `
      SELECT p.id, p.title, p.slug, p.code, p.metal, p.weight, p.purity,
             p.description, p.image_srcset,
             c.name AS category_name,
             m.url AS image_url, m.alt AS image_alt,
             m.cloudinary_public_id AS cloudinary_public_id
      FROM products p
      LEFT JOIN categories c ON p.category = c.id
      LEFT JOIN media m ON p.image = m.id
    `;
    rows = await pool.query(
      `${SIMPLE_BASE} ${whereClause} ORDER BY p.id LIMIT ${limit} OFFSET ${offset}`,
      params,
    );
  }
  return { products: rows.rows.map(mapSqlProduct), totalDocs };
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
  const cloudinaryId =
    imageObj && typeof imageObj === "object" && "cloudinaryPublicId" in imageObj && typeof (imageObj as { cloudinaryPublicId?: unknown }).cloudinaryPublicId === "string"
      ? (imageObj as { cloudinaryPublicId: string }).cloudinaryPublicId
      : null;
  const imageFromSrcset =
    typeof doc.imageSrcset === "string"
      ? firstSrcsetUrl(doc.imageSrcset)
      : "";
  let imageUrl: string;
  if (cloudinaryId) {
    imageUrl = cloudinaryUrl(cloudinaryId);
  } else if (imageFromSrcset && imageFromSrcset.startsWith("http")) {
    imageUrl = imageFromSrcset;
  } else {
    imageUrl = resolveMediaUrl(doc.image) || "/assets/images/placeholder.svg";
  }
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
  if (isPostgres()) {
    try {
      const placeholders = slugs.map((_, i) => `$${i + 1}`).join(",");
      const pool = getPool();
      const rows = await pool.query(
        `${PRODUCT_SQL_BASE} WHERE p.slug IN (${placeholders})`,
        slugs,
      );
      return rows.rows.map(mapSqlProduct);
    } catch {
      // fall through to Payload
    }
  }
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "products",
    where: { slug: { in: slugs } },
    limit: slugs.length,
    depth: 1,
  });
  return docs.map(mapProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (isPostgres()) {
    try {
      const pool = getPool();
      const { rows } = await pool.query(`SELECT slug FROM products ORDER BY id`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return rows.map((r: any) => r.slug);
    } catch {
      // fall through
    }
  }
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "products",
    limit: 500,
    depth: 0,
    select: { slug: true },
  });
  return docs.map((d) => d.slug as string);
}

export async function getRelatedProducts(
  metal: string,
  excludeSlug: string,
  limit = 4,
): Promise<Product[]> {
  if (isPostgres()) {
    try {
      const pool = getPool();
      const rows = await pool.query(
        `${PRODUCT_SQL_BASE} WHERE p.metal = $1 AND p.slug != $2 ORDER BY RANDOM() LIMIT ${limit}`,
        [metal, excludeSlug],
      );
      return rows.rows.map(mapSqlProduct);
    } catch {
      // fall through to Payload
    }
  }
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

interface PaginatedProducts {
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
  if (isPostgres()) {
    try {
      let where = "WHERE p.metal = $1";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any[] = [metal];
      if (categorySlug) {
        where += " AND c.slug = $2";
        params.push(categorySlug);
      }
      const offset = (page - 1) * limit;
      const { products, totalDocs } = await sqlFindProducts(where, params, limit, offset);
      const totalPages = Math.ceil(totalDocs / limit);
      return {
        products,
        totalDocs,
        totalPages,
        page,
        hasNextPage: page < totalPages,
      };
    } catch {
      // fall through to Payload
    }
  }
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
  if (isPostgres()) {
    try {
      const pool = getPool();
      let rows;
      try {
        rows = await pool.query(`${PRODUCT_SQL_BASE} WHERE p.slug = $1 LIMIT 1`, [slug]);
      } catch {
        const SIMPLE = `
          SELECT p.id, p.title, p.slug, p.code, p.metal, p.weight, p.purity,
                 p.description, p.image_srcset,
                 c.name AS category_name,
                 m.url AS image_url, m.alt AS image_alt,
                 m.cloudinary_public_id AS cloudinary_public_id
          FROM products p
          LEFT JOIN categories c ON p.category = c.id
          LEFT JOIN media m ON p.image = m.id
        `;
        rows = await pool.query(`${SIMPLE} WHERE p.slug = $1 LIMIT 1`, [slug]);
      }
      return rows.rows[0] ? mapSqlProduct(rows.rows[0]) : undefined;
    } catch {
      // fall through to Payload
    }
  }
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
  if (isPostgres()) {
    return cached(`categories:${metal || "all"}`, async () => {
      try {
        const pool = getPool();
        let query = "SELECT name, slug FROM categories";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any[] = [];
        if (metal) {
          query += " WHERE metal = $1";
          params.push(metal);
        }
        query += " ORDER BY display_order";
        const { rows } = await pool.query(query, params);
        if (rows.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return rows.map((r: any) => ({ name: r.name, slug: r.slug }));
        }
      } catch {
        // fall through
      }
      return metal ? DEFAULT_CATEGORIES[metal] || [] : [];
    });
  }
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

async function loadArrayData(data: SiteSettingsData): Promise<SiteSettingsData> {
  try {
    const pool = getPool();
    const ss = await pool.query(`SELECT id FROM site_settings LIMIT 1`);
    const ssId = ss.rows[0]?.id;
    if (!ssId) return data;

    const heroRes = await pool.query(
      `SELECT h.heading, h.description, h.cta_text, h.cta_href, m.url as image_url
       FROM site_settings_hero_slides h LEFT JOIN media m ON h.image_id = m.id
       WHERE h._parent_id = $1 ORDER BY h._order`, [ssId]);
    const circleBannerRes = await pool.query(
      `SELECT b.title, b.description, b.alt, m.url as image_url
       FROM site_settings_blocks_circle_banner b LEFT JOIN media m ON b.image_id = m.id
       WHERE b._parent_id = $1 ORDER BY b._order`, [ssId]);
    const imageBannerRes = await pool.query(
      `SELECT b.alt, b.title, b.cta_text, b.href, m.url as image_url
       FROM site_settings_blocks_image_banner b LEFT JOIN media m ON b.image_id = m.id
       WHERE b._parent_id = $1 ORDER BY b._order`, [ssId]);
    const heritageRes = await pool.query(
      `SELECT h.heading, h.description, m.url as image_url
       FROM site_settings_heritage h LEFT JOIN media m ON h.image_id = m.id
       WHERE h._parent_id = $1 ORDER BY h._order`, [ssId]);
    const reviewsRes = await pool.query(
      `SELECT text, author, location FROM site_settings_reviews
       WHERE _parent_id = $1 ORDER BY _order`, [ssId]);
    const catsRes = await pool.query(
      `SELECT title, description, cta_text, cta_href, variant FROM site_settings_categories
       WHERE _parent_id = $1 ORDER BY _order`, [ssId]);

    return {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      heroSlides: heroRes.rows.map((r: any) => ({
        heading: r.heading || "",
        description: r.description || "",
        ctaText: r.cta_text || "",
        ctaHref: r.cta_href || "",
        image: normalizeMigratedMediaUrl(r.image_url),
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      features: circleBannerRes.rows.map((r: any) => ({
        blockType: "circleBanner" as const,
        title: r.title || "",
        description: r.description || "",
        image: normalizeMigratedMediaUrl(r.image_url),
        srcSet: "",
        sizes: "(max-width: 479px) 81vw, (max-width: 767px) 49vw, (max-width: 991px) 356px, 462px",
        alt: r.alt || "",
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      banners: imageBannerRes.rows.map((r: any) => ({
        blockType: "imageBanner" as const,
        image: normalizeMigratedMediaUrl(r.image_url),
        alt: r.alt || "",
        title: r.title || "",
        ctaText: r.cta_text || "",
        href: r.href || "",
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      heritage: heritageRes.rows.map((r: any) => ({
        heading: r.heading || "",
        description: r.description || "",
        image: normalizeMigratedMediaUrl(r.image_url),
        srcSet: "",
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reviews: reviewsRes.rows.map((r: any) => ({
        text: r.text || "",
        author: r.author || "",
        location: r.location || "",
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      categories: catsRes.rows.map((r: any) => ({
        title: r.title || "",
        description: r.description || "",
        ctaText: r.cta_text || "",
        ctaHref: r.cta_href || "",
        variant: r.variant || "",
      })),
    };
  } catch {
    return data;
  }
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  return cached("site-settings", async () => {
    const payload = await getPayload({ config });
    try {
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
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
    const result = {
      ...raw,
      ...resolveFontsFromPairing(
        raw.fontPairing || "classic-luxury",
        raw.headingFont || undefined,
        raw.bodyFont || undefined,
        raw.uiFont || undefined,
      ),
      fontPairing: raw.fontPairing || "classic-luxury",
      heroSlides: [],
      banners: [],
      features: [],
      heritage: [],
      reviews: [],
      categories: [],
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
            image: resolveMediaUrl(t.image) || "",
          })),
          ventures: {
            heading: ve?.heading || DEFAULT_SETTINGS.aboutPage.ventures.heading,
            subheading: ve?.subheading || "Our Dedicated Wedding Hall",
            image: resolveMediaUrl(ve?.image) || "",
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
    return loadArrayData(result);
  } catch {
    return DEFAULT_SETTINGS;
  }
  });
}
