import { cloudinaryUrl, extractPublicIdFromUrl } from "./cloudinary";

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.includes("res.cloudinary.com")) {
    const publicId = extractPublicIdFromUrl(src);
    if (publicId) {
      return cloudinaryUrl(publicId, {
        width,
        quality: quality || "auto",
        format: "auto",
      });
    }
  }
  return src;
}
