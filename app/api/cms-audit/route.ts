import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let payload: any = null;

async function getPayloadInstance() {
  if (!payload) {
    const { getPayload } = await import("payload");
    const config = (await import("@payload-config")).default;
    payload = await getPayload({ config });
  }
  return payload;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action as string;
    const p = await getPayloadInstance();
    const results: any[] = [];

    switch (action) {
      case "list-products": {
        const r = await p.find({ collection: "products", limit: 5, depth: 0, overrideAccess: true });
        results.push({ test: "products-list", pass: true, total: r.totalDocs, items: r.docs.map((x: any) => ({ id: x.id, title: x.title, slug: x.slug, metal: x.metal })) });
        break;
      }
      case "create-product": {
        const r = await p.create({ collection: "products", data: { title: "Test Audit Necklace", metal: "gold", weight: 25, purity: 91.6, code: "TESTAUDIT001", description: "CMS audit test product.", availability: true }, overrideAccess: true });
        results.push({ test: "product-create", pass: true, id: r.id, slug: r.slug, title: r.title });
        break;
      }
      case "find-test-product": {
        const r = await p.find({ collection: "products", where: { code: { equals: "TESTAUDIT001" } }, limit: 1, overrideAccess: true });
        if (r.docs.length) {
          const d = r.docs[0];
          results.push({ test: "product-found", pass: true, id: d.id, title: d.title, slug: d.slug, weight: d.weight, description: d.description });
        } else {
          results.push({ test: "product-found", pass: false, message: "Not found" });
        }
        break;
      }
      case "edit-product": {
        const r = await p.find({ collection: "products", where: { code: { equals: "TESTAUDIT001" } }, limit: 1, overrideAccess: true });
        if (!r.docs.length) { results.push({ test: "product-edit", pass: false, message: "Not found" }); break; }
        const oldSlug = r.docs[0].slug;
        const u = await p.update({ collection: "products", id: r.docs[0].id, data: { weight: 30, description: "Updated during audit." }, overrideAccess: true });
        results.push({ test: "product-edit", pass: u.slug === oldSlug, weight: u.weight, slug: u.slug, slugUnchanged: u.slug === oldSlug });
        break;
      }
      case "test-slug-lock": {
        const r = await p.find({ collection: "products", where: { code: { equals: "TESTAUDIT001" } }, limit: 1, overrideAccess: true });
        if (!r.docs.length) { results.push({ test: "slug-lock", pass: false, message: "Not found" }); break; }
        const origSlug = r.docs[0].slug;
        try {
          const u = await p.update({ collection: "products", id: r.docs[0].id, data: { slug: "hacked-slug" }, overrideAccess: true });
          if (u.slug !== origSlug) {
            await p.update({ collection: "products", id: r.docs[0].id, data: { slug: origSlug }, overrideAccess: true });
            results.push({ test: "slug-lock", pass: false, message: "Slug CAN be changed", newSlug: u.slug });
          } else {
            results.push({ test: "slug-lock", pass: true, message: "Slug locked", slug: u.slug });
          }
        } catch (e: any) {
          results.push({ test: "slug-lock", pass: true, message: "Slug change blocked", error: e.message });
        }
        break;
      }
      case "delete-product": {
        const r = await p.find({ collection: "products", where: { code: { equals: "TESTAUDIT001" } }, limit: 1, overrideAccess: true });
        if (!r.docs.length) { results.push({ test: "product-delete", pass: true, message: "Already deleted" }); break; }
        await p.delete({ collection: "products", id: r.docs[0].id, overrideAccess: true });
        const v = await p.find({ collection: "products", where: { code: { equals: "TESTAUDIT001" } }, limit: 1, overrideAccess: true });
        results.push({ test: "product-delete", pass: v.docs.length === 0, verified: v.docs.length === 0 });
        break;
      }
      case "rbac-enquiry": {
        try {
          const login = await p.login({ collection: "admin-users", data: { email: "enquiry@keralajewellers.in", password: "EnquiryMgr@12345" } });
          try {
            const prods = await p.find({ collection: "products", limit: 1, user: login.user });
            results.push({ test: "rbac-enquiry", pass: false, message: "Enquiry-manager CAN see products", count: prods.totalDocs });
          } catch (e: any) {
            results.push({ test: "rbac-enquiry", pass: true, message: "Enquiry-manager blocked from products" });
          }
        } catch (e: any) {
          results.push({ test: "rbac-enquiry", pass: false, message: "Login failed", error: e.message });
        }
        break;
      }
      case "product-count": {
        const r = await p.find({ collection: "products", depth: 0, overrideAccess: true });
        results.push({ test: "product-count", pass: true, total: r.totalDocs });
        break;
      }
      case "list-categories": {
        const r = await p.find({ collection: "categories", limit: 20, depth: 0, overrideAccess: true });
        results.push({ test: "categories-list", pass: true, total: r.totalDocs, items: r.docs.map((c: any) => ({ id: c.id, name: c.name, metal: c.metal, slug: c.slug })) });
        break;
      }
      case "create-category": {
        try {
          const r = await p.create({ collection: "categories", data: { name: "Test Bangles Audit", metal: "gold", displayOrder: 99 }, overrideAccess: true });
          results.push({ test: "category-create", pass: true, id: r.id, name: r.name, metal: r.metal, slug: r.slug });
        } catch (e: any) {
          results.push({ test: "category-create", pass: false, error: e.message });
        }
        break;
      }
      case "duplicate-category": {
        try {
          await p.create({ collection: "categories", data: { name: "Test Bangles Audit", metal: "gold", displayOrder: 99 }, overrideAccess: true });
          results.push({ test: "category-duplicate", pass: false, message: "Duplicate NOT blocked" });
        } catch (e: any) {
          results.push({ test: "category-duplicate", pass: true, message: "Duplicate blocked", error: e.message });
        }
        break;
      }
      case "same-name-diff-metal": {
        try {
          const r = await p.create({ collection: "categories", data: { name: "Test Bangles Audit", metal: "silver", displayOrder: 99 }, overrideAccess: true });
          results.push({ test: "category-diff-metal", pass: true, message: "Same name diff metal allowed", id: r.id });
          await p.delete({ collection: "categories", id: r.id, overrideAccess: true });
        } catch (e: any) {
          results.push({ test: "category-diff-metal", pass: false, message: "Same name diff metal blocked", error: e.message });
        }
        break;
      }
      case "delete-category": {
        const r = await p.find({ collection: "categories", where: { name: { equals: "Test Bangles Audit" }, metal: { equals: "gold" } }, limit: 1, overrideAccess: true });
        if (!r.docs.length) { results.push({ test: "category-delete", pass: true, message: "Already deleted" }); break; }
        await p.delete({ collection: "categories", id: r.docs[0].id, overrideAccess: true });
        const v = await p.find({ collection: "categories", where: { name: { equals: "Test Bangles Audit" }, metal: { equals: "gold" } }, limit: 1, overrideAccess: true });
        results.push({ test: "category-delete", pass: v.docs.length === 0, verified: v.docs.length === 0 });
        break;
      }
      case "read-rates": {
        const s = await p.findGlobal({ slug: "site-settings", overrideAccess: true });
        results.push({ test: "rates-read", pass: true, gold22: s.rateGold22, gold18: s.rateGold18, silver: s.rateSilver, platinum: s.ratePlatinum });
        break;
      }
      case "update-rates": {
        const orig = await p.findGlobal({ slug: "site-settings", overrideAccess: true });
        const origData = { gold22: orig.rateGold22, gold18: orig.rateGold18, silver: orig.rateSilver, platinum: orig.ratePlatinum };
        await p.updateGlobal({ slug: "site-settings", data: { rateGold22: 9999, rateGold18: 8888, rateSilver: 777, ratePlatinum: 6666 }, overrideAccess: true });
        const updated = await p.findGlobal({ slug: "site-settings", overrideAccess: true });
        const pass = updated.rateGold22 === 9999 && updated.rateGold18 === 8888;
        results.push({ test: "rates-update", pass, gold22: updated.rateGold22, gold18: updated.rateGold18 });
        // Revert
        await p.updateGlobal({ slug: "site-settings", data: { rateGold22: origData.gold22, rateGold18: origData.gold18, silver: origData.silver, platinum: origData.platinum }, overrideAccess: true });
        const reverted = await p.findGlobal({ slug: "site-settings", overrideAccess: true });
        results.push({ test: "rates-revert", pass: reverted.rateGold22 === origData.gold22, gold22: reverted.rateGold22 });
        break;
      }
      case "list-blog": {
        const r = await p.find({ collection: "blog-posts", limit: 5, depth: 0, overrideAccess: true });
        results.push({ test: "blog-list", pass: true, total: r.totalDocs, items: r.docs.map((b: any) => ({ id: b.id, title: b.title, slug: b.slug })) });
        break;
      }
      case "list-inquiries": {
        const r = await p.find({ collection: "inquiries", limit: 5, depth: 0, overrideAccess: true });
        results.push({ test: "inquiries-list", pass: true, total: r.totalDocs });
        break;
      }
      case "list-media": {
        const r = await p.find({ collection: "media", limit: 5, depth: 0, overrideAccess: true });
        results.push({ test: "media-list", pass: true, total: r.totalDocs });
        break;
      }
      case "list-admin-users": {
        const r = await p.find({ collection: "admin-users", limit: 10, depth: 0, overrideAccess: true });
        results.push({ test: "admin-users-list", pass: true, total: r.totalDocs, users: r.docs.map((u: any) => ({ id: u.id, email: u.email, username: u.username, role: u.role })) });
        break;
      }
      case "seed-admin-users": {
        const usersToCreate = [
          { email: "admin@keralajewellers.in", password: "AdminMgr@12345", name: "Admin Manager", role: "admin" as const, username: "admin" },
          { email: "enquiry@keralajewellers.in", password: "EnquiryMgr@12345", name: "Enquiry Manager", role: "enquiry-manager" as const, username: "enquiry" },
        ];
        for (const u of usersToCreate) {
          try {
            const existing = await p.find({ collection: "admin-users", where: { username: { equals: u.username } }, limit: 1, overrideAccess: true });
            if (existing.docs.length) {
              results.push({ test: `seed-${u.username}`, pass: true, message: "Already exists", id: existing.docs[0].id });
            } else {
              const created = await p.create({ collection: "admin-users", data: { ...u, isActive: true } as any, overrideAccess: true });
              results.push({ test: `seed-${u.username}`, pass: true, message: "Created", id: created.id, role: u.role });
            }
          } catch (e: any) {
            results.push({ test: `seed-${u.username}`, pass: false, error: e.message });
          }
        }
        break;
      }
      case "site-settings": {
        const s = await p.findGlobal({ slug: "site-settings", depth: 1, overrideAccess: true });
        results.push({ test: "site-settings", pass: true, gold22: s.rateGold22, gold18: s.rateGold18, silver: s.rateSilver, platinum: s.ratePlatinum, bestsellerProducts: s.bestsellerProducts });
        break;
      }
      case "revert-rates": {
        await p.updateGlobal({ slug: "site-settings", data: { rateGold22: 76000, rateGold18: 63000, rateSilver: 95000, ratePlatinum: 35000 }, overrideAccess: true });
        const s = await p.findGlobal({ slug: "site-settings", overrideAccess: true });
        results.push({ test: "rates-revert", pass: true, gold22: s.rateGold22, gold18: s.rateGold18, silver: s.rateSilver, platinum: s.ratePlatinum });
        break;
      }
      default:
        results.push({ test: "unknown", pass: false, message: `Unknown action: ${action}` });
    }

    return NextResponse.json({ ok: true, results });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, stack: err.stack?.split("\n").slice(0, 5) }, { status: 500 });
  }
}
