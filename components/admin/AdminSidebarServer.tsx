import React from "react";
import type { ServerProps } from "payload";
import AdminSidebar from "./AdminSidebar";

export default async function AdminSidebarServer({ payload, user }: ServerProps) {
  if (!user) return null;

  let inquiryCount = 0;
  try {
    const result = await payload.count({
      collection: "inquiries",
      where: { status: { equals: "new" } },
    });
    inquiryCount = result.totalDocs;
  } catch {
    // ignore
  }

  const displayName = (user as any).name || (user as any).username || user.email || "Admin";
  const role = (user as any).role || "admin";

  return (
    <AdminSidebar
      displayName={displayName}
      role={role}
      inquiryCount={inquiryCount}
    />
  );
}
