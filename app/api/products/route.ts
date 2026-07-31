import { NextRequest, NextResponse } from "next/server";
import { getProductsByMetalPaginated } from "@/lib/data/cms";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const metal = searchParams.get("metal") || "gold";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") || "24", 10)),
  );
  const category = searchParams.get("category") || undefined;

  const result = await getProductsByMetalPaginated(
    metal,
    page,
    limit,
    category,
  );
  return NextResponse.json(result);
}
