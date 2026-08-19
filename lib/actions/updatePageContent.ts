"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export async function updateSiteSettings(patch: Record<string, unknown>) {
  const payload = await getPayload({ config });
  await payload.updateGlobal({
    slug: "site-settings",
    data: patch,
  });
  return { success: true };
}

export async function updateLegalPage(id: string, patch: Record<string, unknown>) {
  const payload = await getPayload({ config });
  await payload.update({
    collection: "legal-pages",
    id,
    data: patch,
  });
  return { success: true };
}
