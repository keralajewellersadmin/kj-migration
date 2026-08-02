import { v2 as cloudinary } from "cloudinary";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getFolder(mediaType?: string): string {
  switch (mediaType) {
    case "product":
      return "kerala-jewellers/products";
    case "banner":
      return "kerala-jewellers/banners";
    default:
      return "kerala-jewellers/gallery";
  }
}

function getMediaDir(): string {
  if (process.env.MEDIA_DIR) {
    return path.resolve(process.env.MEDIA_DIR);
  }
  return path.resolve(process.cwd(), "public", "media");
}

function extractCloudinaryPublicId(
  url: string,
  folder: string,
): string | null {
  // URL format: https://res.cloudinary.com/<cloud>/image/upload/v.../<folder>/<id>.<ext>
  const escapedFolder = folder.replace(/\//g, "\\/");
  const match = url.match(
    new RegExp(`/v\\d+/${escapedFolder}\\/([^.]+)\\.`),
  );
  return match ? match[1] : null;
}

export const cloudinaryUploadHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== "create" && operation !== "update") return doc;
  if (!process.env.CLOUDINARY_CLOUD_NAME) return doc;
  if (doc.url && doc.url.includes("res.cloudinary.com")) return doc;
  if (!doc.filename) return doc;

  const mediaDir = getMediaDir();
  const filePath = path.join(mediaDir, doc.filename);

  if (!fs.existsSync(filePath)) {
    console.warn(`[Cloudinary] Local file not found: ${filePath}`);
    return doc;
  }

  try {
    const folder = getFolder(doc.mediaType);
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: String(doc.id),
      resource_type: "image",
    });

    await req.payload.db.updateOne({
      collection: "media",
      id: doc.id,
      data: { url: result.secure_url } as Record<string, unknown>,
    });

    // Clean up local file after successful Cloudinary upload
    try {
      fs.unlinkSync(filePath);
    } catch {
      // Non-critical — local file cleanup is best-effort
    }

    console.log(`[Cloudinary] ${doc.filename} → ${result.secure_url}`);
    return { ...doc, url: result.secure_url };
  } catch (err) {
    console.error(`[Cloudinary] Upload failed for ${doc.filename}:`, err);
    return doc;
  }
};

export const cloudinaryDeleteHook: CollectionAfterDeleteHook = async ({
  doc,
}) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return doc;
  if (!doc?.url || !doc.url.includes("res.cloudinary.com")) return doc;

  try {
    const folder = getFolder(doc.mediaType);
    const publicId = extractCloudinaryPublicId(doc.url, folder);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      console.log(`[Cloudinary] Deleted ${publicId}`);
    }
  } catch (err) {
    console.error(`[Cloudinary] Delete failed for ${doc.filename}:`, err);
  }

  // Also clean up local file if it still exists
  if (doc.filename) {
    const filePath = path.join(getMediaDir(), doc.filename);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {
      // Non-critical
    }
  }

  return doc;
};
