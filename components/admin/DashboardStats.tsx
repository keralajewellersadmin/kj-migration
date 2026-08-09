import React from "react";
import Link from "next/link";
import type { ServerProps } from "payload";
import { ADMIN_PATH } from "@/lib/admin-path";
import styles from "./DashboardStats.module.css";

import { timeAgo } from "@/lib/utils";

async function getStats(payload: ServerProps["payload"]) {
  const [products, categories, media] = await Promise.all([
    payload.count({ collection: "products" }).catch(() => ({ totalDocs: 0 })),
    payload.count({ collection: "categories" }).catch(() => ({ totalDocs: 0 })),
    payload.count({ collection: "media" }).catch(() => ({ totalDocs: 0 })),
  ]);

  const [inquiriesByStatus, recentInquiries] = await Promise.all([
    Promise.all([
      payload
        .count({
          collection: "inquiries",
          where: { status: { equals: "new" } },
        })
        .catch(() => ({ totalDocs: 0 })),
      payload
        .count({
          collection: "inquiries",
          where: { status: { equals: "contacted" } },
        })
        .catch(() => ({ totalDocs: 0 })),
      payload
        .count({
          collection: "inquiries",
          where: { status: { equals: "closed" } },
        })
        .catch(() => ({ totalDocs: 0 })),
      payload
        .count({
          collection: "inquiries",
          where: { status: { equals: "spam" } },
        })
        .catch(() => ({ totalDocs: 0 })),
    ]),
    payload
      .find({
        collection: "inquiries",
        sort: "-submittedAt",
        limit: 5,
        depth: 1,
      })
      .catch(() => ({ docs: [] })),
  ]);

  const totalInquiries =
    inquiriesByStatus[0].totalDocs +
    inquiriesByStatus[1].totalDocs +
    inquiriesByStatus[2].totalDocs +
    inquiriesByStatus[3].totalDocs;

  return {
    products: products.totalDocs,
    categories: categories.totalDocs,
    media: media.totalDocs,
    inquiries: totalInquiries,
    recentInquiries: recentInquiries.docs,
  };
}

const statIcons = {
  products: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.statIcon}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  categories: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.statIcon}
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  inquiries: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.statIcon}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  banners: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.statIcon}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
};

const actionIcons = {
  addProduct: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.actionIcon}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  addCategory: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.actionIcon}
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <line x1="14" y1="6.5" x2="21" y2="6.5" />
      <line x1="17.5" y1="3" x2="17.5" y2="10" />
    </svg>
  ),
  uploadMedia: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.actionIcon}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  siteSettings: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.actionIcon}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  createBanner: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.actionIcon}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
};

const initialsColors = ["#F59E0B", "#8B5CF6", "#3B82F6", "#10B981", "#F97316"];

export default async function DashboardStats({ payload }: ServerProps) {
  const stats = await getStats(payload);

  const statCards = [
    {
      label: "Total Products",
      value: stats.products,
      icon: statIcons.products,
      accent: "#f59e0b",
      bg: "#fff7ed",
    },
    {
      label: "Total Categories",
      value: stats.categories,
      icon: statIcons.categories,
      accent: "#a855f7",
      bg: "#faf5ff",
    },
    {
      label: "Inquiries",
      value: stats.inquiries,
      icon: statIcons.inquiries,
      accent: "#f59e0b",
      bg: "#fff7ed",
    },
    {
      label: "Active Media",
      value: stats.media,
      icon: statIcons.banners,
      accent: "#10b981",
      bg: "#ecfdf5",
    },
  ];

  const quickActions = [
    {
      label: "Add Product",
      href: `${ADMIN_PATH}/collections/products/create`,
      icon: actionIcons.addProduct,
      accent: "#f59e0b",
      bg: "#fff7ed",
      border: "#fed7aa",
    },
    {
      label: "Add Category",
      href: `${ADMIN_PATH}/collections/categories/create`,
      icon: actionIcons.addCategory,
      accent: "#a855f7",
      bg: "#faf5ff",
      border: "#e9d5ff",
    },
    {
      label: "Upload Media",
      href: `${ADMIN_PATH}/collections/media/create`,
      icon: actionIcons.uploadMedia,
      accent: "#10b981",
      bg: "#ecfdf5",
      border: "#bbf7d0",
    },
    {
      label: "Create Banner",
      href: `${ADMIN_PATH}/globals/site-settings`,
      icon: actionIcons.createBanner,
      accent: "#f43f5e",
      bg: "#fff1f2",
      border: "#fecdd3",
    },
    {
      label: "Site Settings",
      href: `${ADMIN_PATH}/globals/site-settings`,
      icon: actionIcons.siteSettings,
      accent: "#64748b",
      bg: "#f8fafc",
      border: "#e2e8f0",
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your store</p>
        </div>
      </div>

      <div className={styles.statGrid}>
        {statCards.map((card) => (
          <div key={card.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{card.label}</span>
              <div
                className={styles.statIconWrap}
                style={{ background: card.bg }}
              >
                <span style={{ color: card.accent }}>{card.icon}</span>
              </div>
            </div>
            <div className={styles.statValue}>
              {card.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Quick Actions</h3>
          <div className={styles.actionsRow}>
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={styles.actionCard}
                style={{ borderColor: action.border }}
              >
                <div
                  className={styles.actionIconWrap}
                  style={{ background: action.bg }}
                >
                  <span style={{ color: action.accent }}>{action.icon}</span>
                </div>
                <span className={styles.actionLabel}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Recent Inquiries</h3>
            <Link
              href={`${ADMIN_PATH}/collections/inquiries?sort=-submittedAt`}
              className={styles.viewAll}
            >
              View all
            </Link>
          </div>
          {stats.recentInquiries.length === 0 ? (
            <p className={styles.empty}>No inquiries yet.</p>
          ) : (
            <div className={styles.inquiryList}>
              {stats.recentInquiries.map((inquiry, i) => {
                const product =
                  typeof inquiry.product === "object" &&
                  inquiry.product !== null
                    ? inquiry.product
                    : null;
                const name = inquiry.name || "Unknown";
                const initials = name
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <Link
                    key={inquiry.id}
                    href={`${ADMIN_PATH}/collections/inquiries/${inquiry.id}`}
                    className={styles.inquiryRow}
                  >
                    <div
                      className={styles.inquiryAvatar}
                      style={{
                        background: initialsColors[i % initialsColors.length],
                      }}
                    >
                      {initials}
                    </div>
                    <div className={styles.inquiryInfo}>
                      <span className={styles.inquiryName}>{name}</span>
                      <span className={styles.inquiryProduct}>
                        {product?.title ||
                          inquiry.sourcePage ||
                          "General Inquiry"}
                      </span>
                    </div>
                    <div className={styles.inquiryMeta}>
                      <span className={styles.inquiryTime}>
                        {inquiry.submittedAt
                          ? timeAgo(inquiry.submittedAt as string)
                          : ""}
                      </span>
                      <span
                        className={`${styles.statusDot} ${styles[`dot${inquiry.status}`]}`}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.dashboardFooter}>
        <span>© 2025 Kerala Jewellers. All rights reserved.</span>
      </div>
    </div>
  );
}
