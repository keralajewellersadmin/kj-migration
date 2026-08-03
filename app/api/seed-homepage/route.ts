import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";

const CLOUDINARY_BASE = "https://res.cloudinary.com/htl6k8cd/image/upload";

const IMAGES_TO_SEED = [
  { url: `${CLOUDINARY_BASE}/v1785763761/kerala-jewellers/gallery/hero-slide-1-celebrate.webp`, alt: "Celebrate Every Precious Moment", folder: "hero" },
  { url: `${CLOUDINARY_BASE}/v1785763776/kerala-jewellers/gallery/hero-slide-2-ethnic.webp`, alt: "Ethnic Excellence", folder: "hero" },
  { url: `${CLOUDINARY_BASE}/v1785763778/kerala-jewellers/gallery/hero-slide-3-gold.webp`, alt: "Gleaming Gold", folder: "hero" },
  { url: `${CLOUDINARY_BASE}/v1785763779/kerala-jewellers/gallery/hero-slide-4-bride.webp`, alt: "What A Bride Wants", folder: "hero" },
  { url: `${CLOUDINARY_BASE}/v1785683307/kerala-jewellers/banners/66aa08b203540b7e28f7bcb3_Frame%202085664975.webp`, alt: "Wedding wear, diamond jewellery", folder: "features" },
  { url: `${CLOUDINARY_BASE}/v1785683268/kerala-jewellers/gallery/66a9cf95a2a871357e4fef00_2147587092%201.png`, alt: "Artmanship jewellery from Kerala Jewellers", folder: "features" },
  { url: `${CLOUDINARY_BASE}/v1785683278/kerala-jewellers/gallery/66a9cf9526da64e4c3831b8a_144443%201.png`, alt: "Heritage collections of Kerala Jewellers", folder: "features" },
  { url: `${CLOUDINARY_BASE}/v1785683317/kerala-jewellers/banners/66ae22bea9cab6312ffdd45d_Rectangle%20367%20%287%29.png`, alt: "Diamond ring handcrafted daily wear jewels", folder: "banners" },
  { url: `${CLOUDINARY_BASE}/v1785683322/kerala-jewellers/banners/66aa067372c8bb1c084deda0_Rectangle%20340.png`, alt: "Diamond Ring", folder: "banners" },
  { url: `${CLOUDINARY_BASE}/v1785683327/kerala-jewellers/banners/66ae22bef52614a0871d61a2_Rectangle%20367%20%288%29.png`, alt: "Daily wear diamond jewellery from Kerala Jewellers Porur", folder: "banners" },
  { url: `${CLOUDINARY_BASE}/v1785683312/kerala-jewellers/banners/66aa0d1f3e89efeb11397196_Rectangle%20343.webp`, alt: "Heritage designs, Kerala Jewellers Porur", folder: "heritage" },
];

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==",
  "base64",
);

function extractPublicId(cloudinaryUrl: string): string {
  const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+?)$/);
  if (!match) return "";
  let id = match[1];
  const dotIdx = id.lastIndexOf(".");
  if (dotIdx > 0) id = id.substring(0, dotIdx);
  return id;
}

async function createMediaWithUrl(
  payload: Awaited<ReturnType<typeof getPayload>>,
  url: string,
  alt: string,
): Promise<number | string> {
  const record = await payload.create({
    collection: "media",
    overrideAccess: true,
    data: { alt, mediaType: "other" } as never,
    file: {
      data: TINY_PNG,
      name: `seed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.png`,
      mimetype: "image/png",
      size: TINY_PNG.length,
    },
  });

  const publicId = extractPublicId(url);
  await payload.update({
    collection: "media",
    id: record.id,
    overrideAccess: true,
    data: {
      url,
      cloudinaryPublicId: publicId,
    } as never,
  });

  return record.id as number | string;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const validSecret =
      process.env.PAYLOAD_SECRET?.trim() || process.env.SEED_SECRET?.trim();
    if (!secret || secret.trim() !== validSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const payload = await getPayload({ config });
  const log: string[] = [];

  try {
    log.push("Creating media records (placeholder + Cloudinary URL update)...");
    const mediaIds: (number | string)[] = [];
    for (let i = 0; i < IMAGES_TO_SEED.length; i++) {
      const img = IMAGES_TO_SEED[i];
      try {
        const id = await createMediaWithUrl(payload, img.url, img.alt);
        mediaIds.push(id);
        log.push(`  [${i + 1}/${IMAGES_TO_SEED.length}] ${img.alt} → media id=${id}`);
      } catch (err) {
        log.push(`  [${i + 1}/${IMAGES_TO_SEED.length}] FAILED: ${String(err)}`);
        mediaIds.push(0);
      }
    }

    const [h1, h2, h3, h4, f1, f2, f3, b1, b2, b3, hv] = mediaIds;

    log.push("Updating site-settings global...");
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
          { blockType: "circleBanner" as const, title: "Weddings", description: "Find the wedding jewellery you've always dreamed of.", image: f1, alt: "Wedding wear, diamond jewellery" },
          { blockType: "circleBanner" as const, title: "Authenticity", description: "Choose from a wide range of certified and authentic jewellery for all occasions.", image: f2, alt: "Artmanship jewellery from Kerala Jewellers" },
          { blockType: "circleBanner" as const, title: "Heritage", description: "Step back in time and bring a slice of the bejewelled past to the present.", image: f3, alt: "Heritage collections of Kerala Jewellers" },
        ],
        banners: [
          { blockType: "imageBanner" as const, image: b1, alt: "Diamond ring handcrafted daily wear jewels", title: "", ctaText: "", href: "" },
          { blockType: "imageBanner" as const, image: b2, alt: "Diamond Ring", title: "", ctaText: "", href: "" },
          { blockType: "imageBanner" as const, image: b3, alt: "Daily wear diamond jewellery from Kerala Jewellers Porur", title: "", ctaText: "", href: "" },
        ],
        heritage: [
          { heading: "Intricate & Intimate", description: "Beautiful heritage-worthy designs have elevated our jewellery.\nExplore a range of personalised selections for different occasions.\nThe right piece can enrich your look and give people something to\nadmire and appreciate.", image: hv, srcSet: "" },
        ],
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

    log.push("DONE — site-settings updated.");
    return NextResponse.json({ message: "Homepage seed complete", mediaIds, log });
  } catch (err) {
    log.push(`FATAL: ${String(err)}`);
    return NextResponse.json({ error: String(err), log }, { status: 500 });
  }
}
