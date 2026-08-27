/* eslint-disable */
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import crypto from "crypto";
import { validateAdminPassword } from "@/lib/payload/security";

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    
    // 1. Authenticate user from cookie
    const cookieHeader = request.headers.get("cookie") || "";
    let token: string | null = null;
    const cookiePrefix = "payload"; // from your config
    for (const part of cookieHeader.split(";")) {
      const [key, ...valueParts] = part.trim().split("=");
      if (key === `${cookiePrefix}-token`) {
        token = decodeURIComponent(valueParts.join("="));
        break;
      }
    }

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let claims;
    try {
      const rawSecret = process.env.PAYLOAD_SECRET || "";
      const secret = new TextEncoder().encode(rawSecret);
      const verified = await jwtVerify(token, secret);
      claims = verified.payload;
    } catch {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!claims || claims.collection !== "admin-users") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId, currentPassword, newPassword, confirmPassword } = await request.json();

    if (!targetUserId || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Ensure they have permission to change this password
    const isEditingSelf = claims.id === targetUserId;
    const isSuperAdmin = claims.role === "super-admin";

    if (!isEditingSelf && !isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden: You can only change your own password" }, { status: 403 });
    }

    // Fetch the target user record
    const targetUser = await payload.findByID({
      collection: "admin-users",
      id: targetUserId as string | number,
      overrideAccess: true,
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate current password (super admins bypassing for other users do not need this)
    if (!isSuperAdmin || isEditingSelf) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required" }, { status: 400 });
      }
      
      const expectedHash = targetUser.hash;
      const salt = targetUser.salt;
      
      if (expectedHash && salt) {
        const derivedKey = crypto.pbkdf2Sync(currentPassword, salt, 25000, 512, "sha256").toString("hex");
        if (derivedKey !== expectedHash) {
          return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
        }
      }
    }

    // Validate password strength
    const result = validateAdminPassword(newPassword, targetUser as any);
    if (result !== true) {
      return NextResponse.json({ error: result }, { status: 400 });
    }

    // Generate new salt and hash
    const newSalt = crypto.randomBytes(32).toString("hex");
    const hashBuffer = await new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(newPassword, newSalt, 25000, 512, "sha256", (err, key) =>
        err ? reject(err) : resolve(key),
      );
    });
    const newHash = hashBuffer.toString("hex");

    // Save to DB directly
    await payload.update({
      collection: "admin-users",
      id: targetUserId as string | number,
      data: { 
        salt: newSalt,
        hash: newHash
      },
      overrideAccess: true,
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
