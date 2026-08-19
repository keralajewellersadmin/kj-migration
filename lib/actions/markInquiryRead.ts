"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export async function markInquiryRead(id: string): Promise<{ success: boolean }> {
  const payload = await getPayload({ config });
  try {
    await payload.update({
      collection: "inquiries",
      id,
      data: { read: true } as Record<string, unknown>,
      overrideAccess: true,
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
