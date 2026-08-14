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
    const db = payload.db as unknown as Record<string, unknown>;
    const methods = Object.getOwnPropertyNames(
      Object.getPrototypeOf(payload.db),
    ).filter(
      (m) =>
        typeof (payload.db as unknown as Record<string, unknown>)[m] === "function",
    );
    const pushFn = db.push as ((opts?: { force?: boolean }) => Promise<void>) | undefined;
    if (typeof pushFn === "function") {
      await pushFn({ force: true });
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
