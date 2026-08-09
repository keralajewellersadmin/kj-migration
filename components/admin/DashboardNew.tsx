import React from "react";
import Link from "next/link";
import type { ServerProps } from "payload";
import { ADMIN_PATH } from "@/lib/admin-path";
import styles from "./DashboardNew.module.css";

import { timeAgo } from "@/lib/utils";

async function getStats(payload: ServerProps["payload"]) {
  const [products, categories, media, inquiries, newInquiries, blogPosts] = await Promise.all([
    payload.count({ collection: "products" }).catch(() => ({ totalDocs: 0 })),
    payload.count({ collection: "categories" }).catch(() => ({ totalDocs: 0 })),
    payload.count({ collection: "media" }).catch(() => ({ totalDocs: 0 })),
    payload.count({ collection: "inquiries" }).catch(() => ({ totalDocs: 0 })),
    payload.count({ collection: "inquiries", where: { status: { equals: "new" } } }).catch(() => ({ totalDocs: 0 })),
    payload.count({ collection: "blog-posts" }).catch(() => ({ totalDocs: 0 })),
  ]);

  const recentInquiries = await payload
    .find({ collection: "inquiries", sort: "-submittedAt", limit: 5, depth: 1 })
    .catch(() => ({ docs: [] }));

  const settings = await payload
    .findGlobal({ slug: "site-settings" })
    .catch(() => ({} as any));

  return {
    products: products.totalDocs,
    categories: categories.totalDocs,
    media: media.totalDocs,
    inquiries: inquiries.totalDocs,
    newInquiries: newInquiries.totalDocs,
    blogPosts: blogPosts.totalDocs,
    recentInquiries: recentInquiries.docs,
    rates: {
      gold22: (settings as any)?.rateGold22 || "—",
      gold18: (settings as any)?.rateGold18 || "—",
      silver: (settings as any)?.rateSilver || "—",
      platinum: (settings as any)?.ratePlatinum || "—",
      updated: (settings as any)?.rateUpdated || "",
    },
  };
}

const statusColors: Record<string, string> = {
  new: "#d4af37",
  contacted: "#3b82f6",
  closed: "#10b981",
  spam: "#ef4444",
};

export default async function DashboardNew({ payload }: ServerProps) {
  const stats = await getStats(payload);

  return (
    <div className={styles.dashboard}>
      {/* Stat Cards */}
      <div className={styles.statGrid}>
        <Link href={`${ADMIN_PATH}/collections/products`} className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(212,175,55,0.1)", color: "#d4af37" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.products}</span>
            <span className={styles.statLabel}>Products</span>
          </div>
        </Link>

        <Link href={`${ADMIN_PATH}/collections/categories`} className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.categories}</span>
            <span className={styles.statLabel}>Categories</span>
          </div>
        </Link>

        <Link href={`${ADMIN_PATH}/collections/inquiries`} className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(159,27,31,0.1)", color: "#9f1b1f" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.inquiries}</span>
            <span className={styles.statLabel}>Inquiries</span>
            {stats.newInquiries > 0 && <span className={styles.newBadge}>{stats.newInquiries} new</span>}
          </div>
        </Link>

        <Link href={`${ADMIN_PATH}/collections/blog-posts`} className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.blogPosts}</span>
            <span className={styles.statLabel}>Blog Posts</span>
          </div>
        </Link>
      </div>

      <div className={styles.contentGrid}>
        {/* Metal Rates Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Metal Rates</h3>
            <Link href={`${ADMIN_PATH}/site-settings`} className={styles.cardLink}>Update</Link>
          </div>
          <div className={styles.ratesGrid}>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Gold 22K</span>
              <span className={styles.rateValue}>₹{stats.rates.gold22}</span>
            </div>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Gold 18K</span>
              <span className={styles.rateValue}>₹{stats.rates.gold18}</span>
            </div>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Silver</span>
              <span className={styles.rateValue}>₹{stats.rates.silver}</span>
            </div>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Platinum</span>
              <span className={styles.rateValue}>₹{stats.rates.platinum}</span>
            </div>
          </div>
          {stats.rates.updated && <div className={styles.ratesUpdated}>Updated: {stats.rates.updated}</div>}
        </div>

        {/* Quick Actions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
          </div>
          <div className={styles.actionsGrid}>
            <Link href={`${ADMIN_PATH}/collections/products/create`} className={styles.actionBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Product
            </Link>
            <Link href={`${ADMIN_PATH}/site-settings`} className={styles.actionBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4"/></svg>
              Update Rates
            </Link>
            <Link href={`${ADMIN_PATH}/collections/blog-posts/create`} className={styles.actionBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Add Blog Post
            </Link>
            <Link href={`${ADMIN_PATH}/collections/inquiries`} className={styles.actionBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              View Inquiries
            </Link>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Inquiries</h3>
            <Link href={`${ADMIN_PATH}/collections/inquiries`} className={styles.cardLink}>View all</Link>
          </div>
          {stats.recentInquiries.length === 0 ? (
            <div className={styles.empty}>No inquiries yet.</div>
          ) : (
            <div className={styles.inquiryList}>
              {stats.recentInquiries.map((inquiry: any) => {
                const product = typeof inquiry.product === "object" && inquiry.product !== null ? inquiry.product : null;
                const name = inquiry.name || "Unknown";
                const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <Link key={inquiry.id} href={`${ADMIN_PATH}/collections/inquiries/${inquiry.id}`} className={styles.inquiryRow}>
                    <div className={styles.inquiryAvatar} style={{ background: statusColors[inquiry.status] || "#666" }}>
                      {initials}
                    </div>
                    <div className={styles.inquiryInfo}>
                      <span className={styles.inquiryName}>{name}</span>
                      <span className={styles.inquiryProduct}>{product?.title || inquiry.sourcePage || "General"}</span>
                    </div>
                    <div className={styles.inquiryMeta}>
                      <span className={styles.inquiryTime}>{inquiry.submittedAt ? timeAgo(inquiry.submittedAt as string) : ""}</span>
                      <span className={styles.statusDot} style={{ background: statusColors[inquiry.status] || "#666" }} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <span>&copy; {new Date().getFullYear()} Kerala Jewellers. All rights reserved.</span>
      </div>
    </div>
  );
}
