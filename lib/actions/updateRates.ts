"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

const RATE_PATHS = [
  "/",
  "/products",
  "/products/gold",
  "/products/silver",
  "/products/diamond",
  "/products/platinum",
  "/contact",
  "/blog",
];

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // no static store in some contexts — TTL cache still clears below
  }
}

export async function getRates() {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: "site-settings" });
  return {
    gold22: (settings.rateGold22 as string) || "",
    gold18: (settings.rateGold18 as string) || "",
    silver: (settings.rateSilver as string) || "",
    platinum: (settings.ratePlatinum as string) || "",
    lastUpdated: (settings.rateUpdated as string) || "",
  };
}

export async function updateRates(data: {
  gold22: string;
  gold18: string;
  silver: string;
  platinum: string;
}) {
  try {
    const clean = (v: string) => String(v ?? "").replace(/[^\d.,]/g, "").trim();
    const gold22 = clean(data.gold22);
    const gold18 = clean(data.gold18);
    const silver = clean(data.silver);
    const platinum = clean(data.platinum);
    if (!gold22 || !gold18 || !silver || !platinum) {
      return { success: false, error: "All four rates are required." };
    }

    const payload = await getPayload({ config });
    await payload.updateGlobal({
      slug: "site-settings",
      data: {
        rateGold22: gold22,
        rateGold18: gold18,
        rateSilver: silver,
        ratePlatinum: platinum,
        rateUpdated: new Date().toISOString(),
      },
      overrideAccess: true,
    });

    const { clearSiteSettingsCache } = await import("@/lib/data/cms");
    clearSiteSettingsCache();
    for (const p of RATE_PATHS) safeRevalidate(p);

    return { success: true };
  } catch (err: unknown) {
    console.error("updateRates error:", err);
    const message = err instanceof Error ? err.message : "Failed to update rates.";
    return { success: false, error: message };
  }
}
