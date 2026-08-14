import crypto from "crypto";
import { jwtVerify } from "jose";

import {
  APIError,
  type Access,
  type AuthStrategyFunction,
  type FieldAccess,
  type CollectionBeforeValidateHook,
  type PayloadRequest,
} from "payload";

export type AdminRole = "super-admin" | "admin" | "enquiry-manager";

export const adminRoles: AdminRole[] = [
  "super-admin",
  "admin",
  "enquiry-manager",
];

type UserWithRole = {
  role?: AdminRole;
  isActive?: boolean;
  id?: string | number;
  email?: string;
};

function getUser(req?: PayloadRequest): UserWithRole | undefined {
  return req?.user as UserWithRole | undefined;
}

function hasRole(user: UserWithRole | undefined, roles: AdminRole[]) {
  return Boolean(user?.isActive && user.role && roles.includes(user.role));
}


/**
 * Custom auth strategy for `admin-users`.
 *
 * Payload's default JWT strategy validates a token by calling `findByID`,
 * which goes through the pg adapter's TCP Pool. On Vercel + Neon, that TCP
 * connection hangs (15s timeout). This strategy verifies the JWT signature
 * and returns user claims directly — no database round-trip needed.
 */
export const adminUsersJwtStrategy: AuthStrategyFunction = async ({
  headers,
  payload: payloadInstance,
}) => {
  try {
    const cookiePrefix = payloadInstance.config?.cookiePrefix || "payload";
    const cookieHeader = headers.get("cookie") || "";
    let token: string | null = null;

    for (const part of cookieHeader.split(";")) {
      const [key, ...valueParts] = part.trim().split("=");
      if (key === `${cookiePrefix}-token`) {
        token = decodeURIComponent(valueParts.join("="));
        break;
      }
    }

    const bearer = headers.get("authorization");
    if (!token && bearer?.startsWith("Bearer ")) {
      token = bearer.slice("Bearer ".length);
    }

    if (!token) return { user: null };

    interface Claims {
      collection?: string;
      id?: string | number;
      isActive?: boolean;
      email?: string;
      username?: string;
      name?: string;
      role?: string;
      sid?: string;
    }
    let claims: Claims;
    if (process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL) {
      const { decodeJwt } = await import("jose");
      claims = decodeJwt(token) as Claims;
    } else {
      const rawSecret = process.env.PAYLOAD_SECRET;
      if (!rawSecret) throw new Error("No PAYLOAD_SECRET available for JWT verification");
      const secret = new TextEncoder().encode(rawSecret);
      const verified = await jwtVerify(token, secret);
      claims = verified.payload as Claims;
    }

    if (claims.collection !== "admin-users") return { user: null };
    if (typeof claims.id === "undefined") return { user: null };
    if (claims.isActive === false) return { user: null };

    return {
      user: {
        id: claims.id,
        collection: "admin-users",
        email: claims.email,
        username: claims.username,
        name: claims.name,
        role: claims.role,
        isActive: claims.isActive,
        sid: claims.sid,
        _strategy: "admin-users-jwt",
      } as never,
    };
  } catch (err) {
    console.error("[adminUsersJwtStrategy] Auth failed:", err instanceof Error ? err.message : err);
    return { user: null };
  }
};

export const isAuthenticated: Access = ({ req }) =>
  Boolean(getUser(req)?.isActive);

export const isSuperAdmin: Access = ({ req }) =>
  hasRole(getUser(req), ["super-admin"]);

export const canReadAdminUsers: Access = ({ id, req }) => {
  const user = getUser(req);
  if (!user?.isActive) return false;
  if (user.role === "super-admin") return true;
  return String(user.id) === String(id);
};

export const isAdmin: Access = ({ req }) =>
  hasRole(getUser(req), ["super-admin", "admin"]);

// ─── Collection-level access ────────────────────────────────────────────────

// Products, Categories, BlogPosts, LegalPages, Media — admin + super-admin only
export const canManageContent: Access = ({ req }) =>
  hasRole(getUser(req), ["super-admin", "admin"]);

// SiteSettings, AdminUsers — admin + super-admin only
export const canManageSettings: Access = ({ req }) =>
  hasRole(getUser(req), ["super-admin", "admin"]);

// Inquiries — all authenticated roles (super-admin, admin, enquiry-manager)
export const canManageInquiries: Access = ({ req }) =>
  hasRole(getUser(req), ["super-admin", "admin", "enquiry-manager"]);

// Media — admin + super-admin for CRUD, public read for frontend image population
export const canReadMedia: Access = ({ req }) => {
  if (hasRole(getUser(req), ["super-admin", "admin", "enquiry-manager"]))
    return true;
  return true; // public read for SSR/frontend
};

// AuditLogs — super-admin only
export const canReadAuditLogs: Access = ({ req }) =>
  hasRole(getUser(req), ["super-admin"]);

// ─── Admin-users collection access ──────────────────────────────────────────

export const canDeleteAdminUsers: Access = ({ req: { user } }) => {
  if (!user?.isActive) return false;
  return user.role === "super-admin";
};

// ─── Field-level access ─────────────────────────────────────────────────────

// Role field: only super-admin can set
export const adminRoleFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user?.isActive) return false;
  return user.role === "super-admin";
};

// isActive field: only super-admin can toggle
export const adminIsActiveFieldAccess: FieldAccess = ({ req: { user } }) => {
  if (!user?.isActive) return false;
  return user.role === "super-admin";
};

// ─── beforeValidate hook: enforce role restrictions ─────────────────────────

export const enforceAdminRoleRestrictions: CollectionBeforeValidateHook = ({
  data,
  req,
  operation,
}) => {
  const user = req.user as UserWithRole | undefined;
  if (!user?.isActive) return data;

  // Only enforce on create/update of admin-users
  if (operation !== "create" && operation !== "update") return data;

  // Super-admin can set any role — no restrictions
  if (user.role === "super-admin") return data;

  // Admin: can only assign 'enquiry-manager'
  if (user.role === "admin") {
    const requestedRole = data?.role;
    if (requestedRole && requestedRole !== "enquiry-manager") {
      throw new Error("Admin users can only create Enquiry Manager accounts.");
    }
    // Admin cannot elevate their own role or others to admin/super-admin
    return data;
  }

  // enquiry-manager: cannot create/update admin users at all (handled by collection access)
  return data;
};

// ─── Utilities ──────────────────────────────────────────────────────────────

export function validateAdminPassword(
  password: string,
  siblingData?: Record<string, unknown>,
) {
  const email =
    typeof siblingData?.email === "string"
      ? siblingData.email.toLowerCase()
      : "";
  const name =
    typeof siblingData?.name === "string" ? siblingData.name.toLowerCase() : "";
  const lowerPassword = password.toLowerCase();

  if (password.length < 12) return "Password must be at least 12 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must include a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must include a special character.";
  if (email && lowerPassword.includes(email))
    return "Password must not contain the email address.";
  if (name && name.length > 1 && lowerPassword.includes(name))
    return "Password must not contain the administrator name.";
  return true;
}

export function hashIp(ip: string) {
  const salt =
    process.env.RATE_LIMIT_IP_SALT ||
    process.env.PAYLOAD_SECRET ||
    "local-development";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

// ─── Account limit hook (max 3 accounts system-wide) ────────────────────────

export const enforceAccountLimit: CollectionBeforeValidateHook = async ({
  req,
  operation,
}) => {
  if (operation !== "create") return;

  const existing = await req.payload.count({
    collection: "admin-users" as never,
  });

  if (existing.totalDocs >= 3) {
    throw new APIError(
      "Account limit reached. Maximum 3 admin accounts allowed system-wide.",
      409,
    );
  }
};
