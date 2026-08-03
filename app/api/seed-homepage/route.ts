import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import { Client } from "pg";

const CLOUDINARY_BASE = "https://res.cloudinary.com/htl6k8cd/image/upload";

const HERO_SLIDES = [
  { heading: "Celebrate\nEvery Precious Moment", description: "Find jewellery that complements every occasion.\nExplore our exclusive collections in-store & online.", ctaText: "EXPLORE", ctaHref: "/products", imageUrl: `${CLOUDINARY_BASE}/v1785763761/kerala-jewellers/gallery/hero-slide-1-celebrate.webp` },
  { heading: "Ethnic Excellence", description: "Wrap yourself in a timeless aura with our heritage designs.", ctaText: "EXPLORE", ctaHref: "/products", imageUrl: `${CLOUDINARY_BASE}/v1785763776/kerala-jewellers/gallery/hero-slide-2-ethnic.webp` },
  { heading: "Gleaming Gold", description: "Accessorize in authentic gold featuring assorted embellishments.", ctaText: "EXPLORE", ctaHref: "/products", imageUrl: `${CLOUDINARY_BASE}/v1785763778/kerala-jewellers/gallery/hero-slide-3-gold.webp` },
  { heading: "What A Bride Wants", description: "Bridal jewellery that honors tradition, yet feels undeniably yours.", ctaText: "EXPLORE", ctaHref: "/products", imageUrl: `${CLOUDINARY_BASE}/v1785763779/kerala-jewellers/gallery/hero-slide-4-bride.webp` },
];

const FEATURES = [
  { title: "Weddings", description: "Find the wedding jewellery you've always dreamed of.", imageUrl: `${CLOUDINARY_BASE}/v1785683307/kerala-jewellers/banners/66aa08b203540b7e28f7bcb3_Frame%202085664975.webp`, alt: "Wedding wear, diamond jewellery" },
  { title: "Authenticity", description: "Choose from a wide range of certified and authentic jewellery for all occasions.", imageUrl: `${CLOUDINARY_BASE}/v1785683268/kerala-jewellers/gallery/66a9cf95a2a871357e4fef00_2147587092%201.png`, alt: "Artmanship jewellery from Kerala Jewellers" },
  { title: "Heritage", description: "Step back in time and bring a slice of the bejewelled past to the present.", imageUrl: `${CLOUDINARY_BASE}/v1785683278/kerala-jewellers/gallery/66a9cf9526da64e4c3831b8a_144443%201.png`, alt: "Heritage collections of Kerala Jewellers" },
];

const BANNERS = [
  { imageUrl: `${CLOUDINARY_BASE}/v1785683317/kerala-jewellers/banners/66ae22bea9cab6312ffdd45d_Rectangle%20367%20%287%29.png`, alt: "Diamond ring handcrafted daily wear jewels" },
  { imageUrl: `${CLOUDINARY_BASE}/v1785683322/kerala-jewellers/banners/66aa067372c8bb1c084deda0_Rectangle%20340.png`, alt: "Diamond Ring" },
  { imageUrl: `${CLOUDINARY_BASE}/v1785683327/kerala-jewellers/banners/66ae22bef52614a0871d61a2_Rectangle%20367%20%288%29.png`, alt: "Daily wear diamond jewellery from Kerala Jewellers Porur" },
];

const TINY_PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==", "base64");

function extractPublicId(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)$/);
  if (!match) return "";
  let id = match[1];
  const dot = id.lastIndexOf(".");
  if (dot > 0) id = id.substring(0, dot);
  return id;
}

async function createMediaViaSQL(client: Client, alt: string, url: string): Promise<number> {
  const now = new Date().toISOString();
  const result = await client.query(
    `INSERT INTO media (alt, "mediaType", url, "cloudinaryPublicId", filename, filesize, width, height, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
    [alt, "other", url, extractPublicId(url), "seed.png", TINY_PNG.length, 1, 1, now, now],
  );
  return result.rows[0].id as number;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const validSecret = process.env.PAYLOAD_SECRET?.trim() || process.env.SEED_SECRET?.trim();
    if (!secret || secret.trim() !== validSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const log: string[] = [];

  try {
    const payload = await getPayload({ config });

    const dbUri = process.env.DATABASE_URI;
    if (!dbUri) throw new Error("DATABASE_URI not set");

    const client = new Client({ connectionString: dbUri, ssl: { rejectUnauthorized: false } });
    await client.connect();
    log.push("Connected to Neon database.");

    try {
      // 1. Create media records via raw SQL
      log.push("Creating media records via SQL...");
      const allImages = [
        ...HERO_SLIDES.map((s) => ({ alt: s.heading.replace("\n", " "), url: s.imageUrl })),
        ...FEATURES.map((f) => ({ alt: f.alt, url: f.imageUrl })),
        ...BANNERS.map((b) => ({ alt: b.alt, url: b.imageUrl })),
        { alt: "Heritage designs, Kerala Jewellers Porur", url: `${CLOUDINARY_BASE}/v1785683312/kerala-jewellers/banners/66aa0d1f3e89efeb11397196_Rectangle%20343.webp` },
      ];

      const mediaIds: number[] = [];
      for (let i = 0; i < allImages.length; i++) {
        const img = allImages[i];
        try {
          const id = await createMediaViaSQL(client, img.alt, img.url);
          mediaIds.push(id);
          log.push(`  [${i + 1}/${allImages.length}] ${img.alt.substring(0, 40)} → id=${id}`);
        } catch (err) {
          log.push(`  [${i + 1}/${allImages.length}] FAILED: ${String(err).substring(0, 100)}`);
          mediaIds.push(0);
        }
      }

      const [h1, h2, h3, h4, f1, f2, f3, b1, b2, b3, hv] = mediaIds;

      // 2. Update site-settings via Payload API (for proper global structure)
      log.push("Updating site-settings global via Payload...");
      await payload.updateGlobal({
        slug: "site-settings",
        overrideAccess: true,
        data: {
          heroSlides: [
            { heading: "Celebrate\nEvery Precious Moment", description: "Find jewellery that complements every occasion.\nExplore our exclusive collections in-store & online.", ctaText: "EXPLORE", ctaHref: "/products", image: h1 },
            { heading: "Ethnic Excellence", description: "Wrap yourself in a timeless aura with our heritage designs.", ctaText: "EXPLORE", ctaHref: "/products", image: h2 },
            { heading: "Gleaming Gold", description: "Accessorize in authentic gold featuring assorted embellishments.", ctaText: "EXPLORE", ctaHref: "/products", image: h3 },
            { heading: "What A Bride Wants", description: "Bridal jewellery that honors tradition, yet feels undeniably yours.", ctaText: "EXPLORE", ctaHref: "/products", image: h4 },
          ],
          features: [
            { blockType: "circleBanner" as const, title: "Weddings", description: "Find the wedding jewellery you've always dreamed of.", image: f1, alt: FEATURES[0].alt },
            { blockType: "circleBanner" as const, title: "Authenticity", description: FEATURES[1].description, image: f2, alt: FEATURES[1].alt },
            { blockType: "circleBanner" as const, title: "Heritage", description: FEATURES[2].description, image: f3, alt: FEATURES[2].alt },
          ],
          banners: [
            { blockType: "imageBanner" as const, image: b1, alt: BANNERS[0].alt, title: "", ctaText: "", href: "" },
            { blockType: "imageBanner" as const, image: b2, alt: BANNERS[1].alt, title: "", ctaText: "", href: "" },
            { blockType: "imageBanner" as const, image: b3, alt: BANNERS[2].alt, title: "", ctaText: "", href: "" },
          ],
          heritage: [{ heading: "Intricate & Intimate", description: "Beautiful heritage-worthy designs have elevated our jewellery.\nExplore a range of personalised selections for different occasions.\nThe right piece can enrich your look and give people something to\nadmire and appreciate.", image: hv, srcSet: "" }],
          reviews: [
            { text: "When we started shopping for my wedding jewelry, Kerala Jewellers made my dream come true. They truly became a part of our big day. Thank you for making my wedding sparkle!", author: "Shruthi", location: "Kodambakkam" },
            { text: "For my daughter's first birthday, we wanted something meaningful. Kerala Jewellers helped us find the perfect little gold necklace, and their warmth and service made the moment even more special.", author: "Pavithra", location: "Porur" },
            { text: "Jewelry isn't just about gold and diamonds, it's about memories. We have been shopping at Kerala Jewellers for years — every festival, wedding, and special occasion is incomplete without their beautifully crafted pieces.", author: "Sivanya", location: "Pondybazar" },
            { text: "For our anniversary, I wanted to give my wife something special. Kerala Jewellers helped me pick the most stunning necklace. Every time she wears it, she smiles a little brighter.", author: "Srikanth", location: "Valasaravakkam" },
          ],
          categories: [
            { title: "Golden Allure", description: "Browse our vast collection of exquisite gold necklaces and get ready to dazzle.", ctaText: "View Collection", ctaHref: "/products", variant: "gold" },
            { title: "Signature Silver", description: "Explore our signature silver jewellery and step into your own beautiful light.", ctaText: "View Collection", ctaHref: "/products/silver", variant: "silver" },
            { title: "Artistic Diamonds", description: "A diamond ring is more than a piece of jewellery, it's a statement. Make your statement today.", ctaText: "View Collection", ctaHref: "/products/diamond", variant: "diamond" },
            { title: "Platinum Perfection", description: "Dive into a wide range of trendy platinum jewellery and stand out from the crowd.", ctaText: "Coming Soon", ctaHref: "#", variant: "platinum" },
          ],
        } as never,
      });

      log.push("DONE — all homepage sections seeded in CMS.");
      return NextResponse.json({ message: "Homepage seed complete", mediaIds, log });
    } finally {
      await client.end();
    }
  } catch (err) {
    log.push(`FATAL: ${String(err)}`);
    return NextResponse.json({ error: String(err), log }, { status: 500 });
  }
}
