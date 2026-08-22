import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST() {
  try {
    const payload = await getPayload({ config });

    // Get silver category IDs
    const { docs: silverCats } = await payload.find({
      collection: "categories",
      where: { metal: { equals: "silver" } },
      limit: 100,
    });

    const silverCatMap: Record<string, number> = {};
    for (const cat of silverCats) {
      silverCatMap[cat.name as string] = cat.id as number;
    }

    // Get all gold category IDs
    const { docs: goldCats } = await payload.find({
      collection: "categories",
      where: { metal: { equals: "gold" } },
      limit: 100,
    });

    const goldCatNameToId: Record<string, number> = {};
    for (const cat of goldCats) {
      goldCatNameToId[cat.name as string] = cat.id as number;
    }

    // Get all silver products with their categories populated
    const { docs: silverProducts } = await payload.find({
      collection: "products",
      where: { metal: { equals: "silver" } },
      limit: 100,
    });

    let fixed = 0;
    const changes: string[] = [];
    const goldCatIds = goldCats.map(c => c.id as number);

    for (const product of silverProducts) {
      const catId = typeof product.category === "number" ? product.category : null;
      if (!catId) continue;

      // Check if this category belongs to gold
      if (!goldCatIds.includes(catId)) continue;

      // Find category name from goldCats
      const goldCat = goldCats.find(c => c.id === catId);
      const catName = goldCat?.name as string;
      if (!catName) continue;

      // Find matching silver category by name
      const silverCatId = silverCatMap[catName];
      if (silverCatId) {
        await payload.update({
          collection: "products",
          id: product.id as number,
          data: { category: silverCatId },
        });
        changes.push(`${product.title} (${product.id}): gold ${catId} -> silver ${silverCatId} (${catName})`);
        fixed++;
      } else {
        changes.push(`${product.title} (${product.id}): no silver match for "${catName}" (gold ${catId})`);
      }
    }

    return NextResponse.json({ fixed, changes, silverCatMap, goldCatNameToId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
