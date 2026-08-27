const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;

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

interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number | string;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  colorSpace?: "srgb" | "tiny-srgb" | "cmyk" | false;
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
    colorSpace = "srgb",
    crop = "fill",
    gravity = "auto",
  } = options;

  // Normalize: decode any existing encoding, then re-encode for the URL.
  // This handles both raw "Frame 2085665022" and stored "Frame%202085665022"
  // formats consistently, preventing double-encoding (%2520).
  // Note: Node v24's encodeURIComponent no longer encodes ( ) per WHATWG spec,
  // but Cloudinary requires them encoded, so we fix those manually.
  const rawId = decodeURIComponent(publicId);
  const encodedId = rawId
    .split("/")
    .map((seg) =>
      encodeURIComponent(seg).replace(/\(/g, "%28").replace(/\)/g, "%29"),
    )
    .join("/");

  const parts: string[] = [];

  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (quality !== undefined) parts.push(`q_${quality}`);
  if (format) parts.push(`f_${format}`);
  if (colorSpace) parts.push(`cs_${colorSpace}`);
  if (width || height) {
    parts.push(`c_${crop}`);
    parts.push(`g_${gravity}`);
  }

  const transformations = parts.join(",");
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

  if (transformations) {
    return `${base}/${transformations}/${encodedId}`;
  }
  return `${base}/${encodedId}`;
}

export function normalizeCloudinaryDeliveryUrl(url: string): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url;
  }

  const [prefix, suffix] = url.split("/image/upload/");
  if (!prefix || !suffix || suffix.includes("cs_srgb")) return url;

  const segments = suffix.split("/");
  const firstSegment = segments[0] || "";
  const hasTransformSegment =
    firstSegment.includes("_") && !firstSegment.startsWith("v");

  if (hasTransformSegment) {
    segments[0] = `${firstSegment},cs_srgb`;
  } else {
    segments.unshift("q_auto,f_auto,cs_srgb");
  }

  return `${prefix}/image/upload/${segments.join("/")}`;
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
