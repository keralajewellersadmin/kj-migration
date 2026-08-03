import { v2 as cloudinary } from "cloudinary";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import fs from "fs";
import path from "path";
import { getCloudinaryFolder, extractPublicIdFromUrl } from "./cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getMediaDir(): string {
  if (process.env.MEDIA_DIR) {
    return path.resolve(process.env.MEDIA_DIR);
  }
  return path.resolve(process.cwd(), "public", "media");
}

export const cloudinaryUploadHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== "create" && operation !== "update") return doc;
  if (!process.env.CLOUDINARY_CLOUD_NAME) return doc;
  if (!doc.filename) return doc;

  // Skip if URL was already set to Cloudinary by the update
  const incomingUrl = (req.data as Record<string, unknown>)?.url;
  if (typeof incomingUrl === "string" && incomingUrl.includes("res.cloudinary.com")) return doc;
  if (doc.url && doc.url.includes("res.cloudinary.com")) return doc;

  const mediaDir = getMediaDir();
  const filePath = path.join(mediaDir, doc.filename);

  if (!fs.existsSync(filePath)) {
    return doc;
  }

  try {
    const folder = getCloudinaryFolder(doc.mediaType);
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: String(doc.id),
      resource_type: "image",
    });

    const updateData: Record<string, unknown> = {
      url: result.secure_url,
      cloudinaryPublicId: result.public_id,
    };

    await req.payload.db.updateOne({
      collection: "media",
      id: doc.id,
      data: updateData,
    });

    try {
      fs.unlinkSync(filePath);
    } catch {
      // Non-critical
    }

    console.log(`[Cloudinary] ${doc.filename} → ${result.secure_url}`);
    return { ...doc, ...updateData };
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
    const publicId =
      doc.cloudinaryPublicId ||
      extractPublicIdFromUrl(doc.url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      console.log(`[Cloudinary] Deleted ${publicId}`);
    }
  } catch (err) {
    console.error(`[Cloudinary] Delete failed for ${doc.filename}:`, err);
  }

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
