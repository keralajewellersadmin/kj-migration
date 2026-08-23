import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import crypto from "crypto";
import {
  buildConfig,
  ValidationError,
  type CollectionConfig,
  type GlobalConfig,
  type CollectionAfterChangeHook,
  type CollectionBeforeValidateHook,
  type CollectionBeforeDeleteHook,
  type GlobalAfterChangeHook,
} from "payload";
import sharp from "sharp";
import { resendAdapter } from "@payloadcms/email-resend";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import * as neonServerless from "@neondatabase/serverless";
import path from "path";
import { revalidatePath } from "next/cache.js";
import {
  auditLogAfterChange,
  auditLogAfterDelete,
  auditLogAfterLogin,
  auditLogGlobalAfterChange,
} from "./lib/auditLogHooks.ts";
import {
  canManageContent,
  canManageInquiries,
  canManageInquiriesField,
  canManageSettings,
canReadAdminUsers,
  canReadAuditLogs,
  canReadMedia,
  isAuthenticated,
  isSuperAdmin,
  canDeleteAdminUsers,
  adminRoleFieldAccess,
  adminIsActiveFieldAccess,
  enforceAdminRoleRestrictions,
  enforceAccountLimit,
  validateAdminPassword,
  adminUsersJwtStrategy,
} from "./lib/payload/security.ts";
import {
  cloudinaryUploadHook,
  cloudinaryDeleteHook,
} from "./lib/cloudinaryUploadHook.ts";
import { ADMIN_PATH } from "./lib/admin-path.ts";
import { generateResetToken, hashValue, sendWelcomeEmail } from "./lib/auth/email.ts";

neonServerless.neonConfig.poolQueryViaFetch = true;

const canReadAdminUserField = ({
  id,
  req,
}: {
  id?: string | number;
  req: Parameters<typeof canManageSettings>[0]["req"];
}) =>
  Boolean(
    canReadAdminUsers({
      id: Number(id),
      req,
    }),
  );

const revalidateProduct: CollectionAfterChangeHook = async ({ doc }) => {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/gold");
  revalidatePath("/products/silver");
  revalidatePath("/products/diamond");
  revalidatePath("/products/platinum");
  if (doc?.slug) {
    revalidatePath(`/product/${doc.slug}`);
  }
};

const revalidateBlog: CollectionAfterChangeHook = async ({ doc }) => {
  revalidatePath("/blog");
  if (doc?.slug) {
    revalidatePath(`/blog/${doc.slug}`);
  }
};

const revalidateLegal: CollectionAfterChangeHook = () => {
  revalidatePath("/terms-conditions");
  revalidatePath("/privacy-policy");
  revalidatePath("/swarnavarsha");
};

const revalidateReviews: CollectionAfterChangeHook = () => {
  revalidatePath("/");
  void import("./lib/data/cms").then(({ clearSiteSettingsCache }) => clearSiteSettingsCache());
};

const revalidateSiteSettings: GlobalAfterChangeHook = () => {
  void import("./lib/data/cms").then(({ clearSiteSettingsCache }) => clearSiteSettingsCache());
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/gold");
  revalidatePath("/products/silver");
  revalidatePath("/products/diamond");
  revalidatePath("/products/platinum");
  revalidatePath("/contact");
  revalidatePath("/blog");
};

const preventDeleteCategoryWithProducts: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  const { totalDocs } = await req.payload.find({
    collection: "products",
    where: { category: { equals: id } },
    limit: 1,
  });
  if (totalDocs > 0) {
    throw new ValidationError({
      collection: "categories",
      errors: [
        {
          message: `Cannot delete this category — ${totalDocs} product(s) still reference it. Reassign or remove them first.`,
          path: "name",
        },
      ],
    });
  }
  return true;
};

const metalSelect = {
  options: [
    { label: "Gold", value: "gold" },
    { label: "Silver", value: "silver" },
    { label: "Diamond", value: "diamond" },
    { label: "Platinum", value: "platinum" },
  ],
} as const;

const resolvedDbUrl =
  process.env.DATABASE_URL || process.env.DATABASE_URI || "";
const usePostgres =
  resolvedDbUrl.startsWith("postgresql");

function cleanDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  const parsed = new URL(url);
  parsed.searchParams.delete("channel_binding");
  const sslMode = parsed.searchParams.get("sslmode");
  if (sslMode === "prefer" || sslMode === "require" || sslMode === "verify-ca") {
    parsed.searchParams.set("sslmode", "verify-full");
  }
  if (parsed.hostname.includes("-pooler")) {
    parsed.hostname = parsed.hostname.replace("-pooler", "");
  }
  return parsed.toString();
}

const publicRead = () => true;

const requireProductionSecret = () => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error(
      "PAYLOAD_SECRET is required. Set it in .env.local or your environment.",
    );
  }
  return process.env.PAYLOAD_SECRET;
};

const preventDuplicateCategory: CollectionBeforeValidateHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation !== "create" && operation !== "update") return data;
  if (!data?.name || !data?.metal) return data;

  const normalizedName = data.name.trim().toLowerCase();

  const { docs: existingByName } = await req.payload.find({
    collection: "categories",
    where: {
      and: [
        { metal: { equals: data.metal } },
        { id: { not_equals: data.id || "" } },
      ],
    },
    limit: 100,
  });

  const duplicate = existingByName.find((doc) => {
    const existingName = ((doc.name as string) || "").trim().toLowerCase();
    return existingName === normalizedName;
  });

  if (duplicate) {
    throw new Error(
      `A category named "${data.name}" already exists for ${data.metal}. Use a different name or edit the existing category.`,
    );
  }

  const baseSlug = data.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  let candidateSlug = `${baseSlug}-${data.metal}`;

  const { docs: existingBySlug } = await req.payload.find({
    collection: "categories",
    where: {
      and: [
        { slug: { equals: candidateSlug } },
        { id: { not_equals: data.id || "" } },
      ],
    },
    limit: 10,
  });

  if (existingBySlug.length > 0) {
    let counter = 2;
    while (true) {
      candidateSlug = `${baseSlug}-${data.metal}-${counter}`;
      const { docs: check } = await req.payload.find({
        collection: "categories",
        where: {
          and: [
            { slug: { equals: candidateSlug } },
            { id: { not_equals: data.id || "" } },
          ],
        },
        limit: 1,
      });
      if (check.length === 0) break;
      counter++;
    }
  }

  data.slug = candidateSlug;

  return data;
};

function makeAutoSlug(collectionSlug: string): CollectionBeforeValidateHook {
  return async ({ data, req, operation }) => {
    if (operation !== "create") return data;
    if (!data?.title) return data;

    const baseSlug = data.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!baseSlug) return data;

    let candidateSlug = baseSlug;

    const { docs: existingBySlug } = await req.payload.find({
      collection: collectionSlug as never,
      where: {
        and: [
          { slug: { equals: candidateSlug } },
          { id: { not_equals: data.id || "" } },
        ],
      },
      limit: 10,
    });

    if (existingBySlug.length > 0) {
      let counter = 2;
      while (true) {
        candidateSlug = `${baseSlug}-${counter}`;
        const { docs: check } = await req.payload.find({
          collection: collectionSlug as never,
          where: {
            and: [
              { slug: { equals: candidateSlug } },
              { id: { not_equals: data.id || "" } },
            ],
          },
          limit: 1,
        });
        if (check.length === 0) break;
        counter++;
      }
    }

    data.slug = candidateSlug;

    return data;
  };
}

const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "mediaType", "mimeType", "filesize", "updatedAt"],
    components: {
      edit: { beforeDocumentControls: ["@/components/admin/shared/GoBackButton"] },
      beforeListTable: [
        "@/components/admin/shared/MediaFolderFilters",
      ],
    },
  },
  access: {
    read: canReadMedia,
    create: canManageContent,
    update: canManageContent,
    delete: canManageSettings,
  },
  hooks: {
    beforeChange: [cloudinaryUploadHook],
    afterChange: [auditLogAfterChange],
    afterDelete: [cloudinaryDeleteHook, auditLogAfterDelete],
  },
  upload: {
    disableLocalStorage: true,
    staticDir: process.env.MEDIA_DIR || "public/media",
    adapter: 'dummy-cloudinary' as any,
    mimeTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          'Alternative text for accessibility (e.g. "Gold Bangle Front View")',
      },
    },
    {
      name: "mediaType",
      type: "select",
      label: "Folder",
      options: [
        { label: "Products", value: "product" },
        { label: "Categories", value: "category" },
        { label: "Banners", value: "banner" },
        { label: "Hero Images", value: "hero" },
        { label: "Gallery", value: "gallery" },
        { label: "Blog", value: "blog" },
        { label: "Pages", value: "page" },
        { label: "Heritage", value: "heritage" },
        { label: "Timeline", value: "timeline" },
        { label: "Collections", value: "collection" },
        { label: "Other", value: "misc" },
      ],
      defaultValue: "misc",
    },
    {
      name: "cloudinaryPublicId",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Cloudinary public ID (auto-set on upload)",
      },
    },
  ],
};

const AdminUsers: CollectionConfig = {
  slug: "admin-users",
  auth: {
    tokenExpiration: 60 * 60 * 8,
    disableLocalStrategy: true,
    cookies: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    },
    strategies: [{ name: "admin-users-jwt", authenticate: adminUsersJwtStrategy }],
  },
  admin: {
    components: { edit: { beforeDocumentControls: ["@/components/admin/shared/GoBackButton"] } }, useAsTitle: "username" },
  hooks: {
    beforeValidate: [
      enforceAdminRoleRestrictions,
      enforceAccountLimit,
      async ({ data, req, operation, originalDoc }) => {
        if (!data) return data;
        
        const passwordChange = data.passwordChange;
        if (passwordChange) {
          const { currentPassword, newPassword, confirmPassword } = passwordChange;

          if (newPassword) {
            // 1. Verify confirm password matches
            if (newPassword !== confirmPassword) {
              throw new ValidationError({
                collection: "admin-users",
                errors: [{ message: "Passwords do not match.", path: "passwordChange.confirmPassword" }],
              });
            }

            // 2. Validate password strength
            const result = validateAdminPassword(newPassword, data);
            if (result !== true) {
              throw new ValidationError({
                collection: "admin-users",
                errors: [{ message: result, path: "passwordChange.newPassword" }],
              });
            }

            // 3. Verify current password if updating own account (super-admins can bypass for others)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const user = req.user as any;
            if (operation === "update" && (!user || user.role !== "super-admin" || user.id === originalDoc?.id)) {
              if (!currentPassword) {
                throw new ValidationError({
                  collection: "admin-users",
                  errors: [{ message: "Current password is required to change your password.", path: "passwordChange.currentPassword" }],
                });
              }
              const expectedHash = originalDoc?.hash;
              const salt = originalDoc?.salt;
              if (expectedHash && salt) {
                const derivedKey = crypto.pbkdf2Sync(currentPassword, salt, 25000, 512, "sha256").toString("hex");
                if (derivedKey !== expectedHash) {
                  throw new ValidationError({
                    collection: "admin-users",
                    errors: [{ message: "Incorrect current password.", path: "passwordChange.currentPassword" }],
                  });
                }
              }
            }

            // 4. Generate new salt and hash
            const salt = crypto.randomBytes(32).toString("hex");
            const hashBuffer = await new Promise<Buffer>((resolve, reject) => {
              crypto.pbkdf2(newPassword, salt, 25000, 512, "sha256", (err, key) =>
                err ? reject(err) : resolve(key),
              );
            });
            data.salt = salt;
            data.hash = hashBuffer.toString("hex");
          }
        }

        // On update, if no new password provided, keep existing salt/hash (done automatically since we don't overwrite)
        
        // Prevent plaintext temporary fields from being saved
        delete data.passwordChange;
        delete data.password;

        return data;
      },
    ],
    afterChange: [
      auditLogAfterChange,
      async ({ doc, operation, req }) => {
        // Only trigger on creation
        if (operation !== "create") return doc;

        // Skip if email is missing or disabled in development
        if (!doc.email) return doc;

        try {
          // Generate a token
          const rawToken = generateResetToken();
          const tokenHash = hashValue(rawToken);
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

          // Create the setup record (using password-resets collection for simplicity)
          await req.payload.create({
            collection: "password-resets",
            overrideAccess: true,
            data: {
              userId: doc.id,
              tokenHash,
              expiresAt,
              used: false,
            },
          });

          // Send the welcome email
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (req.headers && req.headers.get ? req.headers.get("origin") : "") || "http://localhost:3000";
          const resetUrl = `${siteUrl}${ADMIN_PATH}/setup-account?token=${rawToken}`;
          
          await sendWelcomeEmail(doc.email, doc.name || doc.username, resetUrl);
        } catch (err) {
          console.error("Failed to send welcome email:", err);
        }

        return doc;
      },
    ],
    afterDelete: [auditLogAfterDelete],
    afterLogin: [auditLogAfterLogin],
  },
  endpoints: [
    {
      // 2FA (OTP) is enforced via the custom /api/auth/* flow. Disable Payload's
      // built-in password-only login so it cannot be used to bypass OTP.
      path: "/login",
      method: "post",
      handler: () =>
        Response.json(
          {
            error:
              "Password-only login is disabled. Use the OTP login flow at /api/auth/login.",
          },
          { status: 403 },
        ),
    },
    {
      // Override the default /me endpoint to skip Payload's findByID call.
      // Payload's default meOperation calls findByID through the postgres
      // adapter's TCP pool, which hangs on Vercel + Neon (15s timeout).
      // This endpoint reads the JWT directly from the cookie, verifies it,
      // and returns the user claims without any database round-trip.
      path: "/me",
      method: "get",
      handler: async (req) => {
        try {
          const { jwtVerify, decodeJwt } = await import("jose");

          const cookiePrefix = req.payload.config?.cookiePrefix || "payload";
          const cookieHeader = req.headers.get("cookie") || "";
          let token: string | null = null;
          for (const part of cookieHeader.split(";")) {
            const [key, ...valueParts] = part.trim().split("=");
            if (key === `${cookiePrefix}-token`) {
              token = decodeURIComponent(valueParts.join("="));
              break;
            }
          }

          if (!token) {
            return Response.json({ user: null }, { status: 401 });
          }

          const rawSecret = process.env.PAYLOAD_SECRET || req.payload.secret;
          const secret = new TextEncoder().encode(rawSecret);
          const { payload: claims } = await jwtVerify(token, secret);

          if (claims.collection !== "admin-users") {
            return Response.json({ user: null }, { status: 401 });
          }
          if (typeof claims.id === "undefined") {
            return Response.json({ user: null }, { status: 401 });
          }
          if (claims.isActive === false) {
            return Response.json({ user: null }, { status: 401 });
          }

          const decoded = decodeJwt(token);

          return Response.json({
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
            },
            exp: decoded.exp,
          });
        } catch {
          return Response.json({ user: null }, { status: 401 });
        }
      },
    },
  ],
  access: {
    read: canReadAdminUsers,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: canDeleteAdminUsers,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      admin: {
        description: "Email address used for OTP delivery and password reset.",
      },
    },
    {
      name: "username",
      type: "text",
      unique: true,
      admin: {
        description:
          "Username for login (admin & enquiry-manager roles must use this to sign in).",
      },
    },
    {
      name: "passwordChange",
      type: "group",
      virtual: true,
      admin: {
        description: "Change Password (leave blank to keep current)",
        condition: (data) => {
          // Only show password change fields for existing users, not on creation
          return Boolean(data?.id);
        },
      },
      fields: [
        {
          name: "currentPassword",
          type: "text",
          admin: {
            description: "Required to change your own password.",
            components: { Field: "@/components/admin/shared/PasswordField#PasswordField" },
          },
        },
        {
          name: "newPassword",
          type: "text",
          admin: {
            description: "Must be at least 8 characters.",
            components: { Field: "@/components/admin/shared/PasswordField#PasswordField" },
          },
        },
        {
          name: "confirmPassword",
          type: "text",
          admin: {
            description: "Must match the new password.",
            components: { Field: "@/components/admin/shared/PasswordField#PasswordField" },
          },
        }
      ]
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "enquiry-manager",
      options: [
        { label: "super-admin", value: "super-admin" },
        { label: "admin", value: "admin" },
        { label: "enquiry-manager", value: "enquiry-manager" },
      ],
      access: { create: adminRoleFieldAccess, update: adminRoleFieldAccess },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      access: {
        create: adminIsActiveFieldAccess,
        update: adminIsActiveFieldAccess,
      },
    },
    {
      name: "sessions",
      type: "array",
      access: {
        read: canReadAdminUserField,
        update: () => false,
      },
      admin: { disabled: true },
      fields: [
        { name: "id", type: "text", required: true },
        { name: "createdAt", type: "date", defaultValue: () => new Date() },
        { name: "expiresAt", type: "date", required: true },
      ],
    },
    {
      name: "salt",
      type: "text",
      admin: { hidden: true, disabled: true },
      access: {
        read: () => false,
        create: () => false,
        update: () => false,
      },
    },
    {
      name: "hash",
      type: "text",
      admin: { hidden: true, disabled: true },
      access: {
        read: () => false,
        create: () => false,
        update: () => false,
      },
    },
    {
      name: "accountActivated",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Checked when the user completes their account setup.",
        condition: (data) => Boolean(data?.id),
      },
      access: {
        create: adminIsActiveFieldAccess,
        update: adminIsActiveFieldAccess,
      },
    },
    {
      name: "accountActions",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/components/admin/shared/AccountSetupActions",
        },
        condition: (data, siblingData, { user }) => {
          // Show account actions (Resend Setup / Reset Password) if super-admin is editing someone else
          return Boolean(data?.id) && user?.id !== data?.id && user?.role === "super-admin";
        },
      },
    },
  ],
};

const Product: CollectionConfig = {
  slug: "products",
  admin: {
    components: { edit: { beforeDocumentControls: ["@/components/admin/shared/GoBackButton"] } }, useAsTitle: "title" },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageSettings,
  },
  hooks: {
    beforeValidate: [makeAutoSlug("products")],
    afterChange: [revalidateProduct, auditLogAfterChange],
    afterDelete: [auditLogAfterDelete],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        readOnly: true,
        description: "Auto-generated on creation — frozen after save.",
      },
      hooks: {
        beforeChange: [
          ({ operation, siblingData, req }) => {
            if (operation === "update" && req.context?.skipSlugLock) return;
            if (operation === "update" && siblingData && "slug" in siblingData) {
              throw new Error("Slug cannot be changed after creation.");
            }
          },
        ],
      },
    },
    { name: "code", type: "text" },
    { name: "metal", type: "select", options: [...metalSelect.options] },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      filterOptions: ({ data, siblingData }: any) => {
        const metal = siblingData?.metal || data?.metal;
        if (metal) {
          return {
            metal: { equals: metal },
          };
        }
        return false; // Safely disable the field if no metal is selected
      },
    },
    { name: "weight", type: "text" },
    { name: "purity", type: "text" },
    { name: "description", type: "textarea" },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Upload the primary product image" },
    },
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description:
              "Custom meta title for search engines (defaults to product name). Recommended: 50–60 characters.",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description:
              "Meta description for search results (defaults to product description). Recommended: 150–160 characters.",
          },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "OG image for social sharing (defaults to product image). Recommended: 1200×630px.",
          },
        },
      ],
    },
  ],
};

const Category: CollectionConfig = {
  slug: "categories",
  admin: {
    components: { edit: { beforeDocumentControls: ["@/components/admin/shared/GoBackButton"] } }, useAsTitle: "name" },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageSettings,
  },
  hooks: {
    beforeValidate: [preventDuplicateCategory],
    beforeDelete: [preventDeleteCategoryWithProducts],
    afterChange: [revalidateProduct, auditLogAfterChange],
    afterDelete: [auditLogAfterDelete],
  },
  fields: [
    {
      name: "metal",
      type: "select",
      required: true,
      options: [...metalSelect.options],
      admin: {
        description:
          "Which metal this category belongs to (Gold, Silver, or Diamond).",
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description:
          'Category type name shown in navbar & filter (e.g. "Bangles", "Earrings", "Nosepin").',
      },
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        readOnly: true,
        description: "Auto-generated — you don't need to edit this.",
      },
    },
    {
      name: "displayOrder",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Order in navbar mega menu & filter dropdown (0 = first).",
      },
    },
  ],
};

const BlogPost: CollectionConfig = {
  slug: "blog-posts",
  admin: {
    components: { edit: { beforeDocumentControls: ["@/components/admin/shared/GoBackButton"] } }, useAsTitle: "title" },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageSettings,
  },
  hooks: {
    beforeValidate: [makeAutoSlug("blog-posts")],
    afterChange: [revalidateBlog, auditLogAfterChange],
    afterDelete: [auditLogAfterDelete],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: "Auto-generated on creation — frozen after save.",
      },
    },
    { name: "excerpt", type: "textarea" },
    {
      name: "date",
      type: "text",
      admin: { description: "Display date (e.g. April 20, 2026)" },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      admin: { description: "Upload thumbnail image for the blog post" },
    },
    {
      name: "body",
      type: "array",
      fields: [
        {
          name: "type",
          type: "select",
          options: [
            { label: "Heading", value: "h2" },
            { label: "Paragraph", value: "p" },
            { label: "List", value: "ul" },
          ],
          required: true,
        },
        { name: "text", type: "text" },
        {
          name: "items",
          type: "array",
          fields: [{ name: "item", type: "text" }],
        },
      ],
    },
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description:
              "Custom meta title for search engines (defaults to post title). Recommended: 50–60 characters.",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description:
              "Meta description for search results (defaults to excerpt). Recommended: 150–160 characters.",
          },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "OG image for social sharing (defaults to post thumbnail). Recommended: 1200×630px.",
          },
        },
      ],
    },
  ],
};

const LegalPage: CollectionConfig = {
  slug: "legal-pages",
  labels: { singular: "Legal Page", plural: "Legal Pages" },
  admin: {
    components: { edit: { beforeDocumentControls: ["@/components/admin/shared/GoBackButton"] } }, useAsTitle: "title", group: "Content" },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageSettings,
  },
  hooks: {
    beforeValidate: [makeAutoSlug("legal-pages")],
    afterChange: [revalidateLegal, auditLogAfterChange],
    afterDelete: [auditLogAfterDelete],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: "Auto-generated on creation — frozen after save.",
      },
    },
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description:
              "Custom meta title for search engines (defaults to page title). Recommended: 50–60 characters.",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description:
              "Meta description for search results. Recommended: 150–160 characters.",
          },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "OG image for social sharing. Recommended: 1200×630px.",
          },
        },
      ],
    },
    {
      name: "sections",
      type: "array",
      fields: [
        { name: "title", type: "text" },
        {
          name: "blocks",
          type: "array",
          fields: [
            {
              name: "type",
              type: "select",
              options: [
                { label: "Paragraph", value: "p" },
                { label: "List", value: "ul" },
              ],
              required: true,
            },
            { name: "text", type: "text" },
            {
              name: "items",
              type: "array",
              fields: [{ name: "item", type: "text" }],
            },
          ],
        },
      ],
    },
  ],
};

const Inquiry: CollectionConfig = {
  slug: "inquiries",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "source", "status", "submittedAt"],
    listSearchableFields: ["name", "email"],
    components: {
      beforeListTable: [
        "@/components/admin/inquiries/InquiryQuickFilters",
      ],
      edit: {
        beforeDocumentControls: [
          "@/components/admin/shared/GoBackButton",
          "@/components/admin/inquiries/InquiryReadMarker",
        ],
      },
    },
  },
  access: {
    read: canManageInquiries,
    // Public submissions go ONLY through the hardened /api/inquiry route
    // (validation, honeypot, rate limiting, HTML escaping). Direct REST writes
    // are blocked; the route uses overrideAccess to create the record.
    // Only the `status` field is editable; all other fields stay read-only
    // (see per-field `access.update`).
    create: () => false,
    update: canManageInquiries,
    // Delete is allowed for inquiry managers (triage/spam removal). Each deletion
    // is still recorded by the auditLogAfterDelete hook.
    delete: canManageInquiries,
  },
  fields: [
    // Only the fields captured by the public contact/enquiry forms:
    // /contact (name, email, message) and /enquiry (name, phone, email, message)
    { name: "name", type: "text", required: true, admin: { readOnly: true }, access: { update: () => false } },
    { name: "email", type: "text", required: true, admin: { readOnly: true }, access: { update: () => false } },
    { name: "phone", type: "text", admin: { readOnly: true }, access: { update: () => false } },
    { name: "message", type: "textarea", admin: { readOnly: true, disableListFilter: true }, access: { update: () => false } },
    // Enquiry-form specific captures (only populated by the /enquiry form)
    { name: "city", type: "text", admin: { readOnly: true }, access: { update: () => false } },
    { name: "preferredTime", type: "text", label: "Preferred Time", admin: { readOnly: true }, access: { update: () => false } },
    { name: "productName", type: "text", label: "Product", admin: { readOnly: true }, access: { update: () => false } },
    { name: "productId", type: "text", label: "Product ID", admin: { readOnly: true }, access: { update: () => false } },
    // Source pill: which public form submitted this enquiry
    {
      name: "source",
      type: "select",
      defaultValue: "contact",
      options: [
        { label: "Contact Form", value: "contact" },
        { label: "Enquiry Form", value: "enquiry" },
      ],
      admin: {
        readOnly: true,
        components: {
          Cell: "@/components/admin/inquiries/InquirySourcePill",
        },
      },
    },
    // Read/unread flag (toggled automatically when the admin opens the record)
    {
      name: "read",
      type: "checkbox",
      defaultValue: false,
      admin: { readOnly: true, disableListFilter: true },
      access: { update: canManageInquiriesField },
    },
    // System fields (not form inputs — kept for admin triage only)
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      // The ONLY admin-editable field — used to triage enquiries
      // (New / Contacted / In Progress / Resolved / Closed / Spam)
      access: { update: canManageInquiriesField },
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "In Progress", value: "in-progress" },
        { label: "Resolved", value: "resolved" },
        { label: "Closed", value: "closed" },
        { label: "Spam", value: "spam" },
      ],
    },
    {
      name: "emailNotificationStatus",
      type: "select",
      defaultValue: "not-sent",
      options: ["not-sent", "sent", "failed"],
      admin: { readOnly: true, disableListFilter: true },
      access: { update: () => false },
    },
    {
      name: "submittedAt",
      type: "date",
      defaultValue: () => new Date().toISOString(),
      admin: { readOnly: true },
      access: { update: () => false },
    },
  ],
};

const RateLimit: CollectionConfig = {
  slug: "rate-limits",
  admin: { hidden: true },
  access: {
    read: canReadAuditLogs,
    // Written only by server-side rate-limit logic (overrideAccess in API routes).
    // Public REST writes are blocked to prevent DB flooding / counter tampering.
    create: canReadAuditLogs,
    update: canReadAuditLogs,
    delete: isSuperAdmin,
  },
  fields: [
    { name: "key", type: "text", required: true, unique: true },
    { name: "count", type: "number", required: true, defaultValue: 1 },
    { name: "resetAt", type: "date", required: true },
  ],
};

const AuditLog: CollectionConfig = {
  slug: "audit-logs",
  admin: {
    useAsTitle: "action",
    defaultColumns: ["createdAt", "actor", "action", "resourceType", "ipHash"],
  },
  access: {
    read: canReadAuditLogs,
    create: isAuthenticated,
    update: () => false,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "actor",
      type: "relationship",
      relationTo: "admin-users",
      admin: { description: "Who performed the action" },
    },
    {
      name: "action",
      type: "text",
      required: true,
      admin: {
        description:
          "What action was performed (e.g. Login, Logout, Create, Update, Delete)",
      },
    },
    {
      name: "resourceType",
      type: "text",
      admin: { description: "The entity type (e.g., Product, Settings)" },
    },
    {
      name: "resourceId",
      type: "text",
      admin: { description: "The ID or name of the target entity" },
    },
    {
      name: "metadata",
      type: "json",
      label: "Changes",
      admin: { description: "Before and after values for changes" },
    },
    {
      name: "ipHash",
      type: "text",
      label: "IP Address",
      admin: {
        readOnly: true,
        description: "IP address where the action originated",
      },
    },
    { name: "userAgent", type: "text" },
    {
      name: "outcome",
      type: "select",
      options: ["success", "failure"],
      required: true,
      defaultValue: "success",
    },
  ],
};

const LoginOtp: CollectionConfig = {
  slug: "login-otps",
  admin: { hidden: true },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: "userId",
      type: "number",
      required: true,
    },
    {
      name: "codeHash",
      type: "text",
      required: true,
    },
    {
      name: "expiresAt",
      type: "date",
      required: true,
    },
    {
      name: "attempts",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "sessionToken",
      type: "text",
      admin: { hidden: true },
    },
  ],
};

const PasswordReset: CollectionConfig = {
  slug: "password-resets",
  admin: { hidden: true },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: "userId",
      type: "text",
      required: true,
    },
    {
      name: "tokenHash",
      type: "text",
      required: true,
    },
    {
      name: "expiresAt",
      type: "date",
      required: true,
    },
    {
      name: "used",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

const Review: CollectionConfig = {
  slug: "reviews",
  admin: {
    components: { edit: { beforeDocumentControls: ["@/components/admin/shared/GoBackButton"] } },
    useAsTitle: "author",
    defaultColumns: ["author", "text", "location", "createdAt"],
    listSearchableFields: ["author", "text", "location"],
  },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageSettings,
  },
  hooks: {
    afterChange: [revalidateReviews, auditLogAfterChange],
    afterDelete: [auditLogAfterDelete],
  },
  fields: [
    {
      name: "text",
      type: "textarea",
      required: true,
      admin: { description: "The customer's review text." },
    },
    {
      name: "author",
      type: "text",
      required: true,
      admin: { description: "Customer name (e.g. \"Shruthi\")." },
    },
    {
      name: "location",
      type: "text",
      admin: { description: "Customer location (e.g. \"Kodambakkam\")." },
    },
  ],
};

const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  access: {
    read: publicRead,
    update: canManageSettings,
  },
  hooks: { afterChange: [revalidateSiteSettings, auditLogGlobalAfterChange] },
  fields: [
    {
      label: "Site Settings",
      type: "tabs",
      tabs: [
        // ─── Homepage ─────────────────────────────────────────────
        {
          label: "Homepage",
          fields: [
            {
              name: "heroSlides",
              type: "array",
              label: "Hero Slides",
              fields: [
                { name: "heading", type: "text", required: true },
                { name: "description", type: "textarea" },
                { name: "ctaText", type: "text", defaultValue: "EXPLORE" },
                { name: "ctaHref", type: "text", defaultValue: "/products" },
                { name: "image", type: "upload", relationTo: "media" },
              ],
            },
            {
              name: "categories",
              type: "array",
              label: "Category Cards",
              fields: [
                { name: "title", type: "text", required: true },
                { name: "description", type: "textarea" },
                { name: "image", type: "upload", relationTo: "media" },
                { name: "ctaText", type: "text" },
                { name: "ctaHref", type: "text" },
                { name: "variant", type: "text", admin: { description: "gold, silver, diamond, or platinum" } },
              ],
            },
            {
              name: "bestsellerProducts",
              type: "relationship",
              relationTo: "products",
              hasMany: true,
              label: "Bestsellers",
              admin: { description: "Select products to feature as bestsellers on the homepage." },
            },
            {
              name: "features",
              type: "blocks",
              label: "Features Section",
              blocks: [
                {
                  slug: "circleBanner",
                  labels: { singular: "Feature", plural: "Features" },
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "description", type: "textarea" },
                    { name: "image", type: "upload", relationTo: "media" },
                    { name: "alt", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        // ─── Content ──────────────────────────────────────────────
        {
          label: "Content",
          fields: [
            {
              name: "banners",
              type: "blocks",
              label: "Banners",
              blocks: [
                {
                  slug: "imageBanner",
                  labels: { singular: "Image Banner", plural: "Image Banners" },
                  fields: [
                    { name: "image", type: "upload", relationTo: "media" },
                    { name: "alt", type: "text" },
                    { name: "title", type: "text" },
                    { name: "ctaText", type: "text" },
                    { name: "href", type: "text" },
                  ],
                },
              ],
            },
            {
              name: "heritage",
              type: "array",
              label: "Heritage",
              fields: [
                { name: "heading", type: "text" },
                { name: "description", type: "textarea" },
                { name: "image", type: "upload", relationTo: "media" },
              ],
            },
            {
              name: "aboutPage",
              type: "group",
              label: "About Page",
              fields: [
                {
                  name: "goldenOccasions",
                  type: "group",
                  fields: [
                    { name: "heading", type: "text", defaultValue: "Golden Occasions & Gleaming Beginnings" },
                    { name: "paragraphs", type: "array", fields: [{ name: "text", type: "textarea" }] },
                    { name: "image", type: "upload", relationTo: "media" },
                    { name: "alt", type: "text", defaultValue: "About Kerala Jewellers" },
                  ],
                },
                {
                  name: "tasteMeetsTradition",
                  type: "group",
                  fields: [
                    { name: "heading", type: "text", defaultValue: "Taste Meets Tradition" },
                    { name: "text", type: "textarea" },
                  ],
                },
                {
                  name: "origins",
                  type: "group",
                  fields: [
                    { name: "heading", type: "text", defaultValue: "The Origins" },
                    { name: "intro", type: "textarea" },
                  ],
                },
                {
                  name: "timeline",
                  type: "array",
                  label: "Timeline",
                  fields: [
                    { name: "year", type: "text", required: true },
                    { name: "title", type: "text", required: true },
                    { name: "text", type: "textarea", required: true },
                    { name: "image", type: "upload", relationTo: "media" },
                  ],
                },
                {
                  name: "ventures",
                  type: "group",
                  fields: [
                    { name: "heading", type: "text", defaultValue: "Our Ventures" },
                    { name: "subheading", type: "text", defaultValue: "Our Dedicated Wedding Hall" },
                    { name: "image", type: "upload", relationTo: "media" },
                    { name: "alt", type: "text" },
                    { name: "bullets", type: "array", fields: [{ name: "text", type: "textarea" }] },
                    { name: "cta1Text", type: "text", defaultValue: "Know More About Us" },
                    { name: "cta1Href", type: "text", defaultValue: "https://www.ayswariyamahal.com/" },
                    { name: "cta2Text", type: "text", defaultValue: "Find Us" },
                    { name: "cta2Href", type: "text", defaultValue: "https://maps.app.goo.gl/vP759GxjSJLK4oU88" },
                  ],
                },
              ],
            },
          ],
        },
        // ─── Footer & Contact Details ────────────────────────────────
        {
          label: "Footer & Contact Details",
          fields: [
            {
              name: "branches",
              type: "array",
              label: "Branches",
              fields: [
                { name: "name", type: "text", admin: { description: 'e.g. "Pondy Bazaar"' } },
                { name: "address", type: "textarea" },
                { name: "phone", type: "text", admin: { description: 'Display phone (e.g. "98400 88324")' } },
                { name: "phoneFull", type: "text", admin: { description: 'Raw digits for tel: links (e.g. "9840088324")' } },
                { name: "email", type: "text" },
                { name: "hours", type: "text", admin: { description: 'e.g. "Mon–Sat: 10 AM – 8 PM"' } },
                { name: "mapQ", type: "text", admin: { description: 'Google Maps query (e.g. "Kerala+Jewellers+Pondy+Bazaar+Chennai")' } },
                { name: "mapEmbedUrl", type: "text", admin: { description: "Full Google Maps embed URL (optional)" } },
              ],
            },
            {
              name: "phone",
              type: "text",
              label: "Contact Phone",
            },
            {
              name: "whatsapp",
              type: "text",
              label: "WhatsApp Number",
            },
            {
              name: "email",
              type: "text",
              label: "Contact Email",
            },
            {
              name: "storeTiming",
              type: "text",
              label: "Store Timing",
            },
            {
              name: "footerAbout",
              type: "textarea",
              label: "Footer About Text",
            },
            {
              name: "instagramUrl",
              type: "text",
              label: "Instagram URL",
            },
            {
              name: "facebookUrl",
              type: "text",
              label: "Facebook URL",
            },
            {
              name: "youtubeUrl",
              type: "text",
              label: "YouTube URL",
            },
          ],
        },
        // ─── Pages ─────────────────────────────────────────────────
        {
          label: "Pages",
          fields: [
            {
              name: "homepageSections",
              type: "group",
              label: "Homepage Section Headers",
              fields: [
                { name: "bestsellersTitle", type: "text", defaultValue: "Our Bestsellers" },
                { name: "bestsellersSubtitle", type: "textarea", defaultValue: "Choose from among trendy designs and timeless pieces. There's something for everyone and every occasion." },
                { name: "latestTitle", type: "text", defaultValue: "Our Latest" },
                { name: "latestSubtitle", type: "textarea", defaultValue: "Check out some of the latest designs in our ever-expanding collection." },
                { name: "reviewsTitle", type: "text", defaultValue: "Customer Reviews" },
                { name: "reviewsSubtitle", type: "textarea", defaultValue: "Our Jewelry Isn't Just Worn. It's Cherished. Each Piece Tells A Story, And You Can Hear It From Our Customers Who Wear Theirs With Pride." },
              ],
            },
            {
              name: "blogPage",
              type: "group",
              label: "Blog Page",
              fields: [
                { name: "promoHeading", type: "text", defaultValue: "Wedding Season is here" },
                { name: "promoDescription", type: "textarea", defaultValue: "Embrace the magic of the wedding season with our exquisite jewellery collection. Elevate your bridal ensemble or find the perfect gift for the happy couple with our stunning array of wedding-ready pieces." },
                { name: "promoCtaText", type: "text", defaultValue: "Shop Now" },
                { name: "promoCtaHref", type: "text", defaultValue: "/products" },
                { name: "promoImage", type: "upload", relationTo: "media" },
                { name: "headerTitle", type: "text", defaultValue: "Our Blog" },
                { name: "headerSubtitle", type: "textarea", defaultValue: "From Shopping Guides To Lifestyle Recommendations, Explore Our Blog And Learn Everything You Need To Know About Jewellery." },
                { name: "emptyText", type: "textarea", defaultValue: "Blog posts coming soon. Stay tuned for shopping guides, lifestyle tips, and everything about jewellery." },
              ],
            },
            {
              name: "contactPage",
              type: "group",
              label: "Contact Page",
              fields: [
                { name: "heroTitle", type: "text", defaultValue: "Contact Kerala Jewellers" },
                { name: "heroSubtitle", type: "textarea", defaultValue: "We're here to help you with store visits, jewellery enquiries, custom designs, and service support." },
                { name: "cardTitle", type: "text", defaultValue: "Get In Touch" },
                { name: "cardDescription", type: "textarea", defaultValue: "Looking for a specific jewellery design, bridal collection, custom order, or gold/silver rate update? Our team will guide you with product availability, store visit support, and purchase assistance." },
                { name: "cardItems", type: "array", fields: [{ name: "text", type: "text" }] },
                { name: "cardQuote", type: "text", defaultValue: "Send us a message and our team will get back to you shortly." },
                { name: "branchesTitle", type: "text", defaultValue: "Our Branches" },
              ],
            },
            {
              name: "productsPage",
              type: "group",
              label: "Products Page",
              fields: [
                {
                  name: "goldHero",
                  type: "group",
                  fields: [
                    { name: "title", type: "text", defaultValue: "Elegant & Timeless Gold Jewellery" },
                    { name: "subtitle", type: "textarea", defaultValue: "Discover our exclusive collection of gold jewellery that stands the test of time. Perfect for every occasion." },
                  ],
                },
                {
                  name: "silverHero",
                  type: "group",
                  fields: [
                    { name: "title", type: "text", defaultValue: "Classic Elegance in Silver" },
                    { name: "subtitle", type: "textarea", defaultValue: "Explore our collection of timeless silver jewellery. Perfectly crafted for every moment." },
                  ],
                },
                {
                  name: "diamondHero",
                  type: "group",
                  fields: [
                    { name: "title", type: "text", defaultValue: "Timeless Brilliance in Diamonds" },
                    { name: "subtitle", type: "textarea", defaultValue: "Discover our exquisite collection of diamond jewellery, crafted to perfection for every occasion." },
                  ],
                },
                {
                  name: "platinumHero",
                  type: "group",
                  fields: [
                    { name: "title", type: "text", defaultValue: "Exquisite Platinum Jewellery" },
                    { name: "subtitle", type: "textarea", defaultValue: "Explore our refined collection of platinum jewellery, crafted for those who appreciate understated luxury." },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // Metal Rates — managed via the dedicated /update-rates view; hidden here to declutter the global editor.
    {
      name: "rateUpdated",
      type: "date",
      label: "Rates Updated Date",
      admin: {
        date: { pickerAppearance: "dayOnly", displayFormat: "dd-MM-yyyy" },
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (operation === "update" || !value) {
              return new Date().toISOString();
            }
            return value;
          },
        ],
      },
    },
    { name: "rateGold22", type: "text", admin: { hidden: true } },
    { name: "rateGold18", type: "text", admin: { hidden: true } },
    { name: "rateSilver", type: "text", admin: { hidden: true } },
    { name: "ratePlatinum", type: "text", admin: { hidden: true } },
  ],
};

const postgresPoolMax = Number(process.env.POSTGRES_POOL_MAX || 3);

export default buildConfig({
  secret: requireProductionSecret(),
  routes: {
    admin: ADMIN_PATH,
  },
  sharp,
  db: usePostgres
    ? postgresAdapter({
        pg:
          process.env.NODE_ENV === "production"
            ? (neonServerless as unknown as typeof import("pg"))
            : undefined,
        pool: {
          connectionString: cleanDatabaseUrl(resolvedDbUrl),
          max: Number.isFinite(postgresPoolMax) && postgresPoolMax > 0
            ? postgresPoolMax
            : 3,
          idleTimeoutMillis: 5000,
          connectionTimeoutMillis: 30000,
          allowExitOnIdle: true,
          ...(process.env.NODE_ENV === "production"
            ? { ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" } }
            : {}),
        },
        push: process.env.PAYLOAD_DB_PUSH === "true",
      })
    : sqliteAdapter({
        client: {
          url: resolvedDbUrl || process.env.DATABASE_URI || "file:./dev.db",
        },
        push: process.env.NODE_ENV !== "production",
      }),
  collections: [
    AdminUsers,
    Media,
    Product,
    Category,
    BlogPost,
    LegalPage,
    Inquiry,
    RateLimit,
    AuditLog,
    LoginOtp,
    PasswordReset,
    Review,
  ],
  globals: [SiteSettings],
  admin: {
    user: "admin-users" as never,
    meta: {
      icons: [
        {
          rel: "icon",
          type: "image/png",
          url: "/assets/logo/kj-favicon-transparent.png",
        },
      ],
    },
    components: {
      Nav: "@/components/admin/sidebar/AdminSidebarServer",
      graphics: {
        Icon: "@/components/admin/shared/AdminLogo",
        Logo: "@/components/admin/shared/AdminLogo",
      },
      views: {
        dashboard: {
          Component: "@/components/admin/dashboard/DashboardNew",
        },
        login: {
          Component: "@/components/admin/login/CustomLogin",
        },
        "update-rates": {
          Component: "@/components/admin/rates/UpdateRatesServer",
          path: "/update-rates",
        },
        pages: {
          Component: "@/components/admin/pages/PagesViewServer",
          path: "/pages",
          exact: true,
        },
      },
    },
    importMap: {
      importMapFile: path.resolve(
        process.cwd(),
        "app/(payload)/admin/importMap.ts",
      ),
    },
  },
  graphQL: { disable: true },
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY || "",
    defaultFromAddress: "enquiry@mail.keralajewellers.in",
    defaultFromName: "Kerala Jewellers",
  }),
  typescript: {
    outputFile: path.resolve(process.cwd(), "payload-types.ts"),
  },
});
