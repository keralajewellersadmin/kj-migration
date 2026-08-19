import type { ServerProps } from "payload";
import AdminSidebar from "./AdminSidebar";

export default async function AdminSidebarServer({ payload, user }: ServerProps) {
  if (!user) return null;

  let inquiryCount = 0;
  try {
    const result = await payload.count({
      collection: "inquiries",
      where: { read: { equals: false } },
    });
    inquiryCount = result.totalDocs;
  } catch {
    // ignore
  }

  const userMap = user as unknown as Record<string, unknown>;
  const displayName = String(userMap.name || userMap.username || user.email || "Admin");
  const role = String(userMap.role || "admin");

  return (
    <AdminSidebar
      displayName={displayName}
      role={role}
      inquiryCount={inquiryCount}
    />
  );
}
