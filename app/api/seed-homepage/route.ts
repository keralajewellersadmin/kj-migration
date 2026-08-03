import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";

const HERO_IMAGES = [
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785763761/kerala-jewellers/gallery/hero-slide-1-celebrate.webp",
    alt: "Celebrate Every Precious Moment",
  },
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785763776/kerala-jewellers/gallery/hero-slide-2-ethnic.webp",
    alt: "Ethnic Excellence",
  },
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785763778/kerala-jewellers/gallery/hero-slide-3-gold.webp",
    alt: "Gleaming Gold",
  },
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785763779/kerala-jewellers/gallery/hero-slide-4-bride.webp",
    alt: "What A Bride Wants",
  },
];

const HERO_SLIDES_DATA = [
  {
    heading: "Celebrate\nEvery Precious Moment",
    description:
      "Find jewellery that complements every occasion.\nExplore our exclusive collections in-store & online.",
    ctaText: "EXPLORE",
    ctaHref: "/products",
  },
  {
    heading: "Ethnic Excellence",
    description: "Wrap yourself in a timeless aura with our heritage designs.",
    ctaText: "EXPLORE",
    ctaHref: "/products",
  },
  {
    heading: "Gleaming Gold",
    description:
      "Accessorize in authentic gold featuring assorted embellishments.",
    ctaText: "EXPLORE",
    ctaHref: "/products",
  },
  {
    heading: "What A Bride Wants",
    description:
      "Bridal jewellery that honors tradition, yet feels undeniably yours.",
    ctaText: "EXPLORE",
    ctaHref: "/products",
  },
];

const FEATURE_IMAGES = [
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683307/kerala-jewellers/banners/66aa08b203540b7e28f7bcb3_Frame%202085664975.webp",
    alt: "Wedding wear, diamond jewellery",
  },
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683268/kerala-jewellers/gallery/66a9cf95a2a871357e4fef00_2147587092%201.png",
    alt: "Artmanship jewellery from Kerala Jewellers",
  },
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683278/kerala-jewellers/gallery/66a9cf9526da64e4c3831b8a_144443%201.png",
    alt: "Heritage collections of Kerala Jewellers",
  },
];

const LATEST_BANNER_IMAGES = [
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683317/kerala-jewellers/banners/66ae22bea9cab6312ffdd45d_Rectangle%20367%20%287%29.png",
    alt: "Diamond ring handcrafted daily wear jewels",
  },
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683322/kerala-jewellers/banners/66aa067372c8bb1c084deda0_Rectangle%20340.png",
    alt: "Diamond Ring",
  },
  {
    url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683327/kerala-jewellers/banners/66ae22bef52614a0871d61a2_Rectangle%20367%20%288%29.png",
    alt: "Daily wear diamond jewellery from Kerala Jewellers Porur",
  },
];

const HERITAGE_IMAGE = {
  url: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683312/kerala-jewellers/banners/66aa0d1f3e89efeb11397196_Rectangle%20343.webp",
  alt: "Heritage designs, Kerala Jewellers Porur",
};

async function downloadImage(url: string): Promise<{
  data: Buffer;
  name: string;
  mimetype: string;
}> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const ext = url.split(".").pop()?.split("?")[0] || "webp";
  const mimetype = ext === "png" ? "image/png" : "image/webp";
  const name = `seed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const arrayBuffer = await res.arrayBuffer();
  return { data: Buffer.from(arrayBuffer), name, mimetype };
}

async function createMediaFromUrl(
  payload: Awaited<ReturnType<typeof getPayload>>,
  url: string,
  alt: string,
) {
  const { data, name, mimetype } = await downloadImage(url);
  const record = await payload.create({
    collection: "media",
    overrideAccess: true,
    data: {
      alt,
      mediaType: "other",
    } as never,
    file: {
      data,
      name,
      mimetype,
      size: data.length,
    },
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
    // 1. Create media records for hero slides
    log.push("Creating hero slide media records...");
    const heroMediaIds: (number | string)[] = [];
    for (let i = 0; i < HERO_IMAGES.length; i++) {
      const img = HERO_IMAGES[i];
      const id = await createMediaFromUrl(payload, img.url, img.alt);
      heroMediaIds.push(id);
      log.push(`  Hero slide ${i + 1}: media id=${id}`);
    }

    // 2. Create media records for features
    log.push("Creating feature media records...");
    const featureMediaIds: (number | string)[] = [];
    for (let i = 0; i < FEATURE_IMAGES.length; i++) {
      const img = FEATURE_IMAGES[i];
      const id = await createMediaFromUrl(payload, img.url, img.alt);
      featureMediaIds.push(id);
      log.push(`  Feature ${i + 1}: media id=${id}`);
    }

    // 3. Create media records for latest banners
    log.push("Creating latest banner media records...");
    const bannerMediaIds: (number | string)[] = [];
    for (let i = 0; i < LATEST_BANNER_IMAGES.length; i++) {
      const img = LATEST_BANNER_IMAGES[i];
      const id = await createMediaFromUrl(payload, img.url, img.alt);
      bannerMediaIds.push(id);
      log.push(`  Banner ${i + 1}: media id=${id}`);
    }

    // 4. Create media record for heritage
    log.push("Creating heritage media record...");
    const heritageMediaId = await createMediaFromUrl(
      payload,
      HERITAGE_IMAGE.url,
      HERITAGE_IMAGE.alt,
    );
    log.push(`  Heritage: media id=${heritageMediaId}`);

    // 5. Update site-settings global with all homepage data
    log.push("Updating site-settings global...");
    const siteSettings = await payload.updateGlobal({
      slug: "site-settings",
      overrideAccess: true,
      data: {
        heroSlides: HERO_SLIDES_DATA.map((slide, i) => ({
          ...slide,
          image: heroMediaIds[i],
        })),
        features: [
          {
            blockType: "circleBanner" as const,
            title: "Weddings",
            description:
              "Find the wedding jewellery you've always dreamed of.",
            image: featureMediaIds[0],
            alt: FEATURE_IMAGES[0].alt,
          },
          {
            blockType: "circleBanner" as const,
            title: "Authenticity",
            description:
              "Choose from a wide range of certified and authentic jewellery for all occasions.",
            image: featureMediaIds[1],
            alt: FEATURE_IMAGES[1].alt,
          },
          {
            blockType: "circleBanner" as const,
            title: "Heritage",
            description:
              "Step back in time and bring a slice of the bejewelled past to the present.",
            image: featureMediaIds[2],
            alt: FEATURE_IMAGES[2].alt,
          },
        ],
        banners: LATEST_BANNER_IMAGES.map((img, i) => ({
          blockType: "imageBanner" as const,
          image: bannerMediaIds[i],
          alt: img.alt,
          title: "",
          ctaText: "",
          href: "",
        })),
        heritage: [
          {
            heading: "Intricate & Intimate",
            description:
              "Beautiful heritage-worthy designs have elevated our jewellery.\nExplore a range of personalised selections for different occasions.\nThe right piece can enrich your look and give people something to\nadmire and appreciate.",
            image: heritageMediaId,
            srcSet: "",
          },
        ],
        reviews: [
          {
            text: "When we started shopping for my wedding jewelry, Kerala Jewellers made my dream come true. They truly became a part of our big day. Thank you for making my wedding sparkle!",
            author: "Shruthi",
            location: "Kodambakkam",
          },
          {
            text: "For my daughter's first birthday, we wanted something meaningful. Kerala Jewellers helped us find the perfect little gold necklace, and their warmth and service made the moment even more special.",
            author: "Pavithra",
            location: "Porur",
          },
          {
            text: "Jewelry isn't just about gold and diamonds, it's about memories. We have been shopping at Kerala Jewellers for years — every festival, wedding, and special occasion is incomplete without their beautifully crafted pieces.",
            author: "Sivanya",
            location: "Pondybazar",
          },
          {
            text: "For our anniversary, I wanted to give my wife something special. Kerala Jewellers helped me pick the most stunning necklace. Every time she wears it, she smiles a little brighter.",
            author: "Srikanth",
            location: "Valasaravakkam",
          },
        ],
        categories: [
          {
            title: "Golden Allure",
            description:
              "Browse our vast collection of exquisite gold necklaces and get ready to dazzle.",
            ctaText: "View Collection",
            ctaHref: "/products",
            variant: "gold",
          },
          {
            title: "Signature Silver",
            description:
              "Explore our signature silver jewellery and step into your own beautiful light.",
            ctaText: "View Collection",
            ctaHref: "/products/silver",
            variant: "silver",
          },
          {
            title: "Artistic Diamonds",
            description:
              "A diamond ring is more than a piece of jewellery, it's a statement. Make your statement today.",
            ctaText: "View Collection",
            ctaHref: "/products/diamond",
            variant: "diamond",
          },
          {
            title: "Platinum Perfection",
            description:
              "Dive into a wide range of trendy platinum jewellery and stand out from the crowd.",
            ctaText: "Coming Soon",
            ctaHref: "#",
            variant: "platinum",
          },
        ],
      } as never,
    });

    log.push(`Site-settings updated successfully.`);
    return NextResponse.json({
      message: "Homepage seed complete",
      heroSlideIds: heroMediaIds,
      featureIds: featureMediaIds,
      bannerIds: bannerMediaIds,
      heritageId: heritageMediaId,
      log,
    });
  } catch (err) {
    log.push(`ERROR: ${String(err)}`);
    return NextResponse.json(
      { error: String(err), log },
      { status: 500 },
    );
  }
}
