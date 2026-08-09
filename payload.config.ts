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
import path from "path";
import { revalidatePath } from "next/cache";
import { clearSiteSettingsCache } from "./lib/data/cms";
import {
  auditLogAfterChange,
  auditLogAfterDelete,
  auditLogAfterLogin,
  auditLogGlobalAfterChange,
} from "./lib/auditLogHooks";
import {
  adminRoles,
  canManageContent,
  canManageInquiries,
  canManageSettings,
  canReadAuditLogs,
  canReadMedia,
  isAuthenticated,
  isSuperAdmin,
  isAdmin,
  canDeleteAdminUsers,
  adminRoleFieldAccess,
  adminIsActiveFieldAccess,
  enforceAdminRoleRestrictions,
  enforceAccountLimit,
  validateAdminPassword,
} from "./lib/payload/security";
import {
  cloudinaryUploadHook,
  cloudinaryDeleteHook,
} from "./lib/cloudinaryUploadHook";

const canReadProtectedField = ({
  req,
}: {
  req: Parameters<typeof canManageSettings>[0]["req"];
}) => Boolean(canManageSettings({ req }));

const revalidateProduct: CollectionAfterChangeHook = async ({ doc }) => {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/gold");
  revalidatePath("/products/silver");
  revalidatePath("/products/diamond");
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

const revalidateSiteSettings: GlobalAfterChangeHook = () => {
  clearSiteSettingsCache();
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/gold");
  revalidatePath("/products/silver");
  revalidatePath("/products/diamond");
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
  ],
} as const;

const usePostgres =
  Boolean(process.env.DATABASE_URL) &&
  (process.env.NODE_ENV === "production" ||
    process.env.PAYLOAD_DATABASE_ADAPTER === "postgres");

// Strip channel_binding from Neon URL (Vercel integration adds it; pg driver doesn't support it and it adds latency)
function cleanDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  const cleaned = url
    .replace(/&channel_binding=require/, "")
    .replace(/\?channel_binding=require&/, "?")
    .replace(/\?channel_binding=require$/, "");
  return cleaned;
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
  admin: { useAsTitle: "alt" },
  access: {
    read: canReadMedia,
    create: canManageContent,
    update: canManageContent,
    delete: canManageSettings,
  },
  hooks: {
    afterChange: [cloudinaryUploadHook, auditLogAfterChange],
    afterDelete: [cloudinaryDeleteHook, auditLogAfterDelete],
  },
  upload: {
    staticDir: process.env.MEDIA_DIR || "public/media",
    mimeTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ],
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 400,
        position: "centre",
      },
      {
        name: "card",
        width: 800,
        height: 600,
        position: "centre",
      },
      {
        name: "hero",
        width: 1920,
        height: 1080,
        position: "centre",
      },
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
    { name: "caption", type: "text" },
    {
      name: "mediaType",
      type: "select",
      options: [
        { label: "Product", value: "product" },
        { label: "Category", value: "category" },
        { label: "Banner", value: "banner" },
        { label: "Gallery", value: "gallery" },
        { label: "Blog", value: "blog" },
        { label: "Heritage", value: "heritage" },
        { label: "Timeline", value: "timeline" },
        { label: "Campaign", value: "campaign" },
        { label: "Store", value: "store" },
        { label: "Collection", value: "collection" },
      ],
    },
    {
      name: "cloudinaryPublicId",
      type: "text",
      admin: {
        readOnly: true,
        description: "Cloudinary public ID (auto-set on upload)",
      },
    },
  ],
};

const AdminUsers: CollectionConfig = {
  slug: "admin-users",
  auth: {
    tokenExpiration: 60 * 60 * 8,
    cookies: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    },
  },
  admin: { useAsTitle: "username" },
  hooks: {
    beforeValidate: [
      enforceAdminRoleRestrictions,
      enforceAccountLimit,
      ({ data }) => {
        const password = data?.password;
        if (typeof password === "string") {
          const result = validateAdminPassword(password, data);
          if (result !== true) {
            throw new ValidationError({
              collection: "admin-users",
              errors: [{ message: `Password: ${result}`, path: "name" }],
            });
          }
        }
        return data;
      },
    ],
    afterChange: [auditLogAfterChange],
    afterDelete: [auditLogAfterDelete],
    afterLogin: [auditLogAfterLogin],
  },
  access: {
    read: isAdmin,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: canDeleteAdminUsers,
  },
  fields: [
    { name: "name", type: "text", required: true },
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
      name: "role",
      type: "select",
      required: true,
      defaultValue: "enquiry-manager",
      options: adminRoles.map((role) => ({ label: role, value: role })),
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
  ],
};

const Product: CollectionConfig = {
  slug: "products",
  admin: { useAsTitle: "title" },
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
      required: true,
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
      name: "imageSrcset",
      type: "text",
      admin: {
        description:
          "Optional. Leave blank to auto-use the main image for all sizes.",
      },
    },
    { name: "availability", type: "checkbox", defaultValue: true },
    {
      name: "priceMode",
      type: "select",
      defaultValue: "on-request",
      options: [
        { label: "Fixed", value: "fixed" },
        { label: "Starting From", value: "starting-from" },
        { label: "On Request", value: "on-request" },
      ],
    },
    { name: "price", type: "number" },
    { name: "featured", type: "checkbox", defaultValue: false },
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
  admin: { useAsTitle: "name" },
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
      required: true,
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
    {
      name: "seo",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description:
              "Custom meta title for this category page (defaults to category name). Recommended: 50–60 characters.",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description:
              "Meta description for search engines (defaults to category name + metal). Recommended: 120–160 characters.",
          },
        },
      ],
    },
  ],
};

const BlogPost: CollectionConfig = {
  slug: "blog-posts",
  admin: { useAsTitle: "title" },
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
  admin: { useAsTitle: "title", group: "Content" },
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
  admin: { useAsTitle: "name" },
  access: {
    read: canManageInquiries,
    create: ({ req: { user } }) => !user,
    update: canManageInquiries,
    delete: canManageSettings,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "text", required: true },
    { name: "phone", type: "text" },
    { name: "message", type: "textarea" },
    { name: "product", type: "relationship", relationTo: "products" },
    { name: "sourcePage", type: "text" },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: ["new", "contacted", "closed", "spam"],
    },
    {
      name: "emailNotificationStatus",
      type: "select",
      defaultValue: "not-sent",
      options: ["not-sent", "sent", "failed"],
    },
    {
      name: "submittedIp",
      type: "text",
      admin: { readOnly: true },
      access: { read: canReadProtectedField },
    },
    {
      name: "submittedAt",
      type: "date",
      defaultValue: () => new Date().toISOString(),
    },
  ],
};

const RateLimit: CollectionConfig = {
  slug: "rate-limits",
  admin: { hidden: true },
  access: {
    read: canReadAuditLogs,
    create: () => true,
    update: () => true,
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
                { name: "ctaText", type: "text" },
                { name: "ctaHref", type: "text" },
                { name: "variant", type: "text", admin: { description: "gold, silver, diamond, or platinum" } },
              ],
            },
            {
              name: "bestsellerProducts",
              type: "text",
              label: "Bestsellers",
              admin: { description: "Comma-separated product slugs (e.g. bombay-choker,kerala-bangles,diamond-choker-kjd005)" },
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
              name: "reviews",
              type: "array",
              label: "Reviews",
              fields: [
                { name: "text", type: "textarea", required: true },
                { name: "author", type: "text", required: true },
                { name: "location", type: "text" },
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
        // ─── Business ─────────────────────────────────────────────
        {
          label: "Business",
          fields: [
            {
              name: "rateGold22",
              type: "text",
              label: "Gold 22K Rate",
              admin: { description: "Number only, e.g. 7,450" },
            },
            {
              name: "rateGold18",
              type: "text",
              label: "Gold 18K Rate",
              admin: { description: "Number only, e.g. 6,080" },
            },
            {
              name: "rateSilver",
              type: "text",
              label: "Silver Rate",
              admin: { description: "Number only, e.g. 92" },
            },
            {
              name: "ratePlatinum",
              type: "text",
              label: "Platinum Rate",
              admin: { description: "Number only, e.g. 3,890" },
            },
            {
              name: "rateUpdated",
              type: "text",
              label: "Rates Updated Date",
              admin: { description: "e.g. 27-06-2026" },
            },
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
        // ─── SEO ──────────────────────────────────────────────────
        {
          label: "SEO",
          fields: [
            {
              name: "defaultSeo",
              type: "group",
              fields: [
                {
                  name: "title",
                  type: "text",
                  admin: { description: "Site-wide default meta title. Recommended: 50–60 characters." },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: { description: "Site-wide default meta description. Recommended: 150–160 characters." },
                },
                {
                  name: "ogImage",
                  type: "upload",
                  relationTo: "media",
                  admin: { description: "Default OG image. Recommended: 1200×630px." },
                },
              ],
            },
          ],
        },
        // ─── Design ───────────────────────────────────────────────
        {
          label: "Design",
          fields: [
            {
              name: "fontPairing",
              type: "select",
              defaultValue: "classic-luxury",
              label: "Font Pairing",
              options: [
                { label: "Classic Luxury — Com 4 DL / Mulish / Montserrat", value: "classic-luxury" },
                { label: "Modern Elegant — Playfair Display / Inter / Montserrat", value: "modern-elegant" },
                { label: "Timeless — Georgia / Mulish / Open Sans", value: "timeless" },
                { label: "Contemporary — Montserrat / Inter / Montserrat", value: "contemporary" },
                { label: "Traditional — Cormorant Garamond / Mulish / Open Sans", value: "traditional" },
                { label: "Bold Statement — Com 4 DL / Montserrat / Montserrat", value: "bold-statement" },
              ],
            },
            {
              name: "headingFont",
              type: "text",
              admin: { description: "Auto-set by pairing, or enter custom font name" },
            },
            {
              name: "bodyFont",
              type: "text",
              admin: { description: "Auto-set by pairing, or enter custom font name" },
            },
            {
              name: "uiFont",
              type: "text",
              admin: { description: "Auto-set by pairing, or enter custom font name" },
            },
            {
              name: "baseFontSize",
              type: "select",
              defaultValue: "16px",
              options: [
                { label: "14px (Small)", value: "14px" },
                { label: "16px (Default)", value: "16px" },
                { label: "18px (Large)", value: "18px" },
              ],
            },
            {
              name: "headingScale",
              type: "select",
              defaultValue: "1.25",
              options: [
                { label: "1.2 (Compact)", value: "1.2" },
                { label: "1.25 (Default)", value: "1.25" },
                { label: "1.333 (Golden Ratio)", value: "1.333" },
                { label: "1.5 (Spacious)", value: "1.5" },
              ],
            },
            {
              name: "customFonts",
              type: "textarea",
              admin: {
                description: 'Custom @font-face CSS declarations. One per line.\nfont-family: "My Font";\nsrc: url("/assets/fonts/myfont.woff2") format("woff2");',
              },
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
                { name: "formTitle", type: "text", defaultValue: "Send Us a Message" },
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
              ],
            },
          ],
        },
      ],
    },
  ],
};

export default buildConfig({
  secret: requireProductionSecret(),
  sharp,
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: cleanDatabaseUrl(process.env.DATABASE_URL),
          max: 5,
          idleTimeoutMillis: 10000,
          connectionTimeoutMillis: 15000,
          ...(process.env.NODE_ENV === "production"
            ? { ssl: { rejectUnauthorized: false } }
            : {}),
        },
        push: false,
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URI || "file:./dev.db",
        },
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
      beforeDashboard: [
        { path: "@/components/admin/DashboardNew", exportName: "default" },
      ],
      Nav: "@/components/admin/AdminSidebarServer",
      graphics: {
        Icon: "@/components/admin/AdminLogo",
        Logo: "@/components/admin/AdminLogo",
      },
      views: {
        login: {
          Component: "@/components/admin/CustomLogin",
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
  plugins: [],
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY || "",
    defaultFromAddress: "enquiry@mail.keralajewellers.in",
    defaultFromName: "Kerala Jewellers",
  }),
  typescript: {
    outputFile: path.resolve(process.cwd(), "payload-types.ts"),
  },
});
