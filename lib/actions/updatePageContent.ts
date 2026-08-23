"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

export async function getSiteSettingsData() {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: "site-settings" });
  return JSON.parse(JSON.stringify(settings));
}

export async function updateSiteSettings(patch: Record<string, unknown>) {
  const payload = await getPayload({ config });
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
}

export async function updateLegalPage(id: string, patch: Record<string, unknown>) {
  const payload = await getPayload({ config });
  await payload.update({
    collection: "legal-pages",
    id,
    data: patch,
    overrideAccess: true,
  });
  return { success: true };
}
