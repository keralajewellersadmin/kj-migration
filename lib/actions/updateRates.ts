"use server";

import { getPayload } from "payload";
import config from "@payload-config";

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
