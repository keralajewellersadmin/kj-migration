import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.SEED_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const payload = await getPayload({ config });
    // @ts-expect-error db adapter typing
    const db = payload.db;
    const proto = Object.getPrototypeOf(db);
    const methods = Object.getOwnPropertyNames(proto).filter(
      (m) => typeof db[m] === "function",
    );
    // @ts-expect-error push may exist
    if (typeof db.push === "function") {
      // @ts-expect-error force push
      await db.push({ force: true });
      return NextResponse.json({ ok: true, methods });
    }
    return NextResponse.json({ ok: false, methods });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return NextResponse.json(
      { error: err.message, stack: err.stack?.slice(0, 1000) },
      { status: 500 },
    );
  }
}
