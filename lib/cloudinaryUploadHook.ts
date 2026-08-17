import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";
import { getCloudinaryFolder, extractPublicIdFromUrl } from "./cloudinary";

async function getCloudinaryClient() {
  const { v2: cloudinary } = await import("cloudinary");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
}

function getConfiguredMediaDir(): string | undefined {
  return process.env.MEDIA_DIR;
}

export const cloudinaryUploadHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== "create" && operation !== "update") return doc;
  if (!process.env.CLOUDINARY_CLOUD_NAME) return doc;
  if (!doc.filename) return doc;

  // File size limit: 10 MB
  const MAX_SIZE = 10 * 1024 * 1024;
  if (req.file && req.file.size > MAX_SIZE) {
    throw new Error(
      `File too large. Maximum size is 10 MB. Received: ${Math.round(req.file.size / 1024 / 1024)} MB`,
    );
  }

  // Skip if URL was already set to Cloudinary by the update
  const incomingUrl = (req.data as Record<string, unknown>)?.url;
  if (typeof incomingUrl === "string" && incomingUrl.includes("res.cloudinary.com")) return doc;
  if (doc.url && doc.url.includes("res.cloudinary.com")) return doc;

  const fs = await import("node:fs");
  const path = await import("node:path");
  const mediaDir =
    getConfiguredMediaDir() ||
    path.join(
      /* turbopackIgnore: true */ process.cwd(),
      "public",
      "media",
    );
  const filePath = path.join(mediaDir, doc.filename);

  if (!fs.existsSync(filePath)) {
    return doc;
  }

  try {
    const cloudinary = await getCloudinaryClient();
    const folder = getCloudinaryFolder(doc.mediaType);
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: String(doc.id),
      resource_type: "image",
      colorspace: "srgb",
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

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Cloudinary] ${doc.filename} → ${result.secure_url}`);
    }
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
    const cloudinary = await getCloudinaryClient();
    const publicId =
      doc.cloudinaryPublicId ||
      extractPublicIdFromUrl(doc.url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Cloudinary] Deleted ${publicId}`);
      }
    }
  } catch (err) {
    console.error(`[Cloudinary] Delete failed for ${doc.filename}:`, err);
  }

  if (doc.filename) {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const mediaDir =
      getConfiguredMediaDir() ||
      path.join(
        /* turbopackIgnore: true */ process.cwd(),
        "public",
        "media",
      );
    const filePath = path.join(mediaDir, doc.filename);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {
      // Non-critical
    }
  }

  return doc;
};
