import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST() {
  try {
    const payload = await getPayload({ config });

    const { docs: ankletProducts } = await payload.find({
      collection: "products",
      where: {
        and: [
          { metal: { equals: "silver" } },
          { title: { like: "anklet" } },
        ],
      },
      limit: 100,
    });

    let fixed = 0;
    for (const product of ankletProducts) {
      const catId = typeof product.category === "number" ? product.category : null;
      if (!catId) continue;
      if (catId === 10) continue; // already anklets-silver

      await payload.update({
        collection: "products",
        id: product.id as number,
        data: { category: 10 },
        context: { skipSlugLock: true },
      });
      fixed++;
    }

    return NextResponse.json({ fixed, total: ankletProducts.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
