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

    // Get all silver products
    const { docs: silverProducts } = await payload.find({
      collection: "products",
      where: { metal: { equals: "silver" } },
      limit: 100,
      depth: 0,
    });

    let fixed = 0;
    const changes: string[] = [];

    for (const product of silverProducts) {
      const catRel = product.category;
      let currentCatId: number | null = null;
      let currentCatName = "";

      if (typeof catRel === "object" && catRel !== null) {
        currentCatId = (catRel as any).id as number;
        currentCatName = (catRel as any).name as string;
      } else if (typeof catRel === "number") {
        currentCatId = catRel;
      }

      if (!currentCatId) continue;

      // Check if current category is a silver one
      const isSilver = silverCats.some(c => c.id === currentCatId);
      if (isSilver) continue; // already correct

      // Need to fix: map by name
      const correctCatId = silverCatMap[currentCatName];
      if (correctCatId) {
        await payload.update({
          collection: "products",
          id: product.id as number,
          data: { category: correctCatId },
        });
        changes.push(`${product.title} (${product.id}): ${currentCatId} -> ${correctCatId} (${currentCatName})`);
        fixed++;
      } else {
        changes.push(`${product.title} (${product.id}): NO MATCH for "${currentCatName}"`);
      }
    }

    return NextResponse.json({ fixed, changes, silverCatMap });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
