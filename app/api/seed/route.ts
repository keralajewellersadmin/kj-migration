import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";

import { products, blogPosts } from "@/lib/data/products";
import {
  termsSections,
  privacySections,
  swarnavarshaSections,
} from "@/lib/data/legal";
import { normalizeCategory } from "@/lib/data/utils";
import type { BlogBlock } from "@/lib/data/types";
import { IMG } from "@/lib/image-urls";

export const maxDuration = 60;

const METAL_CATEGORIES: Record<string, { name: string }[]> = {
  gold: [
    { name: "Bangles" },
    { name: "Bracelets" },
    { name: "Pendant" },
    { name: "Necklace" },
    { name: "Rings" },
    { name: "Earrings" },
  ],
  silver: [
    { name: "Bracelets" },
    { name: "Necklace" },
    { name: "Idols" },
    { name: "Anklets" },
  ],
  diamond: [{ name: "Necklace" }, { name: "Rings" }],
};

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    if (secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json(
        { error: "Not available in production" },
        { status: 404 },
      );
    }
  }

  const payload = await getPayload({ config });
  const { searchParams } = new URL(request.url);
  const step = searchParams.get("step") || "all";
  const secret = searchParams.get("secret") || "";

  if (step === "all") {
    const existing = await payload.find({ collection: "products", limit: 1 });
    if (existing.totalDocs > 0) {
      return NextResponse.json({
        message: `Already seeded (${existing.totalDocs} products exist)`,
        skipped: true,
      });
    }
  }

  if (step === "categories" || step === "all") {
    const existingCats = await payload.find({
      collection: "categories",
      limit: 1,
    });
    if (existingCats.totalDocs === 0) {
      for (const [metal, cats] of Object.entries(METAL_CATEGORIES)) {
        for (let i = 0; i < cats.length; i++) {
          const cat = cats[i];
          await payload.create({
            collection: "categories",
            data: {
              metal: metal as "gold" | "silver" | "diamond",
              name: cat.name,
              slug: `${cat.name.toLowerCase()}-${metal}`,
              displayOrder: i,
            },
          });
        }
      }
    }
    if (step === "categories") {
      const catCount = await payload.find({
        collection: "categories",
        limit: 0,
      });
      return NextResponse.json({
        message: "Categories seeded",
        count: catCount.totalDocs,
      });
    }
  }

  if (step === "products" || step === "all") {
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const batchSize = 25;
    const batch = products.slice(offset, offset + batchSize);

    for (const p of batch) {
      const normalized = normalizeCategory(p.category, p.metal).toLowerCase();
      const catSlug = `${normalized}_${p.metal}`;
      const catDocs = await payload.find({
        collection: "categories",
        where: { slug: { equals: catSlug } },
        limit: 1,
      });
      const catId = catDocs.docs[0]?.id || null;
      await payload.create({
        collection: "products",
        data: {
          title: p.name,
          slug: p.slug,
          code: p.code,
          metal: p.metal,
          category: catId,
          weight: p.weight,
          purity: p.purity,
          description: p.description,
          imageSrcset: p.imageSrcset,
          availability: true,
        },
      });
    }
    const totalProducts = await payload.find({
      collection: "products",
      limit: 0,
    });
    const remaining = products.length - offset - batchSize;
    if (step === "products") {
      return NextResponse.json({
        message: `Products batch ${offset}–${offset + batch.length} seeded`,
        total: totalProducts.totalDocs,
        remaining: remaining > 0 ? remaining : 0,
        next:
          remaining > 0
            ? `/api/seed?step=products&offset=${offset + batchSize}&secret=${secret}`
            : null,
      });
    }
  }

  if (step === "settings" || step === "all") {
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        rateGold22: "7,450",
        rateGold18: "6,080",
        rateSilver: "92",
        ratePlatinum: "3,890",
        rateUpdated: "27-06-2026",
        bestsellerProducts: "bombay-fancy,turkey-bracelet,bengali-choker-3",
        heroSlides: [
          {
            heading: "Celebrate\nEvery Precious Moment",
            description:
              "Find jewellery that complements every occasion.\nExplore our exclusive collections in-store & online.",
            ctaText: "EXPLORE",
            ctaHref: "/products",
            image: null,
          },
          {
            heading: "Ethnic Excellence",
            description:
              "Wrap yourself in a timeless aura with our heritage designs.",
            ctaText: "EXPLORE",
            ctaHref: "/products",
            image: null,
          },
          {
            heading: "Gleaming Gold",
            description:
              "Accessorize in authentic gold featuring assorted embellishments.",
            ctaText: "EXPLORE",
            ctaHref: "/products",
            image: null,
          },
          {
            heading: "What A Bride Wants",
            description:
              "Bridal jewellery that honors tradition, yet feels undeniably yours.",
            ctaText: "EXPLORE",
            ctaHref: "/products",
            image: null,
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
            text: "Jewelry isn't just about gold and diamonds, it's about memories. We have been shopping at Kerala Jewellers for years\u2014every festival, wedding, and special occasion is incomplete without their beautifully crafted pieces.",
            author: "Sivanya",
            location: "Pondybazar",
          },
          {
            text: "For our anniversary, I wanted to give my wife something special. Kerala Jewellers helped me pick the most stunning necklace. Every time she wears it, she smiles a little brighter.",
            author: "Srikanth",
            location: "Valasaravakkam",
          },
        ],
        ...({
          banners: [
            {
              blockType: "imageBanner",
              image: null,
              alt: "Diamond ring handcrafted daily wear jewels",
              ctaText: "Explore Collection",
              href: "/products/diamond",
              title: "",
            },
            {
              blockType: "imageBanner",
              image: null,
              alt: "Diamond Ring",
              ctaText: "View Collection",
              href: "/products/diamond",
              title: "Diamond Ring",
            },
            {
              blockType: "imageBanner",
              image: null,
              alt: "Daily wear diamond jewellery from Kerala Jewellers Porur",
              ctaText: "Discover More",
              href: "/products/diamond",
              title: "",
            },
          ],
          features: [
            {
              blockType: "circleBanner",
              title: "Weddings",
              description:
                "Find the wedding jewellery you've always dreamed of.",
              image: null,
              alt: "Wedding wear, diamond jewellery",
            },
            {
              blockType: "circleBanner",
              title: "Authenticity",
              description:
                "Choose from a wide range of certified and authentic jewellery for all occasions.",
              image: null,
              alt: "Artmanship jewellery from Kerala Jewellers",
            },
            {
              blockType: "circleBanner",
              title: "Heritage",
              description:
                "Step back in time and bring a slice of the bejewelled past to the present.",
              image: null,
              alt: "Heritage collections of Kerala Jewellers",
            },
          ],
        } as Record<string, unknown>),
        heritage: [
          {
            heading: "Intricate & Intimate",
            description:
              "Beautiful heritage-worthy designs have elevated our jewellery.\nExplore a range of personalised selections for different occasions.\nThe right piece can enrich your look and give people something to\nadmire and appreciate.",
            image: null,
            srcSet: "",
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
        branches: [
          {
            name: "Pondy Bazaar",
            address: "34, Pondy Bazaar, T.Nagar, Chennai-600017.",
            phone: "98400 88324",
            phoneFull: "9840088324",
            email: "",
            hours: "Mon\u2013Sat: 10 AM \u2013 8 PM",
            mapQ: "Kerala+Jewellers+Pondy+Bazaar+Chennai",
            mapEmbedUrl: "",
          },
          {
            name: "Purasawalkam",
            address:
              "G-5, Palace Regency, 80/93, Purasawalkam High Rd, Chennai-600010.",
            phone: "93810 11742",
            phoneFull: "9381011742",
            email: "",
            hours: "Mon\u2013Sat: 10 AM \u2013 8 PM",
            mapQ: "Kerala+Jewellers+Purasawalkam+Chennai",
            mapEmbedUrl: "",
          },
          {
            name: "Porur",
            address: "23, Mount Poonamallee High Road, Porur, Chennai-600116.",
            phone: "74488 42244",
            phoneFull: "7448842244",
            email: "",
            hours: "Mon\u2013Sat: 10 AM \u2013 8 PM",
            mapQ: "Kerala+Jewellers+Porur+Chennai",
            mapEmbedUrl: "",
          },
        ],
        ...({
          aboutPage: {
            goldenOccasions: {
              heading: "Golden Occasions & Gleaming Beginnings",
              paragraphs: [
                {
                  text: "For over five decades, since 1959, Kerala Jewellers has established a gold standard in customer commitment, product purity, and design perfection.",
                },
                {
                  text: "From ethnic and heritage selections to relatively modern pieces, we pride ourselves on providing a range of fashionable options \u2013 gold, diamond, rubies, emeralds, silver, platinum, and more.",
                },
              ],
              image: null,
              alt: "About Kerala Jewellers",
            },
            tasteMeetsTradition: {
              heading: "Taste Meets Tradition",
              text: "By choosing authentic craftsmanship and signature style, our brand has defined the way people see luxury and jewellery. Personally, we've always wanted to create a jewellery range that caters to each customer's nuanced needs so they can wear them with pride to special occasions and important milestones, including birthdays and weddings.",
            },
            origins: {
              heading: "The Origins",
              intro:
                "A glimpse into the history of Kerala Jewellers. Kerala Jewellers is a living tradition, continually evolving while staying true to its roots. Each piece is a narrative of the past, a celebration of the present, and a legacy for the future.",
            },
            timeline: [
              {
                year: "1933",
                title: "The Beginning",
                text: "In 1933, Mr. P.C. Varghese, a visionary entrepreneur with a deep appreciation for fine jewellery, founded Kerala Jewellers in Ponkunnam, Kottayam district, Kerala. Mrs. Annamma Varghese was a visionary designer whose work significantly impacted the world of gold jewellery. Her designs brought a fresh perspective to traditional jewellery and she was the inspiration to start this gold business.",
                image: IMG.timeline1933,
              },
              {
                year: "1958",
                title: "The Next Generation",
                text: "Mr. Jose Cheeramvelil's vision was the same as Mr. P.C. Varghese's. His son, Mr. Jose Cheeramvelil, took over the reins of Kerala Jewellers.",
                image: IMG.timeline1958,
              },
              {
                year: "1959",
                title: "Relocation to T Nagar",
                text: "Relocation to Ranganathan Street, T Nagar. Recognizing the evolving market and the need for a more prominent presence, Kerala Jewellers was moved to Ranganathan Street, T Nagar, Chennai's bustling main shopping area. The move to T Nagar was a blessing for the people of Chennai. Kerala Jewellers became a highly sought-after destination for those seeking high-quality gold jewellery. The store gained a reputation for offering lightweight designs, which were elegant while retaining the essence of traditional South Indian styles.",
                image: IMG.timeline1959,
              },
              {
                year: "1972",
                title: "A New Era with George Joseph",
                text: "The addition of Mr. George Joseph, also known as Wilson, to Kerala Jewellers marked the beginning of a new chapter in the family's illustrious business. Bringing with him a fresh perspective and a deep commitment to continuing the family's tradition of excellence, Mr. Wilson played a pivotal role in furthering the brand's reputation and reach.",
                image: IMG.timeline1972,
              },
              {
                year: "1988",
                title: "New Showroom on Ranganathan Street",
                text: "Recognizing the need to innovate and expand, Mr. George Joseph launched his unique showroom on the bustling Ranganathan Street in T Nagar. This area, known as the heart of Chennai's shopping district.",
                image: IMG.timeline1988,
              },
              {
                year: "1992",
                title: "Second Store Opening",
                text: "On April 13, 1992, Mr. George Joseph inaugurated the second Kerala Jewellers store in Pondy Bazaar. This new location was strategically chosen for its high foot traffic and reputation as a bustling commercial hub in Chennai.",
                image: IMG.timeline1992,
              },
              {
                year: "2001",
                title: "The Inception of Aishwarya Mahal",
                text: "Aishwarya Mahal was conceived with the idea of providing a luxurious and spacious venue for weddings, exhibitions, and other grand events. Recognizing the growing demand for premium event spaces in Chennai, Mr. George Joseph decided to expand his business portfolio by entering the hospitality sector.",
                image: IMG.timeline2001,
              },
              {
                year: "2002",
                title: "Expansion to Purasaiwalkam",
                text: "In 2002, Kerala Jewellers embarked on a new venture with the opening of a store in Purasaiwalkam, a bustling area in Chennai. This expansion was overseen and managed by Mr. Siby Joseph, the son-in-law of Mr. George Joseph (Wilson), marking a significant milestone in the family business.",
                image: IMG.timeline2002,
              },
              {
                year: "2008",
                title: "The Porur Branch",
                text: "On December 3, 2008, Kerala Jewellers expanded its reach further with the opening of a new branch in Porur, Chennai. This new store was managed by Mr. Roopesh George, the son of Mr. George Joseph (Wilson), marking another significant milestone in the family business.",
                image: IMG.timeline2008,
              },
              {
                year: "2015",
                title: "Launch of Pebbles",
                text: 'On February 15, 2015, Mr. George Joseph (Wilson) expanded his entrepreneurial portfolio into the hospitality sector with the launch of "Pebbles," a service apartment. This new venture marked a significant addition to his diverse business interests.',
                image: IMG.timeline2015,
              },
              {
                year: "2022",
                title: "Pondy Bazaar Renovation",
                text: "The Pondy Bazaar showroom of Kerala Jewellers underwent a significant renovation to transform it into a boutique store, reflecting a fresh and modern approach. With a wide range of collections in Gold, Silver, and Diamonds, we always make sure the purity of gold is our priority and customer service and satisfaction is key.",
                image: IMG.timeline2015,
              },
            ],
            ventures: {
              heading: "Our Ventures",
              subheading: "Our Dedicated Wedding Hall",
              image: IMG.aishwaryaMahal,
              alt: "Aishwarya Mahal \u2014 Kerala Jewellers Wedding Hall",
              bullets: [
                {
                  text: "Kerala Jewellery Group is a well-diversified business with branches in hospitality, wedding/banquet venues, and real estate ventures.",
                },
                {
                  text: "We have our own dedicated wedding venue \u2013 Aishwarya Marriage Hall. Fully air-conditioned space. Landmark: Chennai MMDA Metro Station at Koyambedu.",
                },
                {
                  text: "Enjoy picture-perfect weddings at our fully-equipped wedding hall.",
                },
              ],
              cta1Text: "Know More About Us",
              cta1Href: "https://www.ayswariyamahal.com/",
              cta2Text: "Find Us",
              cta2Href: "https://maps.app.goo.gl/vP759GxjSJLK4oU88",
            },
          },
        } as Record<string, unknown>),
      } as never,
    });
    if (step === "settings") {
      return NextResponse.json({ message: "Settings seeded" });
    }
  }

  if (step === "blog" || step === "all") {
    for (const post of blogPosts) {
      const existingPost = await payload.find({
        collection: "blog-posts",
        where: { slug: { equals: post.slug } },
        limit: 1,
      });
      if (existingPost.totalDocs === 0) {
        const body = post.body?.map((block: BlogBlock) => {
          if (block.type === "ul") {
            return {
              type: "ul" as const,
              items: block.items.map((item: string) => ({ item })),
            };
          }
          return { type: block.type as "h2" | "p", text: block.text || "" };
        });
        await payload.create({
          collection: "blog-posts",
          data: {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            date: post.date || "",
            body: body || [],
          },
        });
      }
    }
    if (step === "blog") {
      return NextResponse.json({ message: "Blog posts seeded" });
    }
  }

  if (step === "legal" || step === "all") {
    const legalPages = [
      {
        title: "Terms & Conditions",
        slug: "terms-conditions",
        sections: termsSections,
      },
      {
        title: "Privacy Policy",
        slug: "privacy-policy",
        sections: privacySections,
      },
      {
        title: "Swarnavarsha Scheme",
        slug: "swarnavarsha",
        sections: swarnavarshaSections,
      },
    ];
    for (const page of legalPages) {
      const existingPage = await payload.find({
        collection: "legal-pages",
        where: { slug: { equals: page.slug } },
        limit: 1,
      });
      if (existingPage.totalDocs === 0) {
        await payload.create({
          collection: "legal-pages",
          data: {
            title: page.title,
            slug: page.slug,
            sections: page.sections.map((s) => ({
              title: s.title,
              blocks: s.blocks.map((b) => {
                if (b.type === "ul") {
                  return {
                    type: "ul" as const,
                    items: b.items.map((item) => ({ item })),
                  };
                }
                return { type: "p" as const, text: b.text };
              }),
            })),
          },
        });
      }
    }
    if (step === "legal") {
      return NextResponse.json({ message: "Legal pages seeded" });
    }
  }

  const results = {
    products: (await payload.find({ collection: "products", limit: 0 }))
      .totalDocs,
    categories: (await payload.find({ collection: "categories", limit: 0 }))
      .totalDocs,
    blogPosts: (await payload.find({ collection: "blog-posts", limit: 0 }))
      .totalDocs,
    legalPages: (await payload.find({ collection: "legal-pages", limit: 0 }))
      .totalDocs,
  };

  return NextResponse.json({ message: "Seed complete", results });
}
