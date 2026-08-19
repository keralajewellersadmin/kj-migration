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

    // Check if reviews collection already has data
    const existing = await payload.find({ collection: "reviews" as never, limit: 1 });
    if (existing.totalDocs > 0) {
      return NextResponse.json({
        message: "Reviews collection already has data, skipping migration",
        count: existing.totalDocs,
      });
    }

    // Read reviews from site_settings global
    const settings = await payload.findGlobal({ slug: "site-settings" });
    const oldReviews = (settings as unknown as Record<string, unknown>)?.reviews as Array<Record<string, unknown>> | undefined;

    if (!oldReviews || oldReviews.length === 0) {
      return NextResponse.json({
        message: "No reviews found in site-settings to migrate",
        count: 0,
      });
    }

    // Insert each review into the new collection
    let migrated = 0;
    for (const review of oldReviews) {
      await payload.create({
        collection: "reviews" as never,
        data: {
          text: (review.text as string) || "",
          author: (review.author as string) || "",
          location: (review.location as string) || "",
        } as never,
      });
      migrated++;
    }

    return NextResponse.json({
      message: `Migrated ${migrated} reviews from site-settings to reviews collection`,
      count: migrated,
    });
  } catch (err) {
    console.error("[Migrate Reviews] Error:", err);
    return NextResponse.json(
      { error: "Failed to migrate reviews", details: String(err) },
      { status: 500 },
    );
  }
}
