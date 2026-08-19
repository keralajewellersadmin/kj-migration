import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

const REAL_REVIEWS = [
  {
    text: "When we started shopping for my wedding jewelry, Kerala Jewellers made my dream come true. Kerala Jewellers not only had the most exquisite collection but also made the entire experience so special. From helping us choose the perfect bridal set to making sure every detail was perfect, they truly became a part of our big day. Thank you for making my wedding sparkle!",
    author: "Shruthi",
    location: "Kodambakkam",
  },
  {
    text: "For my daughter's first birthday, we wanted something meaningful-something she could treasure forever. Kerala Jewellers helped us find the perfect little gold necklace with a locket, and their warmth and service made the moment even more special. Now, every time I see her wear it, I know we made the right choice!",
    author: "Pavithra",
    location: "Porur",
  },
  {
    text: "Jewelry isn't just about gold and diamonds, it's about memories. We have been shopping at Kerala Jewellers for years-every festival, wedding, and special occasion is incomplete without their beautifully crafted pieces. Their service, quality, and warmth keep us coming back every time. It's not just a store; it's a part of our celebrations!",
    author: "Sivanya",
    location: "Pondybazar",
  },
  {
    text: "For our anniversary, I wanted to give my wife something to surprise her. Kerala Jewellers helped me pick the most stunning necklace-one that she absolutely fell in love with. The way their team guided me, understanding my emotions behind the gift, made the experience even more meaningful. Every time she wears it, she smiles a little brighter, and that makes it all worth it.",
    author: "Srikanth",
    location: "Valasaravakkam",
  },
];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { secret } = body as { secret?: string };

    if (secret && secret !== process.env.PAYLOAD_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await getPayload({ config });

    // Update the site-settings global with the real reviews
    const result = await payload.updateGlobal({
      slug: "site-settings",
      data: {
        reviews: REAL_REVIEWS,
      } as any,
    });

    return NextResponse.json({
      message: `Seeded ${REAL_REVIEWS.length} real reviews to site-settings`,
      count: REAL_REVIEWS.length,
    });
  } catch (err) {
    console.error("[Seed Reviews] Error:", err);
    return NextResponse.json(
      { error: "Failed to seed reviews", details: String(err) },
      { status: 500 },
    );
  }
}
