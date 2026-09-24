"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { PAGE_DEFS } from "./pageDefs";
import PageEditor from "./PageEditor";

import { ADMIN_PATH } from "@/lib/admin-path";

export default function PagesView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSlug = searchParams.get("page");

  if (pageSlug) {
    return <PageEditor slug={pageSlug} />;
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 64px" }}>
      <div style={{ marginBottom: 28 }}>
        <a
          href={ADMIN_PATH}
          onClick={(e) => {
            e.preventDefault();
            router.push(ADMIN_PATH);
          }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 12, fontWeight: 500 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Back to Dashboard
        </a>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Pages
        </h1>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: "6px 0 0" }}>
          Edit the content of each website page. Changes are saved to the same underlying CMS fields — no duplication.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {PAGE_DEFS.map((page) => (
          <Link
            key={page.slug}
            href={`${ADMIN_PATH}/pages?page=${page.slug}`}
            style={{
              display: "block",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: "20px 22px",
              textDecoration: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#9f1b1f";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ width: 38, height: 38, borderRadius: 9, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#9f1b1f", fontWeight: 700, fontSize: 15 }}>
                {page.title.charAt(0)}
              </span>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                {page.title}
              </h2>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
              {page.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
