import { getPayload } from "payload";
import config from "@payload-config";
import { Pool } from "@neondatabase/serverless";
import { cloudinaryUrl, normalizeCloudinaryDeliveryUrl } from "../cloudinary";
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
const postgresPoolMax = Number(process.env.POSTGRES_POOL_MAX || 1);

function cleanPostgresUrl(url: string): string {
  if (!url.startsWith("postgresql")) return url;
  const parsed = new URL(url);
  parsed.searchParams.delete("channel_binding");
  const sslMode = parsed.searchParams.get("sslmode");
  if (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
    parsed.searchParams.set("sslmode", "verify-full");
  }
  if (parsed.hostname.includes("-pooler")) {
    parsed.hostname = parsed.hostname.replace("-pooler", "");
  }
  return parsed.toString();
}

function getPool(): Pool {
  if (_pool) return _pool;
  const dbUri = process.env.DATABASE_URL || process.env.DATABASE_URI;
  if (!dbUri) throw new Error("No DB URI");
  _pool = new Pool({
    connectionString: cleanPostgresUrl(dbUri),
    max: Number.isFinite(postgresPoolMax) && postgresPoolMax > 0
      ? postgresPoolMax
      : 1,
    idleTimeoutMillis: 30000,
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

export function clearSiteSettingsCache() {
  _cache.delete("site-settings");
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
      return normalizeCloudinaryDeliveryUrl(obj.url);
    }
  }
  if (typeof val === "string") return normalizeCloudinaryDeliveryUrl(val);
  return "";
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
  return normalizeCloudinaryDeliveryUrl(url);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSqlProduct(row: any): Product {
  let imageUrl: string;
  if (row.cloudinary_public_id) {
    imageUrl = cloudinaryUrl(row.cloudinary_public_id);
  } else if (row.image_url && row.image_url.startsWith("http")) {
      imageUrl = normalizeCloudinaryDeliveryUrl(row.image_url);
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
    seo,
  };
}

const PRODUCT_SQL_BASE = `
  SELECT p.id, p.title, p.slug, p.code, p.metal, p.weight, p.purity,
         p.description,
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
  const result = await pool.query(
    `${PRODUCT_SQL_BASE} ${whereClause} ORDER BY p.id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset],
  );
  return { products: result.rows.map(mapSqlProduct), totalDocs };
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
  let imageUrl: string;
  if (cloudinaryId) {
    imageUrl = cloudinaryUrl(cloudinaryId);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSqlBlogPost(row: any, body?: BlogPost["body"]): BlogPost {
  const thumbnail = row.cloudinary_public_id
    ? cloudinaryUrl(row.cloudinary_public_id)
    : row.thumbnail_url
      ? normalizeCloudinaryDeliveryUrl(row.thumbnail_url)
      : "";

  return {
    slug: row.slug || "",
    title: row.title || "",
    thumbnail,
    excerpt: row.excerpt || "",
    date: row.date || undefined,
    body,
    seo: {
      title: row.seo_title || undefined,
      description: row.seo_description || undefined,
      ogImage: row.seo_og_public_id
        ? cloudinaryUrl(row.seo_og_public_id)
        : row.seo_og_url
          ? normalizeCloudinaryDeliveryUrl(row.seo_og_url)
          : undefined,
    },
  };
}

const BLOG_SQL_BASE = `
  SELECT b.id, b.title, b.slug, b.excerpt, b.date,
         t.url AS thumbnail_url, t.cloudinary_public_id AS cloudinary_public_id,
         b.seo_title, b.seo_description,
         og.url AS seo_og_url, og.cloudinary_public_id AS seo_og_public_id
  FROM blog_posts b
  LEFT JOIN media t ON b.thumbnail_id = t.id
  LEFT JOIN media og ON b.seo_og_image_id = og.id
`;

async function getSqlBlogBody(postId: number): Promise<BlogPost["body"]> {
  const pool = getPool();
  const { rows: blocks } = await pool.query(
    `SELECT id, type, text
     FROM blog_posts_body
     WHERE _parent_id = $1
     ORDER BY _order`,
    [postId],
  );
  const body: NonNullable<BlogPost["body"]> = [];
  for (const block of blocks) {
    if (block.type === "ul") {
      const { rows: items } = await pool.query(
        `SELECT item
         FROM blog_posts_body_items
         WHERE _parent_id = $1
         ORDER BY _order`,
        [block.id],
      );
      body.push({
        type: "ul",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: items.map((itemRow: any) => itemRow.item || ""),
      });
    } else {
      body.push({
        type: block.type === "h2" ? "h2" : "p",
        text: block.text || "",
      });
    }
  }
  return body;
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
      return [];
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
      return [];
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
        `${PRODUCT_SQL_BASE} WHERE p.metal = $1 AND p.slug != $2 ORDER BY RANDOM() LIMIT $3`,
        [metal, excludeSlug, limit],
      );
      return rows.rows.map(mapSqlProduct);
    } catch {
      return [];
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
        where += " AND p.category_id IN (SELECT id FROM categories WHERE slug = $2)";
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
      return {
        products: [],
        totalDocs: 0,
        totalPages: 0,
        page,
        hasNextPage: false,
      };
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
                 p.description,
                 c.name AS category_name,
                 m.url AS image_url, m.alt AS image_alt,
                 m.cloudinary_public_id AS cloudinary_public_id
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          LEFT JOIN media m ON p.image_id = m.id
        `;
        rows = await pool.query(`${SIMPLE} WHERE p.slug = $1 LIMIT 1`, [slug]);
      }
      return rows.rows[0] ? mapSqlProduct(rows.rows[0]) : undefined;
    } catch {
      return undefined;
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
  if (isPostgres()) {
    try {
      const pool = getPool();
      const { rows } = await pool.query(
        `${BLOG_SQL_BASE} ORDER BY b.id DESC LIMIT $1`,
        [limit],
      );
      return rows.map((row) => mapSqlBlogPost(row));
    } catch {
      return [];
    }
  }
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "blog-posts", limit });
  return docs.map(mapBlogPost);
}

export async function getRelatedBlogPosts(
  excludeSlug: string,
  limit = 3,
): Promise<BlogPost[]> {
  if (isPostgres()) {
    try {
      const pool = getPool();
      const { rows } = await pool.query(
        `${BLOG_SQL_BASE}
         WHERE b.slug != $1
         ORDER BY b.id DESC
         LIMIT $2`,
        [excludeSlug, limit],
      );
      return rows.map((row) => mapSqlBlogPost(row));
    } catch {
      return [];
    }
  }
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
  if (isPostgres()) {
    try {
      const pool = getPool();
      const { rows } = await pool.query(
        `${BLOG_SQL_BASE} WHERE b.slug = $1 LIMIT 1`,
        [slug],
      );
      if (!rows[0]) return undefined;
      const body = await getSqlBlogBody(Number(rows[0].id));
      return mapSqlBlogPost(rows[0], body);
    } catch {
      return undefined;
    }
  }
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
    alt?: string;
    ctaText?: string;
    ctaLink?: string;
  }>;
  heritage: Array<{
    heading: string;
    description: string;
    image: string;
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
  bestsellerProducts: Array<{ id: string; name: string; slug: string; image: string; metal: string; category: string }>;
  headingFont: string;
  bodyFont: string;
  uiFont: string;
  fontPairing: string;
  baseFontSize: string;
  headingScale: string;
  customFonts: string;
  homepageSections: {
    bestsellersTitle: string;
    bestsellersSubtitle: string;
    latestTitle: string;
    latestSubtitle: string;
    reviewsTitle: string;
    reviewsSubtitle: string;
  };
  blogPage: {
    promoHeading: string;
    promoDescription: string;
    promoCtaText: string;
    promoCtaHref: string;
    promoImage: string;
    headerTitle: string;
    headerSubtitle: string;
    emptyText: string;
  };
  contactPage: {
    heroTitle: string;
    heroSubtitle: string;
    cardTitle: string;
    cardDescription: string;
    cardItems: Array<{ text: string }>;
    cardQuote: string;
    branchesTitle: string;
    formTitle: string;
  };
  productsPage: {
    goldHero: { title: string; subtitle: string };
    silverHero: { title: string; subtitle: string };
    diamondHero: { title: string; subtitle: string };
    platinumHero: { title: string; subtitle: string };
  };
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
  bestsellerProducts: [],
  headingFont: "Com 4 DL",
  bodyFont: "Mulish",
  uiFont: "Montserrat",
  fontPairing: "classic-luxury",
  baseFontSize: "16px",
  headingScale: "1.25",
  customFonts: "",
  homepageSections: {
    bestsellersTitle: "Our Bestsellers",
    bestsellersSubtitle: "Choose from among trendy designs and timeless pieces. There's something for everyone and every occasion.",
    latestTitle: "Our Latest",
    latestSubtitle: "Check out some of the latest designs in our ever-expanding collection.",
    reviewsTitle: "Customer Reviews",
    reviewsSubtitle: "Our Jewelry Isn't Just Worn. It's Cherished. Each Piece Tells A Story, And You Can Hear It From Our Customers Who Wear Theirs With Pride.",
  },
  blogPage: {
    promoHeading: "Wedding Season is here",
    promoDescription: "Embrace the magic of the wedding season with our exquisite jewellery collection. Elevate your bridal ensemble or find the perfect gift for the happy couple with our stunning array of wedding-ready pieces.",
    promoCtaText: "Shop Now",
    promoCtaHref: "/products",
    promoImage: "",
    headerTitle: "Our Blog",
    headerSubtitle: "From Shopping Guides To Lifestyle Recommendations, Explore Our Blog And Learn Everything You Need To Know About Jewellery.",
    emptyText: "Blog posts coming soon. Stay tuned for shopping guides, lifestyle tips, and everything about jewellery.",
  },
  contactPage: {
    heroTitle: "Contact Kerala Jewellers",
    heroSubtitle:
      "We're here to help you with store visits, jewellery enquiries, custom designs, and service support.",
    cardTitle: "Get In Touch",
    cardDescription:
      "Looking for a specific jewellery design, bridal collection, custom order, or gold/silver rate update? Our team will guide you with product availability, store visit support, and purchase assistance.",
    cardItems: [],
    cardQuote: "Send us a message and our team will get back to you shortly.",
    branchesTitle: "Our Branches",
    formTitle: "Send Us a Message",
  },
  productsPage: {
    goldHero: { title: "Elegant & Timeless Gold Jewellery", subtitle: "Discover our exclusive collection of gold jewellery that stands the test of time. Perfect for every occasion." },
    silverHero: { title: "Classic Elegance in Silver", subtitle: "Explore our collection of timeless silver jewellery. Perfectly crafted for every moment." },
    diamondHero: { title: "Timeless Brilliance in Diamonds", subtitle: "Discover our exquisite collection of diamond jewellery, crafted to perfection for every occasion." },
    platinumHero: { title: "Exquisite Platinum Jewellery", subtitle: "Explore our refined collection of platinum jewellery, crafted for those who appreciate understated luxury." },
  },
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

async function loadArrayDataViaPayload(payload: Awaited<ReturnType<typeof getPayload>>): Promise<SiteSettingsData> {
  const settings = await payload.findGlobal({
    slug: "site-settings",
    depth: 1,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapSlide = (s: any) => ({
    heading: s.heading || "",
    description: s.description || "",
    ctaText: s.ctaText || "",
    ctaHref: s.ctaHref || "",
    image: resolveMediaUrl(s.image),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapCircleBanner = (b: any) => ({
    blockType: "circleBanner" as const,
    title: b.title || "",
    description: b.description || "",
    image: resolveMediaUrl(b.image),
    alt: b.alt || "",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapImageBanner = (b: any) => ({
    blockType: "imageBanner" as const,
    image: resolveMediaUrl(b.image),
    alt: b.alt || "",
    title: b.title || "",
    ctaText: b.ctaText || "",
    href: b.href || "",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapHeritage = (h: any) => ({
    heading: h.heading || "",
    description: h.description || "",
    image: resolveMediaUrl(h.image),
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapReview = (r: any) => ({
    text: r.text || "",
    author: r.author || "",
    location: r.location || "",
  });

  const reviewsResult = await payload.find({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- collection type will exist after types regen
    collection: "reviews" as any,
    limit: 100,
    sort: "createdAt",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapCategory = (c: any) => ({
    title: c.title || "",
    description: c.description || "",
    ctaText: c.ctaText || "",
    ctaHref: c.ctaHref || "",
    variant: c.variant || "",
  });

  return {
    heroSlides: (settings.heroSlides || []).map(mapSlide),
    features: (settings.features || []).map(mapCircleBanner),
    banners: (settings.banners || []).map(mapImageBanner),
    heritage: (settings.heritage || []).map(mapHeritage),
    reviews: reviewsResult.docs.map(mapReview),
    categories: (settings.categories || []).map(mapCategory),
    // Carry over all scalar fields from DEFAULT_SETTINGS
    rateGold22: (settings.rateGold22 as string) || DEFAULT_SETTINGS.rateGold22,
    rateGold18: (settings.rateGold18 as string) || DEFAULT_SETTINGS.rateGold18,
    rateSilver: (settings.rateSilver as string) || DEFAULT_SETTINGS.rateSilver,
    ratePlatinum: (settings.ratePlatinum as string) || DEFAULT_SETTINGS.ratePlatinum,
    rateUpdated: (settings.rateUpdated as string) || DEFAULT_SETTINGS.rateUpdated,
    footerAbout: (settings.footerAbout as string) || DEFAULT_SETTINGS.footerAbout,
    instagramUrl: (settings.instagramUrl as string) || DEFAULT_SETTINGS.instagramUrl,
    facebookUrl: (settings.facebookUrl as string) || DEFAULT_SETTINGS.facebookUrl,
    youtubeUrl: (settings.youtubeUrl as string) || DEFAULT_SETTINGS.youtubeUrl,
    phone: (settings.phone as string) || DEFAULT_SETTINGS.phone,
    whatsapp: (settings.whatsapp as string) || DEFAULT_SETTINGS.whatsapp,
    email: (settings.email as string) || DEFAULT_SETTINGS.email,
    storeTiming: (settings.storeTiming as string) || DEFAULT_SETTINGS.storeTiming,
    bestsellerProducts: (Array.isArray(settings.bestsellerProducts) ? settings.bestsellerProducts : []).map((p: any) => ({
      id: p.id || "",
      name: p.title || p.name || "",
      slug: p.slug || "",
      image: resolveMediaUrl(p.image) || "",
      metal: p.metal || "",
      category: p.category?.name || "",
    })),
    headingFont: ((settings as unknown as Record<string, unknown>)["headingFont"] as string) || DEFAULT_SETTINGS.headingFont,
    bodyFont: ((settings as unknown as Record<string, unknown>)["bodyFont"] as string) || DEFAULT_SETTINGS.bodyFont,
    uiFont: ((settings as unknown as Record<string, unknown>)["uiFont"] as string) || DEFAULT_SETTINGS.uiFont,
    fontPairing: ((settings as unknown as Record<string, unknown>)["fontPairing"] as string) || DEFAULT_SETTINGS.fontPairing,
    baseFontSize: ((settings as unknown as Record<string, unknown>)["baseFontSize"] as string) || DEFAULT_SETTINGS.baseFontSize,
    headingScale: ((settings as unknown as Record<string, unknown>)["headingScale"] as string) || DEFAULT_SETTINGS.headingScale,
    customFonts: ((settings as unknown as Record<string, unknown>)["customFonts"] as string) || DEFAULT_SETTINGS.customFonts,
    homepageSections: (() => {
      const hs = (settings as unknown as Record<string, unknown>)?.homepageSections as Record<string, unknown> | undefined;
      return {
        bestsellersTitle: (hs?.bestsellersTitle as string) || DEFAULT_SETTINGS.homepageSections.bestsellersTitle,
        bestsellersSubtitle: (hs?.bestsellersSubtitle as string) || DEFAULT_SETTINGS.homepageSections.bestsellersSubtitle,
        latestTitle: (hs?.latestTitle as string) || DEFAULT_SETTINGS.homepageSections.latestTitle,
        latestSubtitle: (hs?.latestSubtitle as string) || DEFAULT_SETTINGS.homepageSections.latestSubtitle,
        reviewsTitle: (hs?.reviewsTitle as string) || DEFAULT_SETTINGS.homepageSections.reviewsTitle,
        reviewsSubtitle: (hs?.reviewsSubtitle as string) || DEFAULT_SETTINGS.homepageSections.reviewsSubtitle,
      };
    })(),
    blogPage: (() => {
      const bp = (settings as unknown as Record<string, unknown>)?.blogPage as Record<string, unknown> | undefined;
      return {
        promoHeading: (bp?.promoHeading as string) || DEFAULT_SETTINGS.blogPage.promoHeading,
        promoDescription: (bp?.promoDescription as string) || DEFAULT_SETTINGS.blogPage.promoDescription,
        promoCtaText: (bp?.promoCtaText as string) || DEFAULT_SETTINGS.blogPage.promoCtaText,
        promoCtaHref: (bp?.promoCtaHref as string) || DEFAULT_SETTINGS.blogPage.promoCtaHref,
        promoImage: bp?.promoImage ? resolveMediaUrl(bp.promoImage) : "",
        headerTitle: (bp?.headerTitle as string) || DEFAULT_SETTINGS.blogPage.headerTitle,
        headerSubtitle: (bp?.headerSubtitle as string) || DEFAULT_SETTINGS.blogPage.headerSubtitle,
        emptyText: (bp?.emptyText as string) || DEFAULT_SETTINGS.blogPage.emptyText,
      };
    })(),
    contactPage: (() => {
      const cp = (settings as unknown as Record<string, unknown>)?.contactPage as Record<string, unknown> | undefined;
      return {
        heroTitle: (cp?.heroTitle as string) || DEFAULT_SETTINGS.contactPage.heroTitle,
        heroSubtitle: (cp?.heroSubtitle as string) || DEFAULT_SETTINGS.contactPage.heroSubtitle,
        cardTitle: (cp?.cardTitle as string) || DEFAULT_SETTINGS.contactPage.cardTitle,
        cardDescription: (cp?.cardDescription as string) || DEFAULT_SETTINGS.contactPage.cardDescription,
        cardItems: (cp?.cardItems as Array<Record<string, unknown>> || []).map((i) => ({ text: (i.text as string) || "" })),
        cardQuote: (cp?.cardQuote as string) || DEFAULT_SETTINGS.contactPage.cardQuote,
        branchesTitle: (cp?.branchesTitle as string) || DEFAULT_SETTINGS.contactPage.branchesTitle,
        formTitle: (cp?.formTitle as string) || DEFAULT_SETTINGS.contactPage.formTitle,
      };
    })(),
    productsPage: (() => {
      const pp = (settings as unknown as Record<string, unknown>)?.productsPage as Record<string, unknown> | undefined;
      const gold = pp?.goldHero as Record<string, unknown> | undefined;
      const silver = pp?.silverHero as Record<string, unknown> | undefined;
      const diamond = pp?.diamondHero as Record<string, unknown> | undefined;
      const platinum = pp?.platinumHero as Record<string, unknown> | undefined;
      return {
        goldHero: { title: (gold?.title as string) || DEFAULT_SETTINGS.productsPage.goldHero.title, subtitle: (gold?.subtitle as string) || DEFAULT_SETTINGS.productsPage.goldHero.subtitle },
        silverHero: { title: (silver?.title as string) || DEFAULT_SETTINGS.productsPage.silverHero.title, subtitle: (silver?.subtitle as string) || DEFAULT_SETTINGS.productsPage.silverHero.subtitle },
        diamondHero: { title: (diamond?.title as string) || DEFAULT_SETTINGS.productsPage.diamondHero.title, subtitle: (diamond?.subtitle as string) || DEFAULT_SETTINGS.productsPage.diamondHero.subtitle },
        platinumHero: { title: (platinum?.title as string) || DEFAULT_SETTINGS.productsPage.platinumHero.title, subtitle: (platinum?.subtitle as string) || DEFAULT_SETTINGS.productsPage.platinumHero.subtitle },
      };
    })(),
    defaultSeo: (() => {
      const ds = (settings as unknown as Record<string, unknown>)?.defaultSeo as Record<string, unknown> | undefined;
      return {
        title: (ds?.title as string) || DEFAULT_SETTINGS.defaultSeo.title,
        description: (ds?.description as string) || DEFAULT_SETTINGS.defaultSeo.description,
        ogImage: resolveMediaUrl(ds?.ogImage) || "",
      };
    })(),
    aboutPage: (() => {
      const ap = (settings as unknown as Record<string, unknown>)?.aboutPage as Record<string, unknown> | undefined;
      if (!ap) return DEFAULT_SETTINGS.aboutPage;
      const go = ap.goldenOccasions as Record<string, unknown> | undefined;
      const tm = ap.tasteMeetsTradition as Record<string, unknown> | undefined;
      const or = ap.origins as Record<string, unknown> | undefined;
      const ve = ap.ventures as Record<string, unknown> | undefined;
      return {
        goldenOccasions: {
          heading: (go?.heading as string) || DEFAULT_SETTINGS.aboutPage.goldenOccasions.heading,
          paragraphs: (go?.paragraphs as Array<Record<string, unknown>> || []).map((p) => ({
            text: (p.text as string) || "",
          })),
          image: go?.image ? resolveMediaUrl(go.image) : "",
          alt: (go?.alt as string) || "About Kerala Jewellers",
        },
        tasteMeetsTradition: {
          heading: (tm?.heading as string) || DEFAULT_SETTINGS.aboutPage.tasteMeetsTradition.heading,
          text: (tm?.text as string) || "",
        },
        origins: {
          heading: (or?.heading as string) || DEFAULT_SETTINGS.aboutPage.origins.heading,
          intro: (or?.intro as string) || "",
        },
        timeline: (ap.timeline as Array<Record<string, unknown>> || []).map((t) => ({
          year: (t.year as string) || "",
          title: (t.title as string) || "",
          text: (t.text as string) || "",
          image: resolveMediaUrl(t.image) || "",
        })),
        ventures: {
          heading: (ve?.heading as string) || DEFAULT_SETTINGS.aboutPage.ventures.heading,
          subheading: (ve?.subheading as string) || "Our Dedicated Wedding Hall",
          image: resolveMediaUrl(ve?.image) || "",
          alt: (ve?.alt as string) || "",
          bullets: (ve?.bullets as Array<Record<string, unknown>> || []).map((b) => ({
            text: (b.text as string) || "",
          })),
          cta1Text: (ve?.cta1Text as string) || "Know More About Us",
          cta1Href: (ve?.cta1Href as string) || "https://www.ayswariyamahal.com/",
          cta2Text: (ve?.cta2Text as string) || "Find Us",
          cta2Href: (ve?.cta2Href as string) || "https://maps.app.goo.gl/vP759GxjSJLK4oU88",
        },
      };
    })(),
    branches: (() => {
      const br = (settings as unknown as Record<string, unknown>)?.branches;
      if (Array.isArray(br) && br.length > 0) {
        return br.map((b: Record<string, unknown>) => ({
          name: (b.name as string) || "",
          address: (b.address as string) || "",
          phone: (b.phone as string) || "",
          phoneFull: (b.phoneFull as string) || "",
          email: (b.email as string) || "",
          hours: (b.hours as string) || "",
          mapQ: (b.mapQ as string) || "",
          mapEmbedUrl: (b.mapEmbedUrl as string) || "",
        }));
      }
      return DEFAULT_SETTINGS.branches;
    })(),
  };
}

async function loadArrayDataViaSQL(
  data: SiteSettingsData,
): Promise<SiteSettingsData> {
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
      `SELECT text, author, location FROM reviews
       ORDER BY created_at ASC`);
    const catsRes = await pool.query(
      `SELECT title, description, cta_text, cta_href, variant FROM site_settings_categories
       WHERE _parent_id = $1 ORDER BY _order`, [ssId]);
    const branchesRes = await pool.query(
      `SELECT name, address, phone, phone_full, email, hours, map_q, map_embed_url
       FROM site_settings_branches WHERE _parent_id = $1 ORDER BY _order`, [ssId]);
    const bestsellersRes = await pool.query(
      `SELECT p.id, p.title, p.slug, p.metal, c.name AS category_name,
              m.url AS image_url, m.cloudinary_public_id AS cloudinary_public_id
       FROM site_settings_bestseller_products bp
       JOIN products p ON bp.product_id = p.id
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN media m ON p.image_id = m.id
       WHERE bp._parent_id = $1 ORDER BY bp._order`, [ssId]);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      branches: branchesRes.rows.length > 0 ? branchesRes.rows.map((r: any) => ({
        name: r.name || "",
        address: r.address || "",
        phone: r.phone || "",
        phoneFull: r.phone_full || "",
        email: r.email || "",
        hours: r.hours || "",
        mapQ: r.map_q || "",
        mapEmbedUrl: r.map_embed_url || "",
      })) : data.branches,
      bestsellerProducts: bestsellersRes.rows.map((r: any) => ({
        id: String(r.id || ""),
        name: r.title || "",
        slug: r.slug || "",
        image: r.cloudinary_public_id
          ? cloudinaryUrl(r.cloudinary_public_id)
          : normalizeMigratedMediaUrl(r.image_url) || "",
        metal: r.metal || "",
        category: r.category_name || "",
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
    if (isPostgres()) {
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
      return loadArrayDataViaSQL(result);
    }

    // SQLite path: use Payload API with depth:1 to resolve relationships
    return await loadArrayDataViaPayload(payload);
  } catch {
    return DEFAULT_SETTINGS;
  }
  });
}
