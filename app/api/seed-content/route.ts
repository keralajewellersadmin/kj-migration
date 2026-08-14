import { NextResponse } from "next/server";
import { getCachedPayload } from "@/lib/payload-singleton";
import { termsSections, privacySections, swarnavarshaSections, thangaMazhaiSections } from "@/lib/data/legal";

export async function GET() {
  return seed();
}

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.SEED_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return seed();
}

async function seed() {
 try {
  const payload = await getCachedPayload();
  const results: Record<string, unknown> = {};

  // ─── Legal Pages ───
  const legalPages = [
    { title: "Terms & Conditions", sections: termsSections },
    { title: "Privacy Policy", sections: privacySections },
    { title: "Swarnavarsha", sections: swarnavarshaSections },
    { title: "Thanga Mazhai", sections: thangaMazhaiSections },
  ];

  const legalResults = [];
  for (const lp of legalPages) {
    const existing = await payload.find({
      collection: "legal-pages" as never,
      where: { title: { equals: lp.title } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.totalDocs > 0) {
      legalResults.push({ title: lp.title, status: "exists", id: existing.docs[0].id });
      continue;
    }
    const doc = await payload.create({
      collection: "legal-pages" as never,
      overrideAccess: true,
      data: {
        title: lp.title,
        sections: lp.sections.map((s) => ({
          title: s.title,
          blocks: s.blocks.map((b) => {
            if (b.type === "ul") {
              return { type: "ul" as const, items: b.items.map((item) => ({ item })) };
            }
            return { type: "p" as const, text: b.text };
          }),
        })),
      },
    });
    legalResults.push({ title: lp.title, status: "created", id: doc.id });
  }
  results.legalPages = legalResults;

  // ─── Metal Rates ───
  const metalRates = [
    { metal: "gold22" as const, rate: "7,450", unit: "gram" },
    { metal: "gold18" as const, rate: "6,080", unit: "gram" },
    { metal: "silver" as const, rate: "92", unit: "gram" },
    { metal: "platinum" as const, rate: "3,890", unit: "gram" },
  ];

  const rateResults = [];
  for (const mr of metalRates) {
    const existing = await payload.find({
      collection: "metal-rates" as never,
      where: { metal: { equals: mr.metal } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.totalDocs > 0) {
      rateResults.push({ metal: mr.metal, status: "exists", id: existing.docs[0].id });
      continue;
    }
    const doc = await payload.create({
      collection: "metal-rates" as never,
      overrideAccess: true,
      data: {
        metal: mr.metal,
        rate: mr.rate,
        unit: mr.unit,
        effectiveDate: new Date().toISOString(),
        active: true,
      },
    });
    rateResults.push({ metal: mr.metal, status: "created", id: doc.id });
  }
  results.metalRates = rateResults;

  // ─── Blog Posts ───
  const blogPosts = [
    {
      title: "The Art of Choosing the Perfect Gold Necklace",
      excerpt: "Discover the timeless elegance of gold necklaces and learn how to select the perfect piece for any occasion.",
      date: "August 10, 2026",
      body: [
        { type: "h2" as const, text: "A Legacy of Craftsmanship" },
        { type: "p" as const, text: "At Kerala Jewellers, every gold necklace is a masterpiece crafted by skilled artisans who have honed their craft over generations. Our collection spans traditional Kerala designs to contemporary styles, each piece telling a story of heritage and artistry." },
        { type: "h2" as const, text: "Choosing the Right Gold Purity" },
        { type: "p" as const, text: "Gold jewellery comes in various purities — 22K for a rich, traditional look and 18K for a more durable, everyday wear option. understanding the difference helps you make the right choice for your lifestyle and preferences." },
        { type: "h2" as const, text: "Tips for Selecting Your Necklace" },
        { type: "ul" as const, items: [
          "Consider the occasion — elaborate designs for weddings, minimal for daily wear",
          "Match with your existing jewellery collection",
          "Check the hallmark certification for purity assurance",
          "Consider the weight and comfort for extended wear",
        ]},
      ],
    },
    {
      title: "Diamond Grading: What You Need to Know Before Buying",
      excerpt: "A complete guide to understanding the 4Cs of diamond grading — Cut, Colour, Clarity, and Carat.",
      date: "August 5, 2026",
      body: [
        { type: "h2" as const, text: "Understanding the 4Cs" },
        { type: "p" as const, text: "When purchasing diamond jewellery, understanding the 4Cs is essential. At Kerala Jewellers, we believe in educating our customers so they can make informed decisions about their precious purchases." },
        { type: "h2" as const, text: "Cut, Colour, Clarity, and Carat" },
        { type: "p" as const, text: "The Cut determines a diamond's brilliance — how well it reflects light. Colour grades range from D (colourless) to Z. Clarity measures the presence of internal or external characteristics. Carat refers to the diamond's weight." },
        { type: "h2" as const, text: "Our Promise" },
        { type: "p" as const, text: "Every diamond at Kerala Jewellers is certified by leading gemological laboratories, ensuring you receive exactly what you pay for. Our experts are always available to help you understand the details." },
      ],
    },
    {
      title: "Traditional Kerala Jewellery: A Guide to Bridal Collections",
      excerpt: "Explore the rich tradition of Kerala bridal jewellery, from temple designs to modern interpretations.",
      date: "July 28, 2026",
      body: [
        { type: "h2" as const, text: "The Heritage of Kerala Bridal Jewellery" },
        { type: "p" as const, text: "Kerala's bridal jewellery tradition is renowned for its intricate gold work and temple-inspired designs. Each piece carries centuries of cultural significance, making it an integral part of the wedding celebration." },
        { type: "h2" as const, text: "Essential Bridal Pieces" },
        { type: "ul" as const, items: [
          "Mangalsutra — the sacred necklace symbolising marital union",
          "Gold necklace sets — layered designs for a grand bridal look",
          "Jhumka earrings — traditional bell-shaped earrings",
          "Gold bangles and bracelets — completing the bridal ensemble",
          "Waist belt (Oddiyanam) — a traditional gold belt worn over the saree",
        ]},
        { type: "h2" as const, text: "Visit Our Showroom" },
        { type: "p" as const, text: "Our bridal collection experts at Pondy Bazaar, Purasaiwakkam, and Porur showrooms are ready to help you find the perfect pieces for your special day. Book an appointment for a personalised consultation." },
      ],
    },
  ];

  const blogResults = [];
  for (const bp of blogPosts) {
    const existing = await payload.find({
      collection: "blog-posts" as never,
      where: { title: { equals: bp.title } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.totalDocs > 0) {
      blogResults.push({ title: bp.title, status: "exists", id: existing.docs[0].id });
      continue;
    }
    const doc = await payload.create({
      collection: "blog-posts" as never,
      overrideAccess: true,
      data: {
        title: bp.title,
        excerpt: bp.excerpt,
        date: bp.date,
        body: bp.body.map((b) => {
          if (b.type === "ul") {
            return { type: "ul" as const, items: b.items.map((item) => ({ item })) };
          }
          return { type: b.type, text: b.text };
        }),
      },
    });
    blogResults.push({ title: bp.title, status: "created", id: doc.id });
  }
  results.blogPosts = blogResults;

  return NextResponse.json({ success: true, results });
 } catch (e) {
  const err = e instanceof Error ? e : new Error(String(e));
  console.error("SEED ERROR:", err);
  return NextResponse.json({ success: false, error: err.message || String(err), stack: err.stack?.slice(0, 800) }, { status: 500 });
 }
}
