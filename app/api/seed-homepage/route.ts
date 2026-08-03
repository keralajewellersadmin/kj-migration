import { NextResponse } from "next/server";
import { Client } from "pg";
import { randomUUID } from "crypto";

export async function GET() {
  const dbVars = Object.keys(process.env)
    .filter((k) => k.toLowerCase().includes("database") || k.toLowerCase().includes("postgres") || k.toLowerCase().includes("db_"))
    .sort();
  return NextResponse.json({ dbVars, NODE_ENV: process.env.NODE_ENV });
}

const CLOUDINARY_BASE = "https://res.cloudinary.com/htl6k8cd/image/upload";

const IMAGES = [
  `${CLOUDINARY_BASE}/v1785763761/kerala-jewellers/gallery/hero-slide-1-celebrate.webp`,
  `${CLOUDINARY_BASE}/v1785763776/kerala-jewellers/gallery/hero-slide-2-ethnic.webp`,
  `${CLOUDINARY_BASE}/v1785763778/kerala-jewellers/gallery/hero-slide-3-gold.webp`,
  `${CLOUDINARY_BASE}/v1785763779/kerala-jewellers/gallery/hero-slide-4-bride.webp`,
  `${CLOUDINARY_BASE}/v1785683307/kerala-jewellers/banners/66aa08b203540b7e28f7bcb3_Frame%202085664975.webp`,
  `${CLOUDINARY_BASE}/v1785683268/kerala-jewellers/gallery/66a9cf95a2a871357e4fef00_2147587092%201.png`,
  `${CLOUDINARY_BASE}/v1785683278/kerala-jewellers/gallery/66a9cf9526da64e4c3831b8a_144443%201.png`,
  `${CLOUDINARY_BASE}/v1785683317/kerala-jewellers/banners/66ae22bea9cab6312ffdd45d_Rectangle%20367%20%287%29.png`,
  `${CLOUDINARY_BASE}/v1785683322/kerala-jewellers/banners/66aa067372c8bb1c084deda0_Rectangle%20340.png`,
  `${CLOUDINARY_BASE}/v1785683327/kerala-jewellers/banners/66ae22bef52614a0871d61a2_Rectangle%20367%20%288%29.png`,
  `${CLOUDINARY_BASE}/v1785683312/kerala-jewellers/banners/66aa0d1f3e89efeb11397196_Rectangle%20343.webp`,
];

function uid(): string {
  return randomUUID();
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const validSecret = process.env.PAYLOAD_SECRET?.trim();
    if (!secret || secret.trim() !== validSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const log: string[] = [];

  try {
    const dbUri = process.env.DATABASE_URL || process.env.DATABASE_URI;
    if (!dbUri) {
      log.push("Available DB env vars: " + Object.keys(process.env).filter(k => k.toLowerCase().includes("database") || k.toLowerCase().includes("db_")).join(", "));
      throw new Error("DATABASE_URL not set");
    }

    const client = new Client({ connectionString: dbUri, ssl: { rejectUnauthorized: false } });
    await client.connect();
    log.push("Connected to DB.");

    try {
      // 1. Ensure site_settings row exists
      let ssResult = await client.query(`SELECT id FROM site_settings LIMIT 1`);
      let ssId: number;
      if (ssResult.rows.length === 0) {
        const now = new Date().toISOString();
        const insertResult = await client.query(
          `INSERT INTO site_settings (updated_at, created_at) VALUES ($1, $2) RETURNING id`,
          [now, now],
        );
        ssId = insertResult.rows[0].id as number;
        log.push(`Created site_settings row: id=${ssId}`);
      } else {
        ssId = ssResult.rows[0].id as number;
        log.push(`Found site_settings row: id=${ssId}`);
      }

      // 2. Get existing media URLs for idempotency
      const existingMedia = await client.query(`SELECT id, url FROM media`);
      const urlToId = new Map<string, number>();
      for (const row of existingMedia.rows) {
        urlToId.set(row.url, row.id);
      }
      log.push(`Found ${existingMedia.rows.length} existing media records total.`);

      // 3. Insert media records (skip existing)
      const mediaIds: number[] = [];
      const now = new Date().toISOString();
      for (let i = 0; i < IMAGES.length; i++) {
        const url = IMAGES[i];
        const existingId = urlToId.get(url);
        if (existingId) {
          mediaIds.push(existingId);
          log.push(`  Media ${i + 1}: EXISTS (id=${existingId})`);
          continue;
        }
        const alt = `Seed image ${i + 1}`;
        try {
          const result = await client.query(
            `INSERT INTO media (alt, url, filename, filesize, width, height, media_type, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
            [alt, url, `seed-${i + 24}.png`, 100, 1, 1, "image", now, now],
          );
          const id = result.rows[0].id as number;
          mediaIds.push(id);
          log.push(`  Media ${i + 1}: CREATED (id=${id})`);
        } catch (err) {
          log.push(`  Media ${i + 1} FAILED: ${String(err).substring(0, 200)}`);
          mediaIds.push(0);
        }
      }

      // 4. Clear existing homepage data
      await client.query(`DELETE FROM site_settings_hero_slides WHERE _parent_id = $1`, [ssId]);
      await client.query(`DELETE FROM site_settings_blocks_circle_banner WHERE _parent_id = $1`, [ssId]);
      await client.query(`DELETE FROM site_settings_blocks_image_banner WHERE _parent_id = $1`, [ssId]);
      await client.query(`DELETE FROM site_settings_blocks_text_banner WHERE _parent_id = $1`, [ssId]);
      await client.query(`DELETE FROM site_settings_blocks_rectangle_banner WHERE _parent_id = $1`, [ssId]);
      await client.query(`DELETE FROM site_settings_heritage WHERE _parent_id = $1`, [ssId]);
      await client.query(`DELETE FROM site_settings_reviews WHERE _parent_id = $1`, [ssId]);
      await client.query(`DELETE FROM site_settings_categories WHERE _parent_id = $1`, [ssId]);
      log.push("Cleared existing homepage data.");

      // 5. Insert hero slides
      const heroData = [
        { heading: "Celebrate\nEvery Precious Moment", description: "Find jewellery that complements every occasion.\nExplore our exclusive collections in-store & online.", ctaText: "EXPLORE", ctaHref: "/products", imgIdx: 0 },
        { heading: "Ethnic Excellence", description: "Wrap yourself in a timeless aura with our heritage designs.", ctaText: "EXPLORE", ctaHref: "/products", imgIdx: 1 },
        { heading: "Gleaming Gold", description: "Accessorize in authentic gold featuring assorted embellishments.", ctaText: "EXPLORE", ctaHref: "/products", imgIdx: 2 },
        { heading: "What A Bride Wants", description: "Bridal jewellery that honors tradition, yet feels undeniably yours.", ctaText: "EXPLORE", ctaHref: "/products", imgIdx: 3 },
      ];
      for (let i = 0; i < heroData.length; i++) {
        const h = heroData[i];
        await client.query(
          `INSERT INTO site_settings_hero_slides (id, _order, _parent_id, heading, description, cta_text, cta_href, image_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [uid(), i, ssId, h.heading, h.description, h.ctaText, h.ctaHref, mediaIds[h.imgIdx]],
        );
      }
      log.push(`Inserted ${heroData.length} hero slides.`);

      // 6. Insert features (circleBanner blocks)
      const featureData = [
        { title: "Weddings", description: "Find the wedding jewellery you've always dreamed of.", imgIdx: 4, alt: "Wedding wear, diamond jewellery" },
        { title: "Authenticity", description: "Choose from a wide range of certified and authentic jewellery for all occasions.", imgIdx: 5, alt: "Artmanship jewellery from Kerala Jewellers" },
        { title: "Heritage", description: "Step back in time and bring a slice of the bejewelled past to the present.", imgIdx: 6, alt: "Heritage collections of Kerala Jewellers" },
      ];
      for (let i = 0; i < featureData.length; i++) {
        const f = featureData[i];
        await client.query(
          `INSERT INTO site_settings_blocks_circle_banner (id, _order, _path, _parent_id, title, description, image_id, alt, block_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [uid(), i, `features.${i}`, ssId, f.title, f.description, mediaIds[f.imgIdx], f.alt, "circleBanner"],
        );
      }
      log.push(`Inserted ${featureData.length} features.`);

      // 7. Insert banners (imageBanner blocks)
      const bannerData = [
        { imgIdx: 7, alt: "Diamond ring handcrafted daily wear jewels" },
        { imgIdx: 8, alt: "Diamond Ring" },
        { imgIdx: 9, alt: "Daily wear diamond jewellery from Kerala Jewellers Porur" },
      ];
      for (let i = 0; i < bannerData.length; i++) {
        const b = bannerData[i];
        await client.query(
          `INSERT INTO site_settings_blocks_image_banner (id, _order, _path, _parent_id, image_id, alt, title, cta_text, href, block_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [uid(), i, `banners.${i}`, ssId, mediaIds[b.imgIdx], b.alt, "", "", "", "imageBanner"],
        );
      }
      log.push(`Inserted ${bannerData.length} banners.`);

      // 8. Insert heritage
      await client.query(
        `INSERT INTO site_settings_heritage (id, _order, _parent_id, heading, description, image_id, src_set)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [uid(), 0, ssId, "Intricate & Intimate", "Beautiful heritage-worthy designs have elevated our jewellery.\nExplore a range of personalised selections for different occasions.\nThe right piece can enrich your look and give people something to\nadmire and appreciate.", mediaIds[10], ""],
      );
      log.push("Inserted 1 heritage item.");

      // 9. Insert reviews
      const reviewData = [
        { text: "When we started shopping for my wedding jewelry, Kerala Jewellers made my dream come true. They truly became a part of our big day. Thank you for making my wedding sparkle!", author: "Shruthi", location: "Kodambakkam" },
        { text: "For my daughter's first birthday, we wanted something meaningful. Kerala Jewellers helped us find the perfect little gold necklace, and their warmth and service made the moment even more special.", author: "Pavithra", location: "Porur" },
        { text: "Jewelry isn't just about gold and diamonds, it's about memories. We have been shopping at Kerala Jewellers for years — every festival, wedding, and special occasion is incomplete without their beautifully crafted pieces.", author: "Sivanya", location: "Pondybazar" },
        { text: "For our anniversary, I wanted to give my wife something special. Kerala Jewellers helped me pick the most stunning necklace. Every time she wears it, she smiles a little brighter.", author: "Srikanth", location: "Valasaravakkam" },
      ];
      for (let i = 0; i < reviewData.length; i++) {
        const r = reviewData[i];
        await client.query(
          `INSERT INTO site_settings_reviews (id, _order, _parent_id, text, author, location)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [uid(), i, ssId, r.text, r.author, r.location],
        );
      }
      log.push(`Inserted ${reviewData.length} reviews.`);

      // 10. Insert categories
      const catData = [
        { title: "Golden Allure", description: "Browse our vast collection of exquisite gold necklaces and get ready to dazzle.", ctaText: "View Collection", ctaHref: "/products", variant: "gold" },
        { title: "Signature Silver", description: "Explore our signature silver jewellery and step into your own beautiful light.", ctaText: "View Collection", ctaHref: "/products/silver", variant: "silver" },
        { title: "Artistic Diamonds", description: "A diamond ring is more than a piece of jewellery, it's a statement. Make your statement today.", ctaText: "View Collection", ctaHref: "/products/diamond", variant: "diamond" },
        { title: "Platinum Perfection", description: "Dive into a wide range of trendy platinum jewellery and stand out from the crowd.", ctaText: "Coming Soon", ctaHref: "#", variant: "platinum" },
      ];
      for (let i = 0; i < catData.length; i++) {
        const c = catData[i];
        await client.query(
          `INSERT INTO site_settings_categories (id, _order, _parent_id, title, description, cta_text, cta_href, variant)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [uid(), i, ssId, c.title, c.description, c.ctaText, c.ctaHref, c.variant],
        );
      }
      log.push(`Inserted ${catData.length} categories.`);

      // Verify
      const heroCount = await client.query(`SELECT COUNT(*) as cnt FROM site_settings_hero_slides WHERE _parent_id = $1`, [ssId]);
      const featureCount = await client.query(`SELECT COUNT(*) as cnt FROM site_settings_blocks_circle_banner WHERE _parent_id = $1`, [ssId]);
      const bannerCount = await client.query(`SELECT COUNT(*) as cnt FROM site_settings_blocks_image_banner WHERE _parent_id = $1`, [ssId]);
      const heritageCount = await client.query(`SELECT COUNT(*) as cnt FROM site_settings_heritage WHERE _parent_id = $1`, [ssId]);
      const reviewCount = await client.query(`SELECT COUNT(*) as cnt FROM site_settings_reviews WHERE _parent_id = $1`, [ssId]);
      const catCount = await client.query(`SELECT COUNT(*) as cnt FROM site_settings_categories WHERE _parent_id = $1`, [ssId]);
      log.push(`Verify: hero=${heroCount.rows[0].cnt} features=${featureCount.rows[0].cnt} banners=${bannerCount.rows[0].cnt} heritage=${heritageCount.rows[0].cnt} reviews=${reviewCount.rows[0].cnt} categories=${catCount.rows[0].cnt}`);

      log.push("DONE — all homepage sections seeded via pure SQL.");
      return NextResponse.json({ message: "Homepage seed complete", mediaIds, log });
    } finally {
      await client.end();
    }
  } catch (err) {
    log.push(`FATAL: ${String(err)}`);
    return NextResponse.json({ error: String(err), log }, { status: 500 });
  }
}
