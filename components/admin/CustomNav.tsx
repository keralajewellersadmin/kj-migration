import React from "react";
import type { ServerProps } from "payload";
import CustomNavClient from "./CustomNavClient";

export default async function CustomNav({ payload, user }: ServerProps) {
  const inquiries = await payload
    .count({ collection: "inquiries" })
    .then((result) => result.totalDocs)
    .catch(() => 0);

  const displayName =
    typeof user?.name === "string" && user.name.trim()
      ? user.name
      : typeof user?.email === "string"
        ? user.email.split("@")[0]
        : "Admin User";

  const role = typeof user?.role === "string" ? user.role : "Super Admin";

  return (
    <CustomNavClient
      displayName={displayName}
      inquiries={inquiries}
      role={role}
    />
  );
}
