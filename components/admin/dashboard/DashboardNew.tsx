import Link from "next/link";
import type { ServerProps } from "payload";
import { ADMIN_PATH } from "@/lib/admin-path";
import styles from "./DashboardNew.module.css";

import { timeAgo } from "@/lib/format";

interface DashboardInquiry {
  id: string | number;
  name?: string | null;
  status: string;
  source?: string | null;
  message?: string | null;
  submittedAt?: string | null;
}


async function getStats(payload: ServerProps["payload"], isEnquiryManager: boolean) {
  const inquiries = await payload
    .count({ collection: "inquiries" })
    .catch(() => ({ totalDocs: 0 }));
  const newInquiries = await payload
    .count({ collection: "inquiries", where: { read: { equals: false } } })
    .catch(() => ({ totalDocs: 0 }));

  const recentInquiries = await payload
    .find({ collection: "inquiries", sort: "-submittedAt", limit: 5, depth: 1 })
    .catch(() => ({ docs: [] }));

  const settings = (await payload
    .findGlobal({ slug: "site-settings" })
    .catch(() => ({}))) as Record<string, unknown>;

  // Content managers see product/category/blog counts
  let products = 0;
  let categories = 0;
  let blogPosts = 0;
  if (!isEnquiryManager) {
    [products, categories, blogPosts] = await Promise.all([
      payload.count({ collection: "products" }).catch(() => ({ totalDocs: 0 })),
      payload.count({ collection: "categories" }).catch(() => ({ totalDocs: 0 })),
      payload.count({ collection: "blog-posts" }).catch(() => ({ totalDocs: 0 })),
    ]).then(([p, c, b]) => [p.totalDocs, c.totalDocs, b.totalDocs]);
  }

  return {
    products,
    categories,
    inquiries: inquiries.totalDocs,
    newInquiries: newInquiries.totalDocs,
    blogPosts,
    recentInquiries: recentInquiries.docs,
    rates: {
      gold22: String(settings?.rateGold22 || "â€”"),
      gold18: String(settings?.rateGold18 || "â€”"),
      silver: String(settings?.rateSilver || "â€”"),
      platinum: String(settings?.ratePlatinum || "â€”"),
      updated: String(settings?.rateUpdated || ""),
    },
  };
}

const statusColors: Record<string, string> = {
  new: "#d4af37",
  contacted: "#3b82f6",
  closed: "#10b981",
  spam: "#ef4444",
};

export default async function DashboardNew({ payload, user }: ServerProps) {
  const role = (user as unknown as { role?: string } | undefined)?.role;
  const isEnquiryManager = role === "enquiry-manager";
  const isContentManager = role === "super-admin" || role === "admin";

  const stats = await getStats(payload, isEnquiryManager);

  const welcomeName = (user as unknown as { name?: string; username?: string; email?: string } | undefined);
  const displayName =
    welcomeName?.name || welcomeName?.username || welcomeName?.email || "Admin";

  return (
    <div className={styles.dashboard}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            {isEnquiryManager ? "Enquiry Manager" : "Dashboard"}
          </h1>
          <p className={styles.pageSubtitle}>
            {isEnquiryManager
              ? `Welcome, ${displayName}. Manage customer enquiries and daily metal rates.`
              : "Manage your jewellery store"}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className={styles.statGrid}>
        {isContentManager && (
          <Link href={`${ADMIN_PATH}/collections/products`} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "rgba(212,175,55,0.1)", color: "#d4af37" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.products}</span>
              <span className={styles.statLabel}>Products</span>
            </div>
          </Link>
        )}

        {isContentManager && (
          <Link href={`${ADMIN_PATH}/collections/categories`} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "rgba(139,92,246,0.1)", color: "#8b5cf6" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.categories}</span>
              <span className={styles.statLabel}>Categories</span>
            </div>
          </Link>
        )}

        <Link href={`${ADMIN_PATH}/collections/inquiries`} className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "rgba(159,27,31,0.1)", color: "#9f1b1f" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.inquiries}</span>
            <span className={styles.statLabel}>Inquiries</span>
            {stats.newInquiries > 0 && <span className={styles.newBadge}>{stats.newInquiries} unread</span>}
          </div>
        </Link>

        {isContentManager && (
          <Link href={`${ADMIN_PATH}/collections/blog-posts`} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.blogPosts}</span>
              <span className={styles.statLabel}>Blog Posts</span>
            </div>
          </Link>
        )}
      </div>

      <div className={styles.contentGrid}>
        {/* Metal Rates Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Metal Rates</h3>
            <Link href={`${ADMIN_PATH}/update-rates`} className={styles.cardLink}>Update</Link>
          </div>
          <div className={styles.ratesGrid}>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Gold 22K</span>
              <span className={styles.rateValue}>â‚¹{stats.rates.gold22}</span>
            </div>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Gold 18K</span>
              <span className={styles.rateValue}>â‚¹{stats.rates.gold18}</span>
            </div>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Silver</span>
              <span className={styles.rateValue}>â‚¹{stats.rates.silver}</span>
            </div>
            <div className={styles.rateItem}>
              <span className={styles.rateLabel}>Platinum</span>
              <span className={styles.rateValue}>â‚¹{stats.rates.platinum}</span>
            </div>
          </div>
          {stats.rates.updated && (
            <div className={styles.ratesUpdated}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                <span>
                  Updated{" "}
                  {(() => {
                    try {
                      const d = new Date(stats.rates.updated);
                      if (isNaN(d.getTime())) return stats.rates.updated;
                      return d.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      });
                    } catch {
                      return stats.rates.updated;
                    }
                  })()}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
          </div>
          <div className={styles.actionsGrid}>
            {isEnquiryManager ? (
              <>
                <Link href={`${ADMIN_PATH}/update-rates`} className={styles.actionBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 10l4-4 4 4M8 14l4 4 4-4"/></svg>
                  Update Metal Rates
                </Link>
                <Link href={`${ADMIN_PATH}/collections/inquiries`} className={styles.actionBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  View Inquiries
                </Link>
              </>
            ) : (
              <>
                <Link href={`${ADMIN_PATH}/collections/products/create`} className={styles.actionBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add Product
                </Link>
                <Link href={`${ADMIN_PATH}/collections/categories/create`} className={styles.actionBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                  Add Category
                </Link>
                <Link href={`${ADMIN_PATH}/collections/blog-posts/create`} className={styles.actionBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Add Blog Post
                </Link>
                <Link href={`${ADMIN_PATH}/collections/inquiries`} className={styles.actionBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  View Inquiries
                </Link>
              </>
            )}
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
              {(stats.recentInquiries as DashboardInquiry[]).map((inquiry) => {
                const name = inquiry.name || "Unknown";
                const initials = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                const preview = (inquiry.message || "General enquiry")
                  .split("\n")[0]
                  .slice(0, 60);
                const isEnquiry = inquiry.source === "enquiry";
                return (
                  <Link key={inquiry.id} href={`${ADMIN_PATH}/collections/inquiries/${inquiry.id}`} className={styles.inquiryRow}>
                    <div className={styles.inquiryAvatar} style={{ background: statusColors[inquiry.status] || "#666" }}>
                      {initials}
                    </div>
                    <div className={styles.inquiryInfo}>
                      <span className={styles.inquiryName}>{name}</span>
                      <span className={styles.inquiryProduct}>{preview || "General enquiry"}</span>
                    </div>
                    <div className={styles.inquiryMeta}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "10.5px",
                          fontWeight: 600,
                          backgroundColor: isEnquiry ? "#fef3c7" : "#fdf2f2",
                          color: isEnquiry ? "#92400e" : "#9f1b1f",
                          border: `1px solid ${isEnquiry ? "#fde68a" : "#fecaca"}`,
                        }}
                      >
                        {isEnquiry ? "Enquiry" : "Contact"}
                      </span>
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

