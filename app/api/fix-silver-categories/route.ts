import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST() {
  try {
    const payload = await getPayload({ config });

    const { docs: silverCats } = await payload.find({
      collection: "categories",
      where: { metal: { equals: "silver" } },
      limit: 100,
    });
    const { docs: goldCats } = await payload.find({
      collection: "categories",
      where: { metal: { equals: "gold" } },
      limit: 100,
    });

    const silverCatByName: Record<string, number> = {};
    for (const cat of silverCats) silverCatByName[cat.name as string] = cat.id as number;
    const goldCatIds = new Set(goldCats.map(c => c.id as number));

    const { docs: silverProducts } = await payload.find({
      collection: "products",
      where: { metal: { equals: "silver" } },
      limit: 100,
    });

    let fixed = 0;
    const changes: string[] = [];

    for (const product of silverProducts) {
      // category can be number (depth 0) or object (depth 1)
      let catId: number | null = null;
      let catName = "";

      const raw = product.category;
      if (typeof raw === "number") {
        catId = raw;
      } else if (typeof raw === "object" && raw !== null && "id" in raw) {
        catId = (raw as any).id as number;
        catName = (raw as any).name as string;
      }

      if (!catId) continue;
      if (!goldCatIds.has(catId)) continue; // already silver

      // Resolve name from gold cats if not populated
      if (!catName) {
        const goldCat = goldCats.find(c => c.id === catId);
        catName = (goldCat?.name as string) || "";
      }

      const silverCatId = silverCatByName[catName];
      if (silverCatId) {
        await payload.update({
          collection: "products",
          id: product.id as number,
          data: { category: silverCatId },
          context: { skipSlugLock: true },
        });
        changes.push(`${product.title} (${product.id}): ${catId} -> ${silverCatId} (${catName})`);
        fixed++;
      } else {
        changes.push(`${product.title} (${product.id}): no silver match for "${catName}" (gold ${catId})`);
      }
    }

    return NextResponse.json({ fixed, changes, silverCatByName });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
