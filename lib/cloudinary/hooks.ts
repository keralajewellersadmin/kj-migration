import type {
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
} from "payload";
import fs from "node:fs/promises";
import { getCloudinaryFolder, extractPublicIdFromUrl } from "./index.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cloudinaryClient: any = null;
async function getCloudinaryClient() {
  if (cloudinaryClient) return cloudinaryClient;
  const { v2: cloudinary } = await import("cloudinary");
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  cloudinaryClient = cloudinary;
  return cloudinary;
}

function getConfiguredMediaDir(): string | undefined {
  return process.env.MEDIA_DIR;
}

export const cloudinaryUploadHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation !== "create" && operation !== "update") return data;

  // Local-only mode: if Cloudinary isn't configured at all, store the file
  // locally and skip Cloudinary. (Used for local dev without Cloudinary.)
  if (!process.env.CLOUDINARY_CLOUD_NAME) return data;

  // Misconfiguration guard: cloud name is set but credentials are missing.
  // Fail loudly instead of silently storing the file locally with no
  // Cloudinary copy.
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "[Cloudinary] CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set for image uploads.",
    );
  }

  // File size limit: 10 MB
  const MAX_SIZE = 10 * 1024 * 1024;
  if (req.file && req.file.size > MAX_SIZE) {
    throw new Error(
      `File too large. Maximum size is 10 MB. Received: ${Math.round(req.file.size / 1024 / 1024)} MB`,
    );
  }

  // Skip if URL was already set to Cloudinary
  const incomingUrl = data?.url;
  if (typeof incomingUrl === "string" && incomingUrl.includes("res.cloudinary.com")) return data;

  // In beforeChange, the file buffer is either in req.file.data or written to tempFilePath
  if (!req.file || (!req.file.data && !req.file.tempFilePath)) {
    return data;
  }

  try {
    const cloudinary = await getCloudinaryClient();
    const folder = getCloudinaryFolder(data.mediaType as string);

    let originalBuffer: Buffer;
    if (req.file.tempFilePath) {
      originalBuffer = await fs.readFile(req.file.tempFilePath);
    } else if (Buffer.isBuffer(req.file.data)) {
      originalBuffer = req.file.data;
    } else {
      originalBuffer = Buffer.from(req.file.data as ArrayBuffer);
    }

    // Use Cloudinary's native transformations instead of sharp to prevent Vercel memory/binary issues
    const publicId = data.filename ? data.filename.split('.')[0] + '-' + Date.now() : Date.now().toString();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "image",
          colorspace: "srgb",
          format: "webp",
          transformation: [
            { width: 1920, crop: "limit" }
          ]
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error: any, uploadResult?: any) => {
          if (error) reject(error);
          else resolve(uploadResult!);
        },
      );
      uploadStream.end(originalBuffer);
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Cloudinary] Uploaded -> ${result.secure_url}`);
    }

    // Mutate the data being saved
    return {
      ...data,
      url: result.secure_url,
      cloudinaryPublicId: result.public_id,
    };
  } catch (err) {
    // Fail loudly: do NOT silently store the file locally with no Cloudinary
    // copy. Surface the error so the upload is retried/fixed.
    console.error(`[Cloudinary] Upload failed:`, err);
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`[Cloudinary] Failed to upload image: ${message}`);
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

