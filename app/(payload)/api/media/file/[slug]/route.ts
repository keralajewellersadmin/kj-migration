import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { cloudinaryUrl } from "@/lib/cloudinary";

const SIZE_RE = /^(.+)-(\d+)x(\d+)\.\w+$/;

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const params = await props.params;
  const filename = decodeURIComponent(params.slug);

  try {
    const payload = await getPayload({ config });

    const sizeMatch = filename.match(SIZE_RE);
    const lookupName = sizeMatch ? `${sizeMatch[1]}.${filename.split(".").pop()}` : filename;

    const { docs } = await payload.find({
      collection: "media",
      where: { filename: { equals: lookupName } },
      limit: 1,
      depth: 0,
    });

    const doc = docs[0];
    if (!doc) {
      const { docs: all } = await payload.find({
        collection: "media",
        where: { filename: { equals: filename } },
        limit: 1,
        depth: 0,
      });
      if (all[0]) return serveFromPayload(all[0], request);
      return new NextResponse("Not found", { status: 404 });
    }

    const publicId = doc.cloudinaryPublicId as string | null;

    if (publicId) {
      if (sizeMatch) {
        const w = parseInt(sizeMatch[2], 10);
        const h = parseInt(sizeMatch[3], 10);
        return NextResponse.redirect(cloudinaryUrl(publicId, { width: w, height: h, crop: "fill" }), 302);
      }
      return NextResponse.redirect(cloudinaryUrl(publicId), 302);
    }

    const url = doc.url as string | null;
    if (url && url.includes("res.cloudinary.com")) {
      return NextResponse.redirect(url, 302);
    }

    return serveFromPayload(doc, request);
  } catch (err) {
    console.error("[Media File Route] Error:", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serveFromPayload(doc: any, _request: NextRequest) {
  const url = doc.url as string | null;
  if (url) {
    if (url.startsWith("http")) return NextResponse.redirect(url, 302);
    return NextResponse.redirect(new URL(url, _request.url), 302);
  }
  return new NextResponse("File not available", { status: 404 });
}

