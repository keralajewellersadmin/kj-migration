"use server";

import { getPayload } from "payload";
import config from "@payload-config";

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
  const payload = await getPayload({ config });
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      rateGold22: data.gold22,
      rateGold18: data.gold18,
      rateSilver: data.silver,
      ratePlatinum: data.platinum,
    },
    overrideAccess: true,
  });
  return { success: true };
}
