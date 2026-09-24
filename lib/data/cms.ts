/* eslint-disable */
import { getPayload } from "payload";
import config from "@payload-config";
import { Pool } from "@neondatabase/serverless";
import { cloudinaryUrl, normalizeCloudinaryDeliveryUrl } from "../cloudinary/index.ts";
import {
  type Product,
  type BlogPost,
  type LegalPage,
  type SeoFields,
} from "./types";

type PayloadDoc = Record<string, any>;

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
const _inflight = new Map<string, Promise<unknown>>();
const CACHE_TTL = 5 * 60 * 1000;
function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = _cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return Promise.resolve(hit.data as T);
  const pending = _inflight.get(key);
  if (pending) return pending as Promise<T>;
  const p = fn()
    .then((data) => {
      _cache.set(key, { data, ts: Date.now() });
      return data;
    })
    .finally(() => _inflight.delete(key));
  _inflight.set(key, p);
  return p as Promise<T>;
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

const ABOUT_TIMELINE_IMAGE_BY_YEAR: Record<string, string> = {
  "1933": "/assets/images/67986b979c74971ca6057553_Frame%202085665174.png",
  "1958": "/assets/images/67986b979c74971ca6057545_Rectangle%20361.png",
  "1959": "/assets/images/67986b979c74971ca605754c_Rectangle%20363.png",
  "1972": "/assets/images/66ae1615ca0720284bf1565b_Rectangle%20369%20(4).png",
  "1988": "/assets/images/66ae249ccb35781959eac6fc_Rectangle%20366%20(6).png",
  "1992": "/assets/images/66ae22bef52614a0871d61a2_Rectangle%20367%20(8).png",
  "2001": "/assets/images/66ae1617c6c2ad9398a45485_Rectangle%20369%20(1).png",
  "2002": "/assets/images/66ae22bea9cab6312ffdd45d_Rectangle%20367%20(7).png",
  "2008": "/assets/images/66ae1616868e2e539cbfc0c9_Rectangle%20368%20(2).png",
  "2015": "/assets/images/66ae16158fbb46cce3ea01a5_Rectangle%20368%20(1).png",
  "2022": "/assets/images/66ae1617c6c2ad9398a45485_Rectangle%20369%20(1).png",
};

function getAboutTimelineImage(year?: string, image?: string): string {
  const fallback = year ? ABOUT_TIMELINE_IMAGE_BY_YEAR[year] || "" : "";
  return image || fallback;
}

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
  return normalizeCloudinaryDeliveryUrl(url);
}

function mapSqlProduct(row: any): Product {
  let imageUrl: string;
  if (row.cloudinary_public_id) {
    imageUrl = cloudinaryUrl(row.cloudinary_public_id);
  } else if (row.image_url && row.image_url.startsWith("http")) {
      imageUrl = normalizeCloudinaryDeliveryUrl(row.image_url);
  } else {
    imageUrl = "/assets/images/placeholder.svg";
  }
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

export function isPostgres(): boolean {
  const dbUri = process.env.DATABASE_URL || process.env.DATABASE_URI;
  return !!dbUri && (dbUri.startsWith("postgresql") || dbUri.startsWith("postgres://"));
}

async function sqlFindProducts(
  whereClause: string,
  params: any[],
  limit: number,
  offset: number,
  sort?: string,
): Promise<{ products: Product[]; totalDocs: number }> {
  const pool = getPool();
  const countQ = await pool.query(
    `SELECT COUNT(*)::int AS cnt FROM products p ${whereClause}`,
    params,
  );
  const totalDocs: number = countQ.rows[0]?.cnt ?? 0;
  let orderBy = "ORDER BY p.id DESC";
  if (sort === "asc") orderBy = "ORDER BY p.title ASC";
  if (sort === "desc") orderBy = "ORDER BY p.title DESC";
  const result = await pool.query(
    `${PRODUCT_SQL_BASE} ${whereClause} ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
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

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    return await cached("all-product-slugs", async () => {
      if (isPostgres()) {
        const pool = getPool();
        const { rows } = await pool.query(`SELECT slug FROM products ORDER BY id`);
        return rows.map((r: any) => r.slug);
      }
      const payload = await getPayload({ config });
      const { docs } = await payload.find({
        collection: "products",
        limit: 500,
        depth: 0,
        select: { slug: true },
      });
      return docs.map((d) => d.slug as string);
    });
  } catch (err) {
    console.error("[CMS] getAllProductSlugs failed:", err);
    return [];
  }
}

export async function getRelatedProducts(
  metal: string,
  excludeSlug: string,
  limit = 4,
): Promise<Product[]> {
  try {
    return await cached(`related:${metal}:${excludeSlug}:${limit}`, async () => {
      if (isPostgres()) {
        const pool = getPool();
        const rows = await pool.query(
          `${PRODUCT_SQL_BASE} WHERE p.metal = $1 AND p.slug != $2 ORDER BY RANDOM() LIMIT $3`,
          [metal, excludeSlug, limit],
        );
        return rows.rows.map(mapSqlProduct);
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
    });
  } catch (err) {
    console.error("[CMS] getRelatedProducts failed:", err);
    return [];
  }
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
  sort?: string,
): Promise<PaginatedProducts> {
  const key = `products:${metal}:${page}:${limit}:${categorySlug || ""}:${sort || ""}`;
  try {
    return await cached(key, async () => {
      if (isPostgres()) {
        let where = "WHERE p.metal = $1";
        const params: any[] = [metal];
        if (categorySlug) {
          where += " AND p.category_id IN (SELECT id FROM categories WHERE slug = $2)";
          params.push(categorySlug);
        }
        const offset = (page - 1) * limit;
        const { products, totalDocs } = await sqlFindProducts(where, params, limit, offset, sort);
        const totalPages = Math.ceil(totalDocs / limit);
        return {
          products,
          totalDocs,
          totalPages,
          page,
          hasNextPage: page < totalPages,
        };
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

      let sortParam: string | undefined;
      if (sort === "asc") sortParam = "title";
      if (sort === "desc") sortParam = "-title";

      const { docs, totalDocs, totalPages } = await payload.find({
        collection: "products",
        where,
        page,
        limit,
        depth: 1,
        ...(sortParam ? { sort: sortParam } : {}),
      });

      return {
        products: docs.map(mapProduct),
        totalDocs,
        totalPages,
        page,
        hasNextPage: page < totalPages,
      };
    });
  } catch (err) {
    console.error("[CMS] getProductsByMetalPaginated failed:", err);
    return {
      products: [],
      totalDocs: 0,
      totalPages: 0,
      page,
      hasNextPage: false,
    };
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  try {
    return await cached(`product:${slug}`, async () => {
      if (isPostgres()) {
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
      }
      const payload = await getPayload({ config });
      const { docs } = await payload.find({
        collection: "products",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
      });
      return docs[0] ? mapProduct(docs[0]) : undefined;
    });
  } catch (err) {
    console.error("[CMS] getProductBySlug failed:", err);
    return undefined;
  }
}

export async function getBlogPosts(limit = 100): Promise<BlogPost[]> {
  try {
    return await cached(`blog-posts:${limit}`, async () => {
      if (isPostgres()) {
        const pool = getPool();
        const { rows } = await pool.query(
          `${BLOG_SQL_BASE} ORDER BY b.id DESC LIMIT $1`,
          [limit],
        );
        return rows.map((row) => mapSqlBlogPost(row));
      }
      const payload = await getPayload({ config });
      const { docs } = await payload.find({ collection: "blog-posts", limit });
      return docs.map(mapBlogPost);
    });
  } catch (err) {
    console.error("[CMS] getBlogPosts failed:", err);
    return [];
  }
}

export async function getRelatedBlogPosts(
  excludeSlug: string,
  limit = 3,
): Promise<BlogPost[]> {
  try {
    return await cached(`related-blog:${excludeSlug}:${limit}`, async () => {
      if (isPostgres()) {
        const pool = getPool();
        const { rows } = await pool.query(
          `${BLOG_SQL_BASE}
           WHERE b.slug != $1
           ORDER BY b.id DESC
           LIMIT $2`,
          [excludeSlug, limit],
        );
        return rows.map((row) => mapSqlBlogPost(row));
      }
      const payload = await getPayload({ config });
      const { docs } = await payload.find({
        collection: "blog-posts",
        where: { slug: { not_equals: excludeSlug } },
        limit,
      });
      return docs.map(mapBlogPost);
    });
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | undefined> {
  try {
    return await cached(`blog:${slug}`, async () => {
      if (isPostgres()) {
        const pool = getPool();
        const { rows } = await pool.query(
          `${BLOG_SQL_BASE} WHERE b.slug = $1 LIMIT 1`,
          [slug],
        );
        if (!rows[0]) return undefined;
        const body = await getSqlBlogBody(Number(rows[0].id));
        return mapSqlBlogPost(rows[0], body);
      }
      const payload = await getPayload({ config });
      const { docs } = await payload.find({
        collection: "blog-posts",
        where: { slug: { equals: slug } },
        limit: 1,
      });
      return docs[0] ? mapBlogPost(docs[0]) : undefined;
    });
  } catch {
    return undefined;
  }
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
  try {
    return await cached(`legal:${slug}`, async () => {
      const payload = await getPayload({ config });
      const { docs } = await payload.find({
        collection: "legal-pages",
        where: { slug: { equals: slug } },
        limit: 1,
      });
      return docs[0] ? mapLegalPage(docs[0]) : undefined;
    });
  } catch {
    return undefined;
  }
}

const DEFAULT_CATEGORIES: Record<string, Array<{ name: string; slug: string }>> = {
  gold: [
    { name: "Bangles", slug: "bangles-gold" },
    { name: "Bracelet", slug: "bracelet-gold" },
    { name: "Pendant", slug: "pendant-gold" },
    { name: "Necklace", slug: "necklace-gold" },
    { name: "Rings", slug: "rings-gold" },
    { name: "Earrings", slug: "earrings-gold" },
  ],
  silver: [
    { name: "Bracelet", slug: "bracelet-silver" },
    { name: "Necklace", slug: "necklace-silver" },
    { name: "Idols", slug: "idols-silver" },
    { name: "Anklets", slug: "anklets-silver" },
  ],
  diamond: [
    { name: "Necklace", slug: "necklace-diamond" },
    { name: "Ring", slug: "ring-diamond" },
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
        const params: any[] = [];
        if (metal) {
          query += " WHERE metal = $1";
          params.push(metal);
        }
        query += " ORDER BY display_order";
        const { rows } = await pool.query(query, params);
        if (rows.length > 0) {
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
    isPinned?: boolean;
  }>;
  heroSliderPaused?: boolean;
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
    image: string;
  }>;
  branches: Array<{
    name: string;
    address: string;
    phone: string;
    phoneFull: string;
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
    goldHero: { title: string; subtitle: string; image?: string };
    silverHero: { title: string; subtitle: string; image?: string };
    diamondHero: { title: string; subtitle: string; image?: string };
    platinumHero: { title: string; subtitle: string; image?: string };
  };
  thangaMazhai: {
    banner: string;
    title: string;
    heading: string;
    description: string;
    benefits: Array<{ text: string }>;
    whyChoose: Array<{ text: string }>;
  };
  swarnavarsha: {
    title: string;
    tcHeading: string;
    bullets: Array<{ text: string }>;
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

export const DEFAULT_SETTINGS: SiteSettingsData = {
  rateGold22: "7,450",
  rateGold18: "6,080",
  rateSilver: "92",
  ratePlatinum: "3,890",
  rateUpdated: "27-06-2026",
  heroSlides: [],
  heroSliderPaused: false,
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
    goldHero: { title: "Elegant & Timeless Gold Jewellery", subtitle: "Discover our exclusive collection of gold jewellery that stands the test of time. Perfect for every occasion.", image: "" },
    silverHero: { title: "Classic Elegance in Silver", subtitle: "Explore our collection of timeless silver jewellery. Perfectly crafted for every moment.", image: "" },
    diamondHero: { title: "Timeless Brilliance in Diamonds", subtitle: "Discover our exquisite collection of diamond jewellery, crafted to perfection for every occasion.", image: "" },
    platinumHero: { title: "Exquisite Platinum Jewellery", subtitle: "Explore our refined collection of platinum jewellery, crafted for those who appreciate understated luxury.", image: "" },
  },
  thangaMazhai: {
    banner: "",
    title: "Thanga Mazhai Scheme",
    heading: "THANGA MAZHAI IS A ONE TIME INVESTMENT SCHEME WHERE YOU CAN DEPOSIT",
    description: "Old gold ornaments of 916 purity or equivalent cash value (via card, UPI, etc.)",
    benefits: [],
    whyChoose: [],
  },
  swarnavarsha: {
    title: "Swarnavarsha Scheme",
    tcHeading: "TERMS & CONDITIONS:",
    bullets: [],
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
    timeline: [
      {
        year: "1933",
        title: "",
        text: "In 1933, Mr.P.C.Varghese, a visionary entrepreneur with a deep appreciation for fine jewellery, founded Kerala Jewellers in Ponkunnam, Kottayam district,Kerala. Mrs.Annamma Varghese was a visionary designer whose work significantly impacted the world of gold jewellery. Her designs brought a fresh perspective to traditional jewellery and she was the inspiration to start this gold business.",
        image: "/assets/images/67986b979c74971ca6057553_Frame%202085665174.png"
      },
      {
        year: "1958",
        title: "The Next Generation",
        text: "Mr.Jose Cheeramvelil Vision was the same with Mr.P.C.Varghese, his son Mr. Jose Cheeramvelil took over the reins of Kerala Jewellers.",
        image: "/assets/images/67986b979c74971ca6057545_Rectangle%20361.png"
      },
      {
        year: "1959",
        title: "Relocation to Ranganathan Street, T Nagar",
        text: "Recognizing the evolving market and the need for a more prominent presence, Kerala Jewellers was moved to Ranganathan Street, T Nagar, Chennai's bustling main shopping area. A Blessing for Chennai Shoppers. The move to T Nagar was a blessing for the people of Chennai. Kerala Jewellers became a highly sought-after destination for those seeking high-quality gold jewellery. The store gained a reputation for offering lightweight designs, which was elegant while retaining the essence of traditional South Indian styles",
        image: "/assets/images/67986b979c74971ca605754c_Rectangle%20363.png"
      },
      {
        year: "1972",
        title: "A New Era with Mr.George Joseph (Wilson)",
        text: "The addition of Mr. George Joseph, also known as Wilson, to Kerala Jewellers marked the beginning of a new chapter in the family's illustrious business. Bringing with him a fresh perspective and a deep commitment to continuing the family's tradition of excellence, Mr Wilson played a pivotal role in furthering the brand—™s reputation and reach.",
        image: "/assets/images/66ae1615ca0720284bf1565b_Rectangle%20369%20(4).png"
      },
      {
        year: "1988",
        title: "The New Showroom on Ranganathan Street",
        text: "Recognizing the need to innovate and expand, Mr. George Joseph launched his unique showroom on the bustling Ranganathan Street in T Nagar. This area, known as the heart of Chennai's shopping district,",
        image: "/assets/images/66ae249ccb35781959eac6fc_Rectangle%20366%20(6).png"
      },
      {
        year: "1992",
        title: "The Opening of the Second Store",
        text: "On April 13, 1992, Mr. George Joseph inaugurated the second Kerala Jewellers store in Pondy Bazaar. This new location was strategically chosen for its high foot traffic and reputation as a bustling commercial hub in Chennai.",
        image: "/assets/images/66ae22bef52614a0871d61a2_Rectangle%20367%20(8).png"
      },
      {
        year: "2001",
        title: "The Inception of Ayswariya Mahal",
        text: "Ayswariya Mahal was conceived with the idea of providing a luxurious and spacious venue for weddings exhibition and other grand events. Recognizing the growing demand for premium event spaces in Chennai, Mr. George Joseph decided to expand his business portfolio by entering the hospitality sector. The marriage hall was designed to offer a perfect blend of elegance and functionality, making it an ideal choice for various celebrations.",
        image: "/assets/images/66ae1617c6c2ad9398a45485_Rectangle%20369%20(1).png"
      },
      {
        year: "2002",
        title: "Expansion to Purasaiwalkam",
        text: "In 2002, Kerala Jewellers embarked on a new venture with the opening of a store in Purasaiwalkam, a bustling area in Chennai. This expansion was overseen and managed by Mr. Siby Joseph, the son-in-law of Mr. George Joseph (Wilson), marking a significant milestone in the family business.",
        image: "/assets/images/66ae22bea9cab6312ffdd45d_Rectangle%20367%20(7).png"
      },
      {
        year: "2008",
        title: "The Porur Branch Opening",
        text: "On December 3, 2008, Kerala Jewellers expanded its reach further with the opening of a new branch in Porur, Chennai. This new store was managed by Mr. Roopesh George, the son of Mr. George Joseph (Wilson), marking another significant milestone in the family business.",
        image: "/assets/images/66ae1616868e2e539cbfc0c9_Rectangle%20368%20(2).png"
      },
      {
        year: "2015",
        title: "The Launch of Pebbles",
        text: "On February 15, 2015, Mr. George Joseph (Wilson) expanded his entrepreneurial portfolio into the hospitality sector with the launch of \"Pebbles,\" a service apartment. This new venture marked a significant addition to his diverse business interests and demonstrated his continued commitment to excellence in service.",
        image: "/assets/images/66ae16158fbb46cce3ea01a5_Rectangle%20368%20(1).png"
      },
      {
        year: "2022",
        title: "Renovation of the Pondy Bazaar Showroom",
        text: "The Pondy Bazaar showroom of Kerala Jewellers underwent a significant renovation to transform it into a boutique store, reflecting a fresh and modern approach. This renovation marked a new chapter in the showroom—™s evolution, aiming to enhance the customer experience and align with contemporary retail trends.with wide range ofcollections in Gold,Silver and Diamonds we always make sure the purity of gold is our priority and customers service and satisfaction is key",
        image: "/assets/images/66ae1617c6c2ad9398a45485_Rectangle%20369%20(1).png"
      }
    ],
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

// The `bestsellerProducts` site setting is stored as a comma-separated list of
// product slugs in the `site_settings.bestseller_products` column (not a join table).
// Normalize whatever form it arrives in (CSV string, array of slugs, or array of
// resolved product docs) into an ordered array of product slugs.
function parseBestsellerSlugs(input: unknown): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((p) => (typeof p === "string" ? p : (p as Record<string, unknown>)?.slug || (p as Record<string, unknown>)?.id || ""))
      .map((s) => String(s).trim())
      .filter(Boolean);
  }
  return String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function loadArrayDataViaPayload(payload: Awaited<ReturnType<typeof getPayload>>): Promise<SiteSettingsData> {
  const settings = await payload.findGlobal({
    slug: "site-settings",
    depth: 1,
  });

  const mapSlide = (s: any) => ({
    heading: s.heading || "",
    description: s.description || "",
    ctaText: s.ctaText || "",
    ctaHref: s.ctaHref || "",
    image: resolveMediaUrl(s.image),
    isPinned: Boolean(s.isPinned),
  });
  const mapCircleBanner = (b: any) => ({
    blockType: "circleBanner" as const,
    title: b.title || "",
    description: b.description || "",
    image: resolveMediaUrl(b.image),
    alt: b.alt || "",
  });
  const mapImageBanner = (b: any) => ({
    blockType: "imageBanner" as const,
    image: resolveMediaUrl(b.image),
    alt: b.alt || "",
    title: b.title || "",
    ctaText: b.ctaText || "",
    href: b.href || "",
  });
  const mapHeritage = (h: any) => ({
    heading: h.heading || "",
    description: h.description || "",
    image: resolveMediaUrl(h.image),
  });
  const mapReview = (r: any) => ({
    text: r.text || "",
    author: r.author || "",
    location: r.location || "",
  });

  const reviewsResult = await payload.find({
    collection: "reviews" as any,
    limit: 100,
    sort: "createdAt",
  });

  const mapCategory = (c: any) => ({
    title: c.title || "",
    description: c.description || "",
    ctaText: c.ctaText || "",
    ctaHref: c.ctaHref || "",
    variant: c.variant || "",
    image: resolveMediaUrl(c.image),
  });
  const heroSliderPaused = Boolean((settings as unknown as Record<string, unknown>)["sliderPaused"]);
  return {
    heroSlides: (settings.heroSlides || []).map(mapSlide),
    heroSliderPaused,
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
    bestsellerProducts: await (async () => {
      const bestSlugs = parseBestsellerSlugs(settings.bestsellerProducts);
      if (!bestSlugs.length) return [];
      const res = await payload.find({
        collection: "products" as any,
        where: { slug: { in: bestSlugs } },
        limit: 100,
        depth: 0,
      });
      const bySlug = new Map<string, any>((res.docs as any[]).map((p) => [p.slug, p]));
      return bestSlugs
        .map((slug: string) => bySlug.get(slug))
        .filter(Boolean)
        .map((p: any) => ({
          id: String(p.id || ""),
          name: p.title || p.name || "",
          slug: p.slug || "",
          image: resolveMediaUrl(p.image) || "",
          metal: p.metal || "",
          category: p.category?.name || "",
        }));
    })(),
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
        goldHero: {
          title: (gold?.title as string) || DEFAULT_SETTINGS.productsPage.goldHero.title,
          subtitle: (gold?.subtitle as string) || DEFAULT_SETTINGS.productsPage.goldHero.subtitle,
          image: gold?.image ? resolveMediaUrl(gold.image) : "",
        },
        silverHero: {
          title: (silver?.title as string) || DEFAULT_SETTINGS.productsPage.silverHero.title,
          subtitle: (silver?.subtitle as string) || DEFAULT_SETTINGS.productsPage.silverHero.subtitle,
          image: silver?.image ? resolveMediaUrl(silver.image) : "",
        },
        diamondHero: {
          title: (diamond?.title as string) || DEFAULT_SETTINGS.productsPage.diamondHero.title,
          subtitle: (diamond?.subtitle as string) || DEFAULT_SETTINGS.productsPage.diamondHero.subtitle,
          image: diamond?.image ? resolveMediaUrl(diamond.image) : "",
        },
        platinumHero: {
          title: (platinum?.title as string) || DEFAULT_SETTINGS.productsPage.platinumHero.title,
          subtitle: (platinum?.subtitle as string) || DEFAULT_SETTINGS.productsPage.platinumHero.subtitle,
          image: platinum?.image ? resolveMediaUrl(platinum.image) : "",
        },
      };
    })(),
    thangaMazhai: (() => {
      const tm = (settings as unknown as Record<string, unknown>)?.thangaMazhai as Record<string, unknown> | undefined;
      return {
        banner: tm?.banner ? resolveMediaUrl(tm.banner) : "",
        title: (tm?.title as string) || DEFAULT_SETTINGS.thangaMazhai.title,
        heading: (tm?.heading as string) || DEFAULT_SETTINGS.thangaMazhai.heading,
        description: (tm?.description as string) || DEFAULT_SETTINGS.thangaMazhai.description,
        benefits: (tm?.benefits as Array<Record<string, unknown>> || []).map((b) => ({ text: (b.text as string) || "" })),
        whyChoose: (tm?.whyChoose as Array<Record<string, unknown>> || []).map((w) => ({ text: (w.text as string) || "" })),
      };
    })(),
    swarnavarsha: (() => {
      const sw = (settings as unknown as Record<string, unknown>)?.swarnavarsha as Record<string, unknown> | undefined;
      return {
        title: (sw?.title as string) || DEFAULT_SETTINGS.swarnavarsha.title,
        tcHeading: (sw?.tcHeading as string) || DEFAULT_SETTINGS.swarnavarsha.tcHeading,
        bullets: (sw?.bullets as Array<Record<string, unknown>> || []).map((b) => ({ text: (b.text as string) || "" })),
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
        timeline: (() => {
          const dbTimeline = (ap.timeline as Array<Record<string, unknown>> || []).map((t) => ({
            year: (t.year as string) || "",
            title: (t.title as string) || "",
            text: (t.text as string) || "",
            image: getAboutTimelineImage(
              (t.year as string) || "",
              resolveMediaUrl(t.image) || "",
            ),
          }));
          return dbTimeline.length > 0 ? dbTimeline : DEFAULT_SETTINGS.aboutPage.timeline;
        })(),
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
          mapQ: (b.mapQ as string) || "",
          mapEmbedUrl: (b.mapEmbedUrl as string) || "",
        }));
      }
      return DEFAULT_SETTINGS.branches;
    })(),
  };
}

export async function loadArrayDataViaSQL(
  data: SiteSettingsData,
): Promise<SiteSettingsData> {
  try {
    const pool = getPool();
    const ss = await pool.query(`SELECT id, slider_paused, bestseller_products FROM site_settings LIMIT 1`);
    const ssId = ss.rows[0]?.id;
    const ssSliderPaused = Boolean(ss.rows[0]?.slider_paused);
    const ssBestsellerSlugs = parseBestsellerSlugs(ss.rows[0]?.bestseller_products);
    if (!ssId) return data;

    const heroRes = await pool.query(
      `SELECT h.heading, h.description, h.cta_text, h.cta_href, h.is_pinned, 
              m.url as image_url, m.cloudinary_public_id as cloudinary_public_id
       FROM site_settings_hero_slides h LEFT JOIN media m ON h.image_id = m.id
       WHERE h._parent_id = $1 ORDER BY h._order`, [ssId]);
    const circleBannerRes = await pool.query(
      `SELECT b.title, b.description, b.alt, 
              m.url as image_url, m.cloudinary_public_id as cloudinary_public_id
       FROM site_settings_blocks_circle_banner b LEFT JOIN media m ON b.image_id = m.id
       WHERE b._parent_id = $1 ORDER BY b._order`, [ssId]);
    const imageBannerRes = await pool.query(
      `SELECT b.alt, b.title, b.cta_text, b.href, 
              m.url as image_url, m.cloudinary_public_id as cloudinary_public_id
       FROM site_settings_blocks_image_banner b LEFT JOIN media m ON b.image_id = m.id
       WHERE b._parent_id = $1 ORDER BY b._order`, [ssId]);
    const heritageRes = await pool.query(
      `SELECT h.heading, h.description, 
              m.url as image_url, m.cloudinary_public_id as cloudinary_public_id
       FROM site_settings_heritage h LEFT JOIN media m ON h.image_id = m.id
       WHERE h._parent_id = $1 ORDER BY h._order`, [ssId]);
    const reviewsRes = await pool.query(
      `SELECT text, author, location FROM reviews
       ORDER BY created_at ASC`);
    const catsRes = await pool.query(
      `SELECT c.title, c.description, c.cta_text, c.cta_href, c.variant, 
              m.url as image_url, m.cloudinary_public_id as cloudinary_public_id
       FROM site_settings_categories c LEFT JOIN media m ON c.image_id = m.id
       WHERE c._parent_id = $1 ORDER BY _order`, [ssId]);
    const branchesRes = await pool.query(
      `SELECT name, address, phone, phone_full, map_q, map_embed_url
       FROM site_settings_branches WHERE _parent_id = $1 ORDER BY _order`, [ssId]);
    const bestsellersRes = ssBestsellerSlugs.length
      ? await pool.query(
          `SELECT p.id, p.title, p.slug, p.metal, c.name AS category_name,
                  m.url AS image_url, m.cloudinary_public_id AS cloudinary_public_id
           FROM products p
           LEFT JOIN categories c ON p.category_id = c.id
           LEFT JOIN media m ON p.image_id = m.id
           WHERE p.slug = ANY($1::text[])`, [ssBestsellerSlugs])
      : { rows: [] as any[] };

    return {
      ...data,
      heroSlides: heroRes.rows.map((r: any) => ({
        heading: r.heading || "",
        description: r.description || "",
        ctaText: r.cta_text || "",
        ctaHref: r.cta_href || "",
        image: r.cloudinary_public_id ? cloudinaryUrl(r.cloudinary_public_id) : normalizeMigratedMediaUrl(r.image_url),
        isPinned: Boolean(r.is_pinned),
      })),
      heroSliderPaused: ssSliderPaused,
      features: circleBannerRes.rows.map((r: any) => ({
        blockType: "circleBanner" as const,
        title: r.title || "",
        description: r.description || "",
        image: r.cloudinary_public_id ? cloudinaryUrl(r.cloudinary_public_id) : normalizeMigratedMediaUrl(r.image_url),
        alt: r.alt || "",
      })),
      banners: imageBannerRes.rows.map((r: any) => ({
        blockType: "imageBanner" as const,
        image: r.cloudinary_public_id ? cloudinaryUrl(r.cloudinary_public_id) : normalizeMigratedMediaUrl(r.image_url),
        alt: r.alt || "",
        title: r.title || "",
        ctaText: r.cta_text || "",
        href: r.href || "",
      })),
      heritage: heritageRes.rows.map((r: any) => ({
        heading: r.heading || "",
        description: r.description || "",
        image: r.cloudinary_public_id ? cloudinaryUrl(r.cloudinary_public_id) : normalizeMigratedMediaUrl(r.image_url),
      })),
      reviews: reviewsRes.rows.map((r: any) => ({
        text: r.text || "",
        author: r.author || "",
        location: r.location || "",
      })),
      categories: catsRes.rows.map((r: any) => ({
        title: r.title || "",
        description: r.description || "",
        ctaText: r.cta_text || "",
        ctaHref: r.cta_href || "",
        variant: r.variant || "",
        image: r.cloudinary_public_id ? cloudinaryUrl(r.cloudinary_public_id) : normalizeMigratedMediaUrl(r.image_url),
      })),
      branches: branchesRes.rows.length > 0 ? branchesRes.rows.map((r: any) => ({
        name: r.name || "",
        address: r.address || "",
        phone: r.phone || "",
        phoneFull: r.phone_full || "",
        mapQ: r.map_q || "",
        mapEmbedUrl: r.map_embed_url || "",
      })) : data.branches,
      bestsellerProducts: (() => {
        const bySlug = new Map<string, any>(
          bestsellersRes.rows.map((r: any) => [r.slug, r]),
        );
        return ssBestsellerSlugs
          .map((slug: string) => bySlug.get(slug))
          .filter(Boolean)
          .map((r: any) => ({
            id: String(r.id || ""),
            name: r.title || "",
            slug: r.slug || "",
            image: r.cloudinary_public_id
              ? cloudinaryUrl(r.cloudinary_public_id)
              : normalizeMigratedMediaUrl(r.image_url) || "",
            metal: r.metal || "",
            category: r.category_name || "",
          }));
      })(),
    };
  } catch {
    return data;
  }
}

export async function loadArrayDataForEditor(): Promise<Record<string, unknown>> {
  try {
    const pool = getPool();
    const ss = await pool.query(`SELECT id, slider_paused, bestseller_products FROM site_settings LIMIT 1`);
    const ssId = ss.rows[0]?.id;
    if (!ssId) return {};

    const heroRes = await pool.query(
      `SELECT h.heading, h.description, h.cta_text, h.cta_href, h.is_pinned, h.image_id
       FROM site_settings_hero_slides h
       WHERE h._parent_id = $1 ORDER BY h._order`, [ssId]);
    const circleBannerRes = await pool.query(
      `SELECT b.title, b.description, b.alt, b.image_id
       FROM site_settings_blocks_circle_banner b
       WHERE b._parent_id = $1 ORDER BY b._order`, [ssId]);
    const imageBannerRes = await pool.query(
      `SELECT b.alt, b.title, b.cta_text, b.href, b.image_id
       FROM site_settings_blocks_image_banner b
       WHERE b._parent_id = $1 ORDER BY b._order`, [ssId]);
    const heritageRes = await pool.query(
      `SELECT h.heading, h.description, h.image_id
       FROM site_settings_heritage h
       WHERE h._parent_id = $1 ORDER BY h._order`, [ssId]);
    const catsRes = await pool.query(
      `SELECT c.title, c.description, c.cta_text, c.cta_href, c.variant, c.image_id
       FROM site_settings_categories c
       WHERE c._parent_id = $1 ORDER BY _order`, [ssId]);
    const timelineRes = await pool.query(
      `SELECT t.year, t.title, t.text, t.image_id
       FROM site_settings_about_page_timeline t
       WHERE t._parent_id = $1 ORDER BY t._order`, [ssId]);
    const paragraphsRes = await pool.query(
      `SELECT p.text
       FROM site_settings_about_page_golden_occasions_paragraphs p
       WHERE p._parent_id = $1 ORDER BY p._order`, [ssId]);
    const bulletsRes = await pool.query(
      `SELECT b.text
       FROM site_settings_about_page_ventures_bullets b
       WHERE b._parent_id = $1 ORDER BY b._order`, [ssId]);
    const benefitsRes = await pool.query(
      `SELECT b.text
       FROM site_settings_thanga_mazhai_benefits b
       WHERE b._parent_id = $1 ORDER BY b._order`, [ssId]);
    const whyChooseRes = await pool.query(
      `SELECT w.text
       FROM site_settings_thanga_mazhai_why_choose w
       WHERE w._parent_id = $1 ORDER BY w._order`, [ssId]);
    const swarnavarshaBulletsRes = await pool.query(
      `SELECT b.text
       FROM site_settings_swarnavarsha_bullets b
       WHERE b._parent_id = $1 ORDER BY b._order`, [ssId]);
    const branchesRes = await pool.query(
      `SELECT name, address, phone, phone_full, email, hours, map_q, map_embed_url
       FROM site_settings_branches
       WHERE _parent_id = $1 ORDER BY _order`, [ssId]);

    return {
      heroSliderPaused: Boolean(ss.rows[0]?.slider_paused),
      bestsellerProducts: ss.rows[0]?.bestseller_products || "",
      heroSlides: heroRes.rows.map((r: any) => ({
        heading: r.heading || "",
        description: r.description || "",
        ctaText: r.cta_text || "",
        ctaHref: r.cta_href || "",
        image: r.image_id != null ? String(r.image_id) : "",
        isPinned: Boolean(r.is_pinned),
      })),
      features: circleBannerRes.rows.map((r: any) => ({
        blockType: "circleBanner",
        title: r.title || "",
        description: r.description || "",
        image: r.image_id != null ? String(r.image_id) : "",
        alt: r.alt || "",
      })),
      banners: imageBannerRes.rows.map((r: any) => ({
        blockType: "imageBanner",
        title: r.title || "",
        image: r.image_id != null ? String(r.image_id) : "",
        alt: r.alt || "",
        ctaText: r.cta_text || "",
        href: r.href || "",
      })),
      heritage: heritageRes.rows.map((r: any) => ({
        heading: r.heading || "",
        description: r.description || "",
        image: r.image_id != null ? String(r.image_id) : "",
      })),
      categories: catsRes.rows.map((r: any) => ({
        title: r.title || "",
        description: r.description || "",
        ctaText: r.cta_text || "",
        ctaHref: r.cta_href || "",
        variant: r.variant || "",
        image: r.image_id != null ? String(r.image_id) : "",
      })),
      branches: branchesRes.rows.map((r: any) => ({
        name: r.name || "",
        address: r.address || "",
        phone: r.phone || "",
        phoneFull: r.phone_full || "",
        email: r.email || "",
        hours: r.hours || "",
        mapQ: r.map_q || "",
        mapEmbedUrl: r.map_embed_url || "",
      })),
      aboutPage: {
        goldenOccasions: {
          paragraphs: paragraphsRes.rows.map((r: any) => ({ text: r.text || "" })),
        },
        timeline: timelineRes.rows.map((r: any) => ({
          year: r.year || "",
          title: r.title || "",
          text: r.text || "",
          image: r.image_id != null ? String(r.image_id) : "",
        })),
        ventures: {
          bullets: bulletsRes.rows.map((r: any) => ({ text: r.text || "" })),
        },
      },
      thangaMazhai: {
        benefits: benefitsRes.rows.map((r: any) => ({ text: r.text || "" })),
        whyChoose: whyChooseRes.rows.map((r: any) => ({ text: r.text || "" })),
      },
      swarnavarsha: {
        bullets: swarnavarshaBulletsRes.rows.map((r: any) => ({ text: r.text || "" })),
      },
    };
  } catch {
    return {};
  }
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    return await cached("site-settings", async () => {
      const payload = await getPayload({ config });
      if (isPostgres()) {
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

      // findGlobal depth:0 returns upload fields as raw media IDs. Resolve the
      // product-page hero images (gold/silver/diamond/platinum) to URLs so the
      // frontend can render them instead of a broken `url(<id>)`.
      const heroes = raw.productsPage as
        | {
            goldHero?: { image?: unknown };
            silverHero?: { image?: unknown };
            diamondHero?: { image?: unknown };
            platinumHero?: { image?: unknown };
          }
        | undefined;
      const heroList = heroes
        ? [heroes.goldHero, heroes.silverHero, heroes.diamondHero, heroes.platinumHero]
        : [];
      const heroImgIds = heroList
        .map((h) => h?.image)
        .filter((id): id is number => typeof id === "number");
      if (heroImgIds.length > 0) {
        const mediaRes = await payload.find({
          collection: "media" as never,
          where: { id: { in: heroImgIds } },
          depth: 0,
          limit: 100,
        });
        const mediaUrlById = new Map<number, string>();
        for (const doc of mediaRes.docs as Array<Record<string, unknown>>) {
          mediaUrlById.set(Number(doc.id), resolveMediaUrl(doc));
        }
        for (const hero of heroList) {
          if (hero && typeof hero.image === "number") {
            hero.image = mediaUrlById.get(hero.image) || "";
          }
        }
      }

      // Resolve scalar upload IDs that depth:0 leaves as numbers (aboutPage, blogPage, defaultSeo)
      const scalarIds: number[] = [];
      const pushId = (v: unknown) => {
        if (typeof v === "number") scalarIds.push(v);
      };
      const rawAp = (raw as any)?.aboutPage;
      pushId(rawAp?.goldenOccasions?.image);
      pushId(rawAp?.ventures?.image);
      pushId((raw as any)?.blogPage?.promoImage);
      pushId((raw as any)?.defaultSeo?.ogImage);
      // also collect timeline images if present (depth 0 returns numbers)
      if (Array.isArray(rawAp?.timeline)) {
        for (const t of rawAp.timeline) pushId((t as any)?.image);
      }
      let scalarUrlById: Map<number, string> | null = null;
      if (scalarIds.length > 0) {
        const uniq = [...new Set(scalarIds)];
        const mRes = await payload.find({
          collection: "media" as never,
          where: { id: { in: uniq } },
          depth: 0,
          limit: 100,
        });
        scalarUrlById = new Map<number, string>();
        for (const doc of mRes.docs as Array<Record<string, unknown>>) {
          scalarUrlById.set(Number(doc.id), resolveMediaUrl(doc));
        }
        const resolveScalar = (v: unknown): string => {
          if (typeof v === "number") return scalarUrlById!.get(v) || "";
          return resolveMediaUrl(v);
        };
        // Patch raw in place so downstream result builder picks resolved URLs
        if (rawAp?.goldenOccasions && typeof rawAp.goldenOccasions.image === "number") {
          rawAp.goldenOccasions.image = resolveScalar(rawAp.goldenOccasions.image);
        }
        if (rawAp?.ventures && typeof rawAp.ventures.image === "number") {
          rawAp.ventures.image = resolveScalar(rawAp.ventures.image);
        }
        if ((raw as any)?.blogPage && typeof (raw as any).blogPage.promoImage === "number") {
          (raw as any).blogPage.promoImage = resolveScalar((raw as any).blogPage.promoImage);
        }
        if ((raw as any)?.defaultSeo && typeof (raw as any).defaultSeo.ogImage === "number") {
          (raw as any).defaultSeo.ogImage = resolveScalar((raw as any).defaultSeo.ogImage);
        }
        if (Array.isArray(rawAp?.timeline)) {
          for (const t of rawAp.timeline as any[]) {
            if (typeof t.image === "number") t.image = resolveScalar(t.image);
          }
        }
      }

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
            timeline: (() => {
              const dbTimeline = (ap.timeline || []).map((t: PayloadDoc) => ({
                year: t.year || "",
                title: t.title || "",
                text: t.text || "",
                image: getAboutTimelineImage(
                  t.year || "",
                  resolveMediaUrl(t.image) || "",
                ),
              }));
              return dbTimeline.length > 0 ? dbTimeline : DEFAULT_SETTINGS.aboutPage.timeline;
            })(),
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
    });
  } catch {
    return DEFAULT_SETTINGS;
  }
}

