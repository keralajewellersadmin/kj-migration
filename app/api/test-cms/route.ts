import { NextResponse } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const action = (body as any).action;
  const payload: any = await getPayload({ config });

  try {
    switch (action) {
      // === SECTION 3: BANNERS / BLOCKS ===
      case "get-hero-slides": {
        const s = await payload.findGlobal({ slug: "site-settings", overrideAccess: true });
        return NextResponse.json({ ok: true, heroSlides: s.heroSlides || [] });
      }
      case "update-hero-slide": {
        const { index, heading } = (body as any).data || {};
        const s = await payload.findGlobal({ slug: "site-settings", overrideAccess: true });
        const slides = [...(s.heroSlides || [])];
        if (index !== undefined && slides[index]) {
          slides[index] = { ...slides[index], heading: heading || slides[index].heading };
          await payload.updateGlobal({ slug: "site-settings", data: { heroSlides: slides } as any, overrideAccess: true });
          return NextResponse.json({ ok: true, message: `Slide ${index} updated`, slides });
        }
        return NextResponse.json({ ok: false, error: "Invalid slide index" });
      }
      case "get-features": {
        const s = await payload.findGlobal({ slug: "site-settings", overrideAccess: true });
        return NextResponse.json({ ok: true, features: s.features || [] });
      }
      case "get-latest-blocks": {
        const s = await payload.findGlobal({ slug: "site-settings", overrideAccess: true });
        return NextResponse.json({ ok: true, latestBlocks: s.latestBlocks || s.latest || [] });
      }

      // === SECTION 5: BLOG POSTS ===
      case "create-blog-post": {
        const { title, excerpt, content } = (body as any).data || {};
        // Blog body uses custom array format: { type: "h2"|"p"|"ul", text: "...", items: [...] }
        const defaultBody = [
          { type: "h2", text: "Test Heading" },
          { type: "p", text: "Test paragraph content for CMS audit blog post." },
          { type: "ul", items: [{ item: "Bullet point one" }, { item: "Bullet point two" }] },
        ];
        const created = await payload.create({
          collection: "blog-posts",
          data: { title: title || "CMS Test Blog Post", excerpt: excerpt || "Test excerpt for blog post", body: content || defaultBody } as any,
          overrideAccess: true,
        });
        return NextResponse.json({ ok: true, id: created.id, slug: created.slug, title: created.title });
      }
      case "update-blog-post": {
        const { id, data: updateData } = (body as any) || {};
        const updated = await payload.update({ collection: "blog-posts", id, data: updateData, overrideAccess: true });
        return NextResponse.json({ ok: true, id: updated.id, slug: updated.slug, title: updated.title, excerpt: updated.excerpt });
      }
      case "delete-blog-post": {
        const { id } = (body as any) || {};
        await payload.delete({ collection: "blog-posts", id, overrideAccess: true });
        return NextResponse.json({ ok: true, message: `Blog post ${id} deleted` });
      }
      case "list-blog-posts": {
        const { docs } = await payload.find({ collection: "blog-posts", limit: 20, overrideAccess: true });
        return NextResponse.json({ ok: true, posts: docs.map((p: any) => ({ id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt })) });
      }

      // === SECTION 6: LEGAL PAGES ===
      case "list-legal-pages": {
        const { docs } = await payload.find({ collection: "legal-pages", limit: 10, overrideAccess: true });
        return NextResponse.json({ ok: true, pages: docs.map((p: any) => ({ id: p.id, title: p.title, slug: p.slug })) });
      }
      case "update-legal-page": {
        const { id, data: updateData } = (body as any) || {};
        const updated = await payload.update({ collection: "legal-pages", id, data: updateData, overrideAccess: true });
        return NextResponse.json({ ok: true, id: updated.id, slug: updated.slug, title: updated.title });
      }

      // === SECTION 7: ABOUT PAGE ===
      case "get-about": {
        const s = await payload.findGlobal({ slug: "site-settings", overrideAccess: true });
        return NextResponse.json({ ok: true, about: s.about || {} });
      }
      case "update-about": {
        const { data: aboutData } = (body as any) || {};
        await payload.updateGlobal({ slug: "site-settings", data: { about: aboutData } as any, overrideAccess: true });
        return NextResponse.json({ ok: true, message: "About page updated" });
      }

      // === SECTION 8: TYPOGRAPHY ===
      case "get-typography": {
        const s = await payload.findGlobal({ slug: "site-settings", overrideAccess: true });
        return NextResponse.json({ ok: true, typography: s.typography || "default" });
      }
      case "set-typography": {
        const { preset } = (body as any) || {};
        await payload.updateGlobal({ slug: "site-settings", data: { typography: preset } as any, overrideAccess: true });
        return NextResponse.json({ ok: true, message: `Typography set to ${preset}` });
      }

      // === SECTION 9: SEO FIELDS ===
      case "update-product-seo": {
        const { id, seo } = (body as any) || {};
        const updated = await payload.update({ collection: "products", id, data: { seo } as any, overrideAccess: true });
        return NextResponse.json({ ok: true, id: updated.id, seo: updated.seo });
      }
      case "get-product-seo": {
        const { id } = (body as any) || {};
        const product = await payload.findByID({ collection: "products", id, overrideAccess: true });
        return NextResponse.json({ ok: true, id: product.id, seo: product.seo, title: product.title });
      }

      // === SECTION 10: BRANCHES ===
      case "get-branches": {
        const s = await payload.findGlobal({ slug: "site-settings", overrideAccess: true });
        return NextResponse.json({ ok: true, branches: s.branches || [] });
      }
      case "update-branch": {
        const { index, data: branchData } = (body as any) || {};
        const s = await payload.findGlobal({ slug: "site-settings", overrideAccess: true });
        const branches = [...(s.branches || [])];
        if (index !== undefined && branches[index]) {
          branches[index] = { ...branches[index], ...branchData };
          await payload.updateGlobal({ slug: "site-settings", data: { branches } as any, overrideAccess: true });
          return NextResponse.json({ ok: true, message: `Branch ${index} updated` });
        }
        return NextResponse.json({ ok: false, error: "Invalid branch index" });
      }

      // === SECTION 12: MEDIA ===
      case "list-media": {
        const { docs, totalDocs } = await payload.find({ collection: "media", limit: 10, overrideAccess: true });
        return NextResponse.json({ ok: true, total: totalDocs, items: docs.map((m: any) => ({ id: m.id, alt: m.alt, url: m.url, filename: m.filename })) });
      }
      case "delete-media": {
        const { id } = (body as any) || {};
        await payload.delete({ collection: "media", id, overrideAccess: true });
        return NextResponse.json({ ok: true, message: `Media ${id} deleted` });
      }

      default:
        return NextResponse.json({ ok: false, error: `Unknown action: ${action}` });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message, stack: e.stack?.substring(0, 500) });
  }
}
