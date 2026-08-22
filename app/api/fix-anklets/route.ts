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
    const changes: string[] = [];

    for (const product of ankletProducts) {
      let catId: number | null = null;
      const raw = product.category;
      if (typeof raw === "number") catId = raw;
      else if (typeof raw === "object" && raw !== null && "id" in raw) catId = (raw as any).id as number;

      if (!catId) continue;
      if (catId === 10) {
        changes.push(`${product.title} (${product.id}): already anklets-silver`);
        continue;
      }

      await payload.update({
        collection: "products",
        id: product.id as number,
        data: { category: 10 },
        context: { skipSlugLock: true },
      });
      changes.push(`${product.title} (${product.id}): ${catId} -> 10`);
      fixed++;
    }

    return NextResponse.json({ fixed, changes, total: ankletProducts.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
