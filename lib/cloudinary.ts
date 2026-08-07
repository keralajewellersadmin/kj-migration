const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "htl6k8cd";

const FOLDER_MAP: Record<string, string> = {
  product: "products",
  category: "categories",
  banner: "banners",
  gallery: "gallery",
  blog: "blog",
  heritage: "heritage",
  timeline: "timeline",
  campaign: "campaigns",
  store: "stores",
  collection: "collections",
};

export function getCloudinaryFolder(mediaType?: string): string {
  const folder = FOLDER_MAP[mediaType || ""] || "gallery";
  return `kerala-jewellers/${folder}`;
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number | string;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "fill" | "fit" | "scale" | "crop" | "thumb";
  gravity?: "auto" | "face" | "center" | "north" | "south";
}

export function cloudinaryUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {},
): string {
  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "fill",
    gravity = "auto",
  } = options;

  // Decode any URL-encoded characters in the public_id first (handles both
  // raw "Frame 2085665022" and stored "Frame%202085665022" formats).
  const rawId = decodeURIComponent(publicId);

  const parts: string[] = [];

  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (quality !== undefined) parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);
  if (width || height) {
    parts.push(`c_${crop}`);
    parts.push(`g_${gravity}`);
  }

  const transformations = parts.join(",");
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

  if (transformations) {
    return `${base}/${transformations}/${rawId}`;
  }
  return `${base}/${rawId}`;
}

export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;

  const match = url.match(/\/v\d+\/(.+)\.\w+$/);
  if (match) return match[1];

  const match2 = url.match(/\/upload\/(.+)$/);
  if (match2) {
    const raw = match2[1];
    const withoutTransformations = raw.replace(/^.*?\//, "");
    return withoutTransformations;
  }

  return null;
}
