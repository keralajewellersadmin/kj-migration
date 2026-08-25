"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { isPostgres, loadArrayDataForEditor } from "@/lib/data/cms";

// Recursively normalize image fields from objects to string IDs for the editor
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeImageFields(obj: any): any {
  if (obj == null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(normalizeImageFields);
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val != null && typeof val === "object" && !Array.isArray(val) && "id" in val && (key === "image" || key === "ogImage" || key === "banner" || key === "promoImage")) {
      result[key] = String((val as Record<string, unknown>).id);
    } else if (Array.isArray(val)) {
      result[key] = val.map((item: unknown) => {
        if (item != null && typeof item === "object" && !Array.isArray(item)) {
          return normalizeImageFields(item);
        }
        return item;
      });
    } else if (val != null && typeof val === "object" && !Array.isArray(val)) {
      result[key] = normalizeImageFields(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

export async function getSiteSettingsData() {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: "site-settings", depth: 1 });
  let data = JSON.parse(JSON.stringify(settings));

  if (isPostgres()) {
    const editorData = await loadArrayDataForEditor();
    data = { ...data, ...editorData };
  }

  // Normalize image objects to string IDs for the editor
  return normalizeImageFields(data);
}

function cleanUploadFields(obj: any): void {
  if (obj == null || typeof obj !== "object") return;
  const uploadKeys = ["image", "banner", "promoImage", "ogImage"];
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (uploadKeys.includes(key) && val === "") {
      obj[key] = null;
    } else if (uploadKeys.includes(key) && typeof val === "string" && /^\d+$/.test(val)) {
      obj[key] = Number(val);
    } else if (Array.isArray(val)) {
      val.forEach((item) => cleanUploadFields(item));
    } else if (typeof val === "object" && val !== null) {
      cleanUploadFields(val);
    }
  }
}

export async function updateSiteSettings(patch: Record<string, unknown>) {
  try {
    const payload = await getPayload({ config });

    // Map bestsellerProducts from comma-separated slugs to product IDs if it is a string
    if (typeof patch.bestsellerProducts === "string") {
      const slugs = patch.bestsellerProducts
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (slugs.length > 0) {
        const productsResult = await payload.find({
          collection: "products" as any,
          where: {
            slug: {
              in: slugs,
            },
          },
          limit: 100,
          depth: 0,
        });

        const slugToIdMap = new Map(productsResult.docs.map((p) => [p.slug, p.id]));
        const productIds = slugs
          .map((slug) => slugToIdMap.get(slug))
          .filter((id): id is string | number => id !== undefined);

        patch.bestsellerProducts = productIds;
      } else {
        patch.bestsellerProducts = [];
      }
    }

    // Recursively normalize all empty image/upload strings to null across the entire document
    cleanUploadFields(patch);

    // Auto-clean incomplete array rows that would fail Payload validation
    // (e.g. an empty Hero Slide heading after + Add). Remove rows where a
    // required text field like heading/title is blank, so the user isn't
    // blocked by a hidden empty row when editing an unrelated section.
    if (Array.isArray((patch as Record<string, unknown>).heroSlides)) {
      const slides = (patch as Record<string, unknown>).heroSlides as Record<string, unknown>[];
      const cleaned = slides.filter((s) => String(s.heading ?? "").trim() !== "");
      if (cleaned.length !== slides.length) {
        (patch as Record<string, unknown>).heroSlides = cleaned;
      }
      // If still invalid after cleaning, let Payload surface the error normally
    }

    await payload.updateGlobal({
      slug: "site-settings",
      data: patch,
      overrideAccess: true,
    });
    void import("@/lib/data/cms").then(({ clearSiteSettingsCache }) => clearSiteSettingsCache());
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/products/gold");
    revalidatePath("/products/silver");
    revalidatePath("/products/diamond");
    revalidatePath("/products/platinum");
    revalidatePath("/contact");
    revalidatePath("/about");
    return { success: true };
  } catch (err: any) {
    console.error("updateSiteSettings error:", err);
    return { success: false, error: err.message || "Failed to save settings." };
  }
}

export async function updateLegalPage(id: string, patch: Record<string, unknown>) {
  try {
    const payload = await getPayload({ config });
    await payload.update({
      collection: "legal-pages",
      id,
      data: patch,
      overrideAccess: true,
    });
    return { success: true };
  } catch (err: any) {
    console.error("updateLegalPage error:", err);
    return { success: false, error: err.message || "Failed to save page." };
  }
}
