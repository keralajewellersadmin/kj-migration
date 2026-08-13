import {
  buildConfig,
  ValidationError,
  type CollectionConfig,
  type GlobalConfig,
  type CollectionAfterChangeHook,
  type CollectionAfterDeleteHook,
  type CollectionBeforeValidateHook,
  type CollectionBeforeDeleteHook,
  type GlobalAfterChangeHook,
  type Field,
} from "payload";
import sharp from "sharp";
import { resendAdapter } from "@payloadcms/email-resend";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
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
} from "./lib/payload/security";
import {
  cloudinaryUploadHook,
  cloudinaryDeleteHook,
} from "./lib/cloudinaryUploadHook";
import { ADMIN_PATH } from "./lib/admin-path";

const canReadProtectedField = ({
  req,
}: {
  req: Parameters<typeof canManageSettings>[0]["req"];
}) => Boolean(canManageSettings({ req }));

const canUpdateProtectedField = ({
  req,
}: {
  req: Parameters<typeof canManageSettings>[0]["req"];
}) => Boolean(canManageSettings({ req }));

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

const revalidateProductAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
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

const revalidateCoreContent: CollectionAfterChangeHook = () => {
  void import("./lib/data/cms").then(({ clearSiteSettingsCache }) => clearSiteSettingsCache());
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/gold");
  revalidatePath("/products/silver");
  revalidatePath("/products/diamond");
  revalidatePath("/products/platinum");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/blog");
  revalidatePath("/swarnavarsha");
  revalidatePath("/thanga-mazhai");
};

const revalidateCoreContentAfterDelete: CollectionAfterDeleteHook = () => {
  void import("./lib/data/cms").then(({ clearSiteSettingsCache }) => clearSiteSettingsCache());
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/gold");
  revalidatePath("/products/silver");
  revalidatePath("/products/diamond");
  revalidatePath("/products/platinum");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/blog");
  revalidatePath("/swarnavarsha");
  revalidatePath("/thanga-mazhai");
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

const statusSelect = {
  defaultValue: "published",
  options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" },
  ],
};

const seoFields = [
  {
    name: "seo",
    type: "group" as const,
    fields: [
      { name: "title", type: "text" as const },
      { name: "description", type: "textarea" as const },
      { name: "ogImage", type: "upload" as const, relationTo: "media" },
    ],
  },
] satisfies Field[];

const ctaFields = [
  { name: "ctaText", type: "text" as const },
  { name: "ctaHref", type: "text" as const },
] satisfies Field[];

const pageSectionFields = [
  { name: "label", type: "text" as const, required: true },
  { name: "heading", type: "text" as const },
  { name: "description", type: "textarea" as const },
  { name: "image", type: "upload" as const, relationTo: "media" },
  ...ctaFields,
  { name: "visible", type: "checkbox" as const, defaultValue: true },
  { name: "sortOrder", type: "number" as const, defaultValue: 0 },
] satisfies Field[];

const usePostgres =
  Boolean(process.env.DATABASE_URL) &&
  (process.env.NODE_ENV === "production" ||
    process.env.PAYLOAD_DATABASE_ADAPTER === "postgres");

function cleanDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  const parsed = new URL(url);
  parsed.searchParams.delete("channel_binding");
  // Use libpq compatibility mode with sslmode=require to prevent Vercel TCP hangs
  parsed.searchParams.set("sslmode", "require");
  parsed.searchParams.set("uselibpqcompat", "1");
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
      beforeList: ["@/components/admin/MediaFolderFilters"],
    },
  },
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
  ],
};

const MetalRate: CollectionConfig = {
  slug: "metal-rates",
  labels: { singular: "Metal Rate", plural: "Metal Rates" },
  admin: {
    useAsTitle: "metal",
    defaultColumns: ["metal", "rate", "unit", "effectiveDate", "active", "updatedAt"],
  },
  access: {
    read: publicRead,
    create: canManageSettings,
    update: canManageSettings,
    delete: canManageSettings,
  },
  hooks: { afterChange: [revalidateCoreContent, auditLogAfterChange], afterDelete: [revalidateCoreContentAfterDelete, auditLogAfterDelete] },
  fields: [
    {
      name: "metal",
      type: "select",
      required: true,
      options: [
        { label: "Gold 22K", value: "gold22" },
        { label: "Gold 18K", value: "gold18" },
        { label: "Silver", value: "silver" },
        { label: "Platinum", value: "platinum" },
      ],
    },
    { name: "rate", type: "text", required: true, admin: { description: "Display value, e.g. 7,450" } },
    { name: "unit", type: "text", defaultValue: "gram" },
    { name: "effectiveDate", type: "date", required: true, defaultValue: () => new Date().toISOString(), admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "active", type: "checkbox", defaultValue: true },
  ],
};

const WebsitePage: CollectionConfig = {
  slug: "website-pages",
  labels: { singular: "Website Page", plural: "Pages" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "pageType", "status", "updatedAt"],
  },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageSettings,
  },
  hooks: {
    beforeValidate: [makeAutoSlug("website-pages")],
    afterChange: [revalidateCoreContent, auditLogAfterChange],
    afterDelete: [revalidateCoreContentAfterDelete, auditLogAfterDelete],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { readOnly: true, description: "Auto-generated from page title." },
    },
    {
      name: "pageType",
      type: "select",
      required: true,
      options: [
        { label: "Home", value: "home" },
        { label: "Gold Products", value: "gold-products" },
        { label: "Silver Products", value: "silver-products" },
        { label: "Diamond Products", value: "diamond-products" },
        { label: "Platinum Products", value: "platinum-products" },
        { label: "Scheme Page", value: "scheme" },
        { label: "About", value: "about" },
        { label: "Contact", value: "contact" },
        { label: "Enquiry", value: "enquiry" },
        { label: "Heritage", value: "heritage" },
        { label: "Blog", value: "blog" },
        { label: "Campaign", value: "campaign" },
      ],
    },
    { name: "status", type: "select", ...statusSelect },
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
        ...ctaFields,
        { name: "visible", type: "checkbox", defaultValue: true },
      ],
    },
    { name: "sections", type: "array", fields: pageSectionFields },
    {
      name: "relatedProducts",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      admin: { description: "Optional curated products for this page." },
    },
    {
      name: "relatedCampaign",
      type: "relationship",
      relationTo: "campaigns" as never,
      admin: { description: "Optional campaign associated with this page." },
    },
    ...seoFields,
  ],
};

const JewelleryCollection: CollectionConfig = {
  slug: "jewellery-collections",
  labels: { singular: "Collection", plural: "Collections" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "metal", "status", "sortOrder"] },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageSettings,
  },
  hooks: {
    beforeValidate: [makeAutoSlug("jewellery-collections")],
    afterChange: [revalidateProduct, auditLogAfterChange],
    afterDelete: [revalidateProductAfterDelete, auditLogAfterDelete],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, admin: { readOnly: true } },
    { name: "metal", type: "select", options: [...metalSelect.options] },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "banner", type: "upload", relationTo: "media" },
    { name: "products", type: "relationship", relationTo: "products", hasMany: true },
    { name: "status", type: "select", ...statusSelect },
    { name: "sortOrder", type: "number", defaultValue: 0 },
    ...seoFields,
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
    {
      name: "collection",
      type: "relationship",
      relationTo: "jewellery-collections" as never,
      admin: { description: "Optional jewellery collection this product belongs to." },
    },
    { name: "productType", type: "text" },
    { name: "shortDescription", type: "textarea" },
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
    {
      name: "gallery",
      type: "array",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "alt", type: "text" },
      ],
    },
    { name: "availability", type: "checkbox", defaultValue: true },
    { name: "status", type: "select", ...statusSelect },
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
    { name: "tags", type: "text", hasMany: true },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "bestSeller", type: "checkbox", defaultValue: false },
    { name: "sortOrder", type: "number", defaultValue: 0 },
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
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "banner", type: "upload", relationTo: "media" },
    { name: "active", type: "checkbox", defaultValue: true },
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

const BestSeller: CollectionConfig = {
  slug: "best-sellers",
  labels: { singular: "Best Seller", plural: "Best Sellers" },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "product", "enabled", "sortOrder"],
  },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  hooks: { afterChange: [revalidateCoreContent, auditLogAfterChange], afterDelete: [revalidateCoreContentAfterDelete, auditLogAfterDelete] },
  fields: [
    { name: "label", type: "text", required: true, admin: { description: "Internal label for CMS list view." } },
    { name: "product", type: "relationship", relationTo: "products", required: true },
    { name: "enabled", type: "checkbox", defaultValue: true },
    { name: "featured", type: "checkbox", defaultValue: true },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};

const Review: CollectionConfig = {
  slug: "reviews",
  labels: { singular: "Review", plural: "Reviews" },
  admin: {
    useAsTitle: "customerName",
    defaultColumns: ["customerName", "rating", "status", "featured", "sortOrder"],
  },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  hooks: { afterChange: [revalidateCoreContent, auditLogAfterChange], afterDelete: [revalidateCoreContentAfterDelete, auditLogAfterDelete] },
  fields: [
    { name: "customerName", type: "text", required: true },
    { name: "location", type: "text" },
    { name: "review", type: "textarea", required: true },
    { name: "rating", type: "number", min: 1, max: 5, defaultValue: 5 },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "date", type: "date", defaultValue: () => new Date().toISOString() },
    { name: "status", type: "select", ...statusSelect },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};

const Campaign: CollectionConfig = {
  slug: "campaigns",
  labels: { singular: "Campaign", plural: "Campaigns / Promotions" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "status", "startDate", "endDate", "pageAssociation"],
  },
  access: {
    read: publicRead,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  hooks: {
    beforeValidate: [makeAutoSlug("campaigns")],
    afterChange: [revalidateCoreContent, auditLogAfterChange],
    afterDelete: [revalidateCoreContentAfterDelete, auditLogAfterDelete],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, admin: { readOnly: true } },
    { name: "status", type: "select", ...statusSelect },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" },
    {
      name: "pageAssociation",
      type: "select",
      options: [
        { label: "Home", value: "home" },
        { label: "Thanga Mazhai", value: "thanga-mazhai" },
        { label: "Swarna Varsha", value: "swarna-varsha" },
        { label: "Products", value: "products" },
        { label: "Blog", value: "blog" },
      ],
    },
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
        ...ctaFields,
      ],
    },
    { name: "banner", type: "upload", relationTo: "media" },
    { name: "sections", type: "array", fields: pageSectionFields },
    ...seoFields,
  ],
};

const Inquiry: CollectionConfig = {
  slug: "inquiries",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["sourcePage", "name", "email", "product", "status", "submittedAt"],
    listSearchableFields: ["name", "email"],
    components: {
      beforeList: ["@/components/admin/InquiryQuickFilters"],
      edit: {
        beforeDocumentControls: [
          "@/components/admin/InquiryDetail",
        ],
      },
    },
  },
  access: {
    read: canManageInquiries,
    // Public submissions go ONLY through the hardened /api/inquiry route
    // (validation, honeypot, rate limiting, HTML escaping). Direct REST writes
    // are blocked; the route uses overrideAccess to create the record.
    create: () => false,
    update: canManageInquiries,
    delete: canManageSettings,
  },
  fields: [
    {
      name: "type",
      type: "select",
      defaultValue: "contact",
      options: [
        { label: "Product Enquiry", value: "enquiry" },
        { label: "Contact Enquiry", value: "contact" },
        { label: "General Enquiry", value: "general" },
      ],
      admin: { readOnly: true },
    },
    { name: "name", type: "text", required: true, admin: { readOnly: true }, access: { update: canUpdateProtectedField } },
    { name: "email", type: "text", required: true, admin: { readOnly: true }, access: { update: canUpdateProtectedField } },
    { name: "phone", type: "text", admin: { readOnly: true }, access: { update: canUpdateProtectedField } },
    { name: "message", type: "textarea", admin: { readOnly: true, disableListFilter: true }, access: { update: canUpdateProtectedField } },
    { name: "productId", type: "text", label: "Product ID", admin: { readOnly: true } },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      admin: {
        components: {
          Cell: "@/components/admin/InquiryProductCell",
        },
      },
    },
    {
      name: "sourcePage",
      type: "text",
      label: "Source",
      admin: {
        readOnly: true,
        components: {
          Cell: "@/components/admin/InquirySourceCell",
        },
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
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
    },
    {
      name: "submittedIp",
      type: "text",
      admin: { readOnly: true, disableListFilter: true },
      access: { read: canReadProtectedField },
    },
    {
      name: "submittedAt",
      type: "date",
      defaultValue: () => new Date().toISOString(),
      admin: { readOnly: true },
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
              name: "navigation",
              type: "group",
              label: "Header / Navigation",
              fields: [
                { name: "announcementText", type: "text", label: "Announcement Text" },
                { name: "showMetalRates", type: "checkbox", label: "Show Metal Rates", defaultValue: true },
                {
                  name: "menuItems",
                  type: "array",
                  label: "Menu Items",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", type: "text", required: true },
                    { name: "visible", type: "checkbox", defaultValue: true },
                    { name: "sortOrder", type: "number", defaultValue: 0 },
                  ],
                },
                {
                  name: "quickLinks",
                  type: "array",
                  label: "Quick Links",
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "href", type: "text", required: true },
                    { name: "visible", type: "checkbox", defaultValue: true },
                    { name: "sortOrder", type: "number", defaultValue: 0 },
                  ],
                },
              ],
            },
            {
              name: "aboutPage",
              type: "group",
              label: "About Page",
              fields: [
                { name: "title", type: "text", defaultValue: "About Us" },
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
            {
              name: "footerLinks",
              type: "array",
              label: "Footer Links",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "href", type: "text", required: true },
                { name: "column", type: "text", admin: { description: "Optional footer column/group name" } },
                { name: "visible", type: "checkbox", defaultValue: true },
                { name: "sortOrder", type: "number", defaultValue: 0 },
              ],
            },
            {
              name: "copyrightText",
              type: "text",
              label: "Copyright Text",
            },
          ],
        },
        // ─── Metal Rates ──────────────────────────────────────────
        {
          label: "Metal Rates",
          fields: [
            {
              name: "rateUpdated",
              type: "date",
              label: "Rates Updated Date",
              admin: {
                date: { pickerAppearance: "dayOnly", displayFormat: "dd-MM-yyyy" },
                description: "Auto-set when you save. Manually editable.",
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
            {
              name: "rateGold22",
              type: "text",
              label: "Gold 22K Rate (₹/gram)",
              admin: { description: "e.g. 7,450" },
            },
            {
              name: "rateGold18",
              type: "text",
              label: "Gold 18K Rate (₹/gram)",
              admin: { description: "e.g. 6,080" },
            },
            {
              name: "rateSilver",
              type: "text",
              label: "Silver Rate (₹/gram)",
              admin: { description: "e.g. 92" },
            },
            {
              name: "ratePlatinum",
              type: "text",
              label: "Platinum Rate (₹/gram)",
              admin: { description: "e.g. 3,890" },
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
            {
              name: "generalSettings",
              type: "group",
              label: "General Settings",
              fields: [
                { name: "siteName", type: "text", defaultValue: "Kerala Jewellers" },
                { name: "adminPanelName", type: "text", defaultValue: "Kerala Jewellers CMS" },
                { name: "canonicalUrl", type: "text" },
                { name: "robotsIndex", type: "checkbox", defaultValue: true },
                { name: "maintenanceMode", type: "checkbox", defaultValue: false },
              ],
            },
          ],
        },
        // ─── Fonts / Typography ──────────────────────────────────────
        {
          label: "Fonts / Typography",
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
                {
                  name: "platinumHero",
                  type: "group",
                  fields: [
                    { name: "title", type: "text", defaultValue: "Platinum Collection — Coming Soon" },
                    { name: "subtitle", type: "textarea", defaultValue: "We're curating an exclusive range of platinum jewellery. Stay tuned for something extraordinary." },
                  ],
                },
              ],
            },
            {
              name: "comingSoonPage",
              type: "group",
              label: "Coming Soon Page",
              fields: [
                { name: "message", type: "text", defaultValue: "Coming Soon" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const postgresPoolMax = Number(process.env.POSTGRES_POOL_MAX || 1);

const storagePlugins =
  process.env.S3_BUCKET &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY &&
  process.env.S3_REGION
    ? [
        s3Storage({
          collections: {
            media: {
              prefix: process.env.S3_PREFIX || "media",
            },
          },
          bucket: process.env.S3_BUCKET,
          config: {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
            endpoint: process.env.S3_ENDPOINT,
            forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
            region: process.env.S3_REGION,
          },
        }),
      ]
    : [];

export default buildConfig({
  secret: requireProductionSecret(),
  routes: {
    admin: ADMIN_PATH,
  },
  sharp,
  db: usePostgres
    ? postgresAdapter({
        pg: process.env.NODE_ENV === "production" ? require("@neondatabase/serverless") : undefined,
        pool: {
          connectionString: cleanDatabaseUrl(process.env.DATABASE_URL),
          max: Number.isFinite(postgresPoolMax) && postgresPoolMax > 0
            ? postgresPoolMax
            : 1,
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
        push: false,
      }),
  collections: [
    AdminUsers,
    Media,
    MetalRate,
    WebsitePage,
    JewelleryCollection,
    Product,
    Category,
    BestSeller,
    Review,
    Campaign,
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
        pages: {
          Component: "@/components/admin/PagesHub",
          path: "/pages",
          exact: false,
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
  plugins: storagePlugins,
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
