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
import { resendAdapter } from "@payloadcms/email-resend";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import path from "path";
import { revalidatePath } from "next/cache";
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
  canCreateAdminUsers,
  canUpdateAdminUsers,
  canDeleteAdminUsers,
  adminRoleFieldAccess,
  adminIsActiveFieldAccess,
  enforceAdminRoleRestrictions,
  validateAdminPassword,
} from "./lib/payload/security.ts";
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
  if (process.env.NODE_ENV === "production" && !process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET is required in production.");
  }
  return (
    process.env.PAYLOAD_SECRET || "local-dev-secret-change-before-deploying"
  );
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
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
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
        { label: "Banner", value: "banner" },
        { label: "Content", value: "content" },
      ],
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
  admin: { useAsTitle: "email" },
  hooks: {
    beforeValidate: [
      enforceAdminRoleRestrictions,
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
    read: () => true,
    create: canCreateAdminUsers,
    update: canUpdateAdminUsers,
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
    {
      name: "emailOtp",
      type: "text",
      admin: { hidden: true },
    },
    {
      name: "emailOtpExpires",
      type: "date",
      admin: { hidden: true },
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
    },
    { name: "code", type: "text" },
    { name: "metal", type: "select", options: [...metalSelect.options] },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      filterOptions: ({ siblingData }) => {
        const metal = (siblingData as Record<string, unknown>)?.metal;
        if (!metal) return true;
        return { metal: { equals: metal } };
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
  admin: { useAsTitle: "title" },
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
    create: () => true,
    update: () => true,
    delete: () => true,
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
    create: () => true,
    update: () => true,
    delete: () => true,
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
      label: "Rates",
      type: "tabs",
      tabs: [
        {
          label: "Metal Rates",
          fields: [
            {
              name: "rateGold22",
              type: "text",
              admin: { description: "Number only, e.g. 7,450" },
            },
            {
              name: "rateGold18",
              type: "text",
              admin: { description: "Number only, e.g. 6,080" },
            },
            {
              name: "rateSilver",
              type: "text",
              admin: { description: "Number only, e.g. 92" },
            },
            {
              name: "ratePlatinum",
              type: "text",
              admin: { description: "Number only, e.g. 3,890" },
            },
            {
              name: "rateUpdated",
              type: "text",
              admin: { description: "e.g. 27-06-2026" },
            },
          ],
        },
        {
          label: "Hero Slides",
          fields: [
            {
              name: "heroSlides",
              type: "array",
              fields: [
                { name: "heading", type: "text" },
                { name: "description", type: "textarea" },
                { name: "ctaText", type: "text", defaultValue: "EXPLORE" },
                { name: "ctaHref", type: "text", defaultValue: "/products" },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  admin: { description: "Slide background image" },
                },
              ],
            },
          ],
        },
        {
          label: "Reviews",
          fields: [
            {
              name: "reviews",
              type: "array",
              fields: [
                { name: "text", type: "textarea", required: true },
                { name: "author", type: "text", required: true },
                { name: "location", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Banners",
          fields: [
            {
              name: "banners",
              type: "blocks",
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
                {
                  slug: "textBanner",
                  labels: { singular: "Text Banner", plural: "Text Banners" },
                  fields: [
                    { name: "heading", type: "text", required: true },
                    { name: "description", type: "textarea" },
                    { name: "ctaText", type: "text" },
                    { name: "ctaLink", type: "text" },
                    {
                      name: "bgColor",
                      type: "text",
                      admin: { description: "CSS color value, e.g. #991f23" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Features",
          fields: [
            {
              name: "features",
              type: "blocks",
              blocks: [
                {
                  slug: "circleBanner",
                  labels: {
                    singular: "Circle Banner",
                    plural: "Circle Banners",
                  },
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "description", type: "textarea" },
                    { name: "image", type: "upload", relationTo: "media" },
                    { name: "alt", type: "text" },
                  ],
                },
                {
                  slug: "rectangleBanner",
                  labels: {
                    singular: "Rectangle Banner",
                    plural: "Rectangle Banners",
                  },
                  fields: [
                    { name: "heading", type: "text", required: true },
                    { name: "description", type: "textarea" },
                    { name: "image", type: "upload", relationTo: "media" },
                    { name: "ctaText", type: "text", defaultValue: "Explore" },
                    {
                      name: "ctaLink",
                      type: "text",
                      defaultValue: "/products",
                    },
                    { name: "alt", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Heritage",
          fields: [
            {
              name: "heritage",
              type: "array",
              fields: [
                { name: "heading", type: "text" },
                { name: "description", type: "textarea" },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  admin: { description: "Heritage section image" },
                },
                { name: "srcSet", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Categories",
          fields: [
            {
              name: "categories",
              type: "array",
              fields: [
                { name: "title", type: "text" },
                { name: "description", type: "textarea" },
                { name: "ctaText", type: "text" },
                { name: "ctaHref", type: "text" },
                {
                  name: "variant",
                  type: "text",
                  admin: { description: "gold, silver, diamond, or platinum" },
                },
              ],
            },
          ],
        },
        {
          label: "Branches",
          fields: [
            {
              name: "branches",
              type: "array",
              fields: [
                {
                  name: "name",
                  type: "text",
                  admin: {
                    description: 'Branch display name (e.g. "Pondy Bazaar")',
                  },
                },
                {
                  name: "address",
                  type: "textarea",
                  admin: {
                    description:
                      "Full street address shown on Contact page and Footer",
                  },
                },
                {
                  name: "phone",
                  type: "text",
                  admin: { description: 'Display phone (e.g. "98400 88324")' },
                },
                {
                  name: "phoneFull",
                  type: "text",
                  admin: {
                    description:
                      'Raw digits for tel: links (e.g. "9840088324")',
                  },
                },
                {
                  name: "email",
                  type: "text",
                  admin: { description: "Branch email address (optional)" },
                },
                {
                  name: "hours",
                  type: "text",
                  admin: {
                    description: 'Store hours (e.g. "Mon–Sat: 10 AM – 8 PM")',
                  },
                },
                {
                  name: "mapQ",
                  type: "text",
                  admin: {
                    description:
                      'Google Maps query string for "Get Directions" link (e.g. "Kerala+Jewellers+Pondy+Bazaar+Chennai")',
                  },
                },
                {
                  name: "mapEmbedUrl",
                  type: "text",
                  admin: {
                    description:
                      "Full Google Maps embed URL for the iframe. Go to Google Maps → Share → Embed → copy the src URL. Falls back to mapQ-based embed if empty.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            { name: "footerAbout", type: "textarea" },
            { name: "instagramUrl", type: "text" },
            { name: "facebookUrl", type: "text" },
            { name: "youtubeUrl", type: "text" },
            { name: "phone", type: "text" },
            { name: "whatsapp", type: "text" },
            { name: "email", type: "text" },
            { name: "storeTiming", type: "text" },
          ],
        },
        {
          label: "Bestsellers",
          fields: [
            {
              name: "bestsellerProducts",
              type: "text",
              admin: {
                description:
                  "Comma-separated product slugs (e.g. idols-5,personalised-ring-2,necklace-4)",
              },
            },
          ],
        },
        {
          label: "About Page",
          fields: [
            {
              name: "aboutPage",
              type: "group",
              fields: [
                {
                  name: "goldenOccasions",
                  type: "group",
                  fields: [
                    {
                      name: "heading",
                      type: "text",
                      defaultValue: "Golden Occasions & Gleaming Beginnings",
                    },
                    {
                      name: "paragraphs",
                      type: "array",
                      fields: [{ name: "text", type: "textarea" }],
                    },
                    { name: "image", type: "upload", relationTo: "media" },
                    {
                      name: "alt",
                      type: "text",
                      defaultValue: "About Kerala Jewellers",
                    },
                  ],
                },
                {
                  name: "tasteMeetsTradition",
                  type: "group",
                  fields: [
                    {
                      name: "heading",
                      type: "text",
                      defaultValue: "Taste Meets Tradition",
                    },
                    { name: "text", type: "textarea" },
                  ],
                },
                {
                  name: "origins",
                  type: "group",
                  fields: [
                    {
                      name: "heading",
                      type: "text",
                      defaultValue: "The Origins",
                    },
                    { name: "intro", type: "textarea" },
                  ],
                },
                {
                  name: "timeline",
                  type: "array",
                  fields: [
                    { name: "year", type: "text", required: true },
                    { name: "title", type: "text", required: true },
                    { name: "text", type: "textarea", required: true },
                    {
                      name: "image",
                      type: "text",
                      admin: {
                        description: "Path to image in /assets/images/",
                      },
                    },
                  ],
                },
                {
                  name: "ventures",
                  type: "group",
                  fields: [
                    {
                      name: "heading",
                      type: "text",
                      defaultValue: "Our Ventures",
                    },
                    {
                      name: "subheading",
                      type: "text",
                      defaultValue: "Our Dedicated Wedding Hall",
                    },
                    {
                      name: "image",
                      type: "text",
                      admin: {
                        description: "Path to image in /assets/images/",
                      },
                    },
                    { name: "alt", type: "text" },
                    {
                      name: "bullets",
                      type: "array",
                      fields: [{ name: "text", type: "textarea" }],
                    },
                    {
                      name: "cta1Text",
                      type: "text",
                      defaultValue: "Know More About Us",
                    },
                    {
                      name: "cta1Href",
                      type: "text",
                      defaultValue: "https://www.ayswariyamahal.com/",
                    },
                    { name: "cta2Text", type: "text", defaultValue: "Find Us" },
                    {
                      name: "cta2Href",
                      type: "text",
                      defaultValue: "https://maps.app.goo.gl/vP759GxjSJLK4oU88",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Default SEO",
          fields: [
            {
              name: "defaultSeo",
              type: "group",
              fields: [
                {
                  name: "title",
                  type: "text",
                  admin: {
                    description:
                      "Site-wide default meta title (used when a page has no specific SEO title). Recommended: 50–60 characters.",
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: {
                    description:
                      "Site-wide default meta description (used when a page has no specific description). Recommended: 150–160 characters.",
                  },
                },
                {
                  name: "ogImage",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Site-wide default OG image (used when a page has no specific OG image). Recommended: 1200×630px.",
                  },
                },
              ],
            },
          ],
        },
        {
          label: "Typography",
          fields: [
            {
              name: "fontPairing",
              type: "select",
              defaultValue: "classic-luxury",
              options: [
                {
                  label: "Classic Luxury — Com 4 DL / Mulish / Montserrat",
                  value: "classic-luxury",
                },
                {
                  label:
                    "Modern Elegant — Playfair Display / Inter / Montserrat",
                  value: "modern-elegant",
                },
                {
                  label: "Timeless — Georgia / Mulish / Open Sans",
                  value: "timeless",
                },
                {
                  label: "Contemporary — Montserrat / Inter / Montserrat",
                  value: "contemporary",
                },
                {
                  label:
                    "Traditional — Cormorant Garamond / Mulish / Open Sans",
                  value: "traditional",
                },
                {
                  label: "Bold Statement — Com 4 DL / Montserrat / Montserrat",
                  value: "bold-statement",
                },
              ],
              admin: {
                description:
                  "Pre-defined font pairings for headings, body, and UI. Select one to auto-configure all three.",
              },
            },
            {
              name: "headingFont",
              type: "text",
              admin: {
                description:
                  "Heading font (auto-set by pairing, or enter custom)",
              },
            },
            {
              name: "bodyFont",
              type: "text",
              admin: {
                description: "Body font (auto-set by pairing, or enter custom)",
              },
            },
            {
              name: "uiFont",
              type: "text",
              admin: {
                description: "UI font (auto-set by pairing, or enter custom)",
              },
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
              admin: { description: "Base font size for body text" },
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
              admin: {
                description: "Scale factor between heading levels (h1→h2→h3)",
              },
            },
            {
              name: "customFonts",
              type: "textarea",
              admin: {
                description:
                  'Additional @font-face declarations (CSS). One per line. Example:\nfont-family: "My Font";\nsrc: url("/assets/fonts/myfont.woff2") format("woff2");',
              },
            },
          ],
        },
      ],
    },
  ],
};

export default buildConfig({
  secret: requireProductionSecret(),
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: cleanDatabaseUrl(process.env.DATABASE_URL),
          max: 5,
          idleTimeoutMillis: 10000,
          connectionTimeoutMillis: 15000,
          ssl: { rejectUnauthorized: false },
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
        { path: "@/components/admin/DashboardStats", exportName: "default" },
      ],
      Nav: "@/components/admin/CustomNav",
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
