import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { secret } = body as { secret?: string };

    if (secret && secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await getPayload({ config });

    // Try to read the existing globals
    let existing;
    try {
      existing = await payload.findGlobal({ slug: "site-settings" });
    } catch {
      existing = null;
    }

    if (existing && existing.id) {
      return NextResponse.json({
        message: "site-settings global already exists",
        id: existing.id,
      });
    }

    // Create the default site-settings global with empty defaults
    const result = await payload.updateGlobal({
      slug: "site-settings",
      data: {
        heroSlides: [],
        categories: [],
        bestsellerProducts: [],
        features: [],
        banners: [],
        heritage: [],
        homepageSections: {
          bestsellersTitle: "Our Bestsellers",
          bestsellersSubtitle:
            "Choose from among trendy designs and timeless pieces. There's something for everyone and every occasion.",
          latestTitle: "Our Latest",
          latestSubtitle:
            "Check out some of the latest designs in our ever-expanding collection.",
          reviewsTitle: "Customer Reviews",
          reviewsSubtitle:
            "Our Jewelry Isn't Just Worn. It's Cherished. Each Piece Tells A Story, And You Can Hear It From Our Customers Who Wear Theirs With Pride.",
        },
        blogPage: {
          promoHeading: "Wedding Season is here",
          headerTitle: "Our Blog",
        },
        contactPage: {
          heroTitle: "Contact Kerala Jewellers",
          cardTitle: "Get In Touch",
          branchesTitle: "Our Branches",
        },
        productsPage: {
          goldHero: {
            title: "Elegant & Timeless Gold Jewellery",
            subtitle:
              "Discover our exclusive collection of gold jewellery that stands the test of time. Perfect for every occasion.",
          },
          silverHero: {
            title: "Classic Elegance in Silver",
            subtitle:
              "Explore our collection of timeless silver jewellery. Perfectly crafted for every moment.",
          },
          diamondHero: {
            title: "Timeless Brilliance in Diamonds",
            subtitle:
              "Discover our exquisite collection of diamond jewellery, crafted to perfection for every occasion.",
          },
          platinumHero: {
            title: "Exquisite Platinum Jewellery",
            subtitle:
              "Explore our refined collection of platinum jewellery, crafted for those who appreciate understated luxury.",
          },
        },
        branches: [],
      } as Record<string, unknown>,
    });

    return NextResponse.json({
      message: "site-settings global created successfully",
      id: result.id,
    });
  } catch (err) {
    console.error("[Seed Globals] Error:", err);
    return NextResponse.json(
      { error: "Failed to seed globals", details: String(err) },
      { status: 500 },
    );
  }
}
