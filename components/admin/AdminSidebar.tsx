"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import { ADMIN_PATH } from "@/lib/admin-path";
import styles from "./AdminSidebar.module.css";

type NavItem = {
  href: string;
  icon: string;
  label: string;
  badge?: number;
  exact?: boolean;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

function getNavSections(role: string, inquiryCount: number): NavSection[] {
  const sections: NavSection[] = [];

  // Dashboard — all roles
  sections.push({
    label: "",
    items: [{ href: ADMIN_PATH, icon: "dashboard", label: "Dashboard", exact: true }],
  });

  // Daily Tasks
  const dailyItems: NavItem[] = [];
  dailyItems.push({ href: `${ADMIN_PATH}/collections/inquiries`, icon: "inquiries", label: "Inquiries", badge: inquiryCount });
  sections.push({ label: "Daily Tasks", items: dailyItems });

  // Quick Access — super-admin, admin
  if (role === "super-admin" || role === "admin") {
    sections.push({
      label: "Quick Access",
      items: [
        { href: `${ADMIN_PATH}/globals/site-settings`, icon: "rates", label: "Metal Rates" },
      ],
    });
  }

  // Content — super-admin, admin
  if (role === "super-admin" || role === "admin") {
    sections.push({
      label: "Content",
      items: [
        { href: `${ADMIN_PATH}/collections/products`, icon: "products", label: "Products" },
        { href: `${ADMIN_PATH}/collections/categories`, icon: "categories", label: "Categories" },
        { href: `${ADMIN_PATH}/collections/blog-posts`, icon: "blog", label: "Blog Posts" },
        { href: `${ADMIN_PATH}/collections/legal-pages`, icon: "legal", label: "Legal Pages" },
        { href: `${ADMIN_PATH}/collections/media`, icon: "media", label: "Media" },
      ],
    });
  }

  // Admin — super-admin only
  if (role === "super-admin") {
    sections.push({
      label: "Admin",
      items: [
        { href: `${ADMIN_PATH}/collections/admin-users`, icon: "users", label: "Manage Users" },
        { href: `${ADMIN_PATH}/collections/audit-logs`, icon: "audit", label: "Audit Logs" },
      ],
    });
  }

  return sections;
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    rates: (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M8 10l4-4 4 4M8 14l4 4 4-4" />
      </svg>
    ),
    inquiries: (
      <svg {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    products: (
      <svg {...props}>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    categories: (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    blog: (
      <svg {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    banners: (
      <svg {...props}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    legal: (
      <svg {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    media: (
      <svg {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    "site-settings": (
      <svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    users: (
      <svg {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    audit: (
      <svg {...props}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    logout: (
      <svg {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    menu: (
      <svg {...props}>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    collapse: (
      <svg {...props}>
        <polyline points="11 17 6 12 11 7" />
        <polyline points="18 17 13 12 18 7" />
      </svg>
    ),
    expand: (
      <svg {...props}>
        <polyline points="13 17 18 12 13 7" />
        <polyline points="6 17 11 12 6 7" />
      </svg>
    ),
  };

  return <>{icons[name] || icons.dashboard}</>;
}

function isActive(pathname: string, searchParams: URLSearchParams, href: string, exact?: boolean) {
  const [hrefPathname, hrefQuery] = href.split("?");
  if (exact) {
    if (pathname !== hrefPathname) return false;
    const allItems = getNavSections("super-admin", 0).flatMap((s) => s.items);
    for (const item of allItems) {
      if (item.href === href) continue;
      const [itemPath] = item.href.split("?");
      if (itemPath !== hrefPathname && (pathname === itemPath || pathname.startsWith(`${itemPath}/`))) {
        return false;
      }
    }
    return true;
  }
  const pathMatches = pathname === hrefPathname || pathname.startsWith(`${hrefPathname}/`);
  if (!pathMatches) return false;
  // If this link has query params, match only when those params are present
  if (hrefQuery) {
    const hrefParams = new URLSearchParams(hrefQuery);
    for (const [key, value] of Array.from(hrefParams.entries())) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  }
  // Link has NO query params — only match if no more-specific link (with params) also matches
  const allItems = getNavSections("super-admin", 0).flatMap((s) => s.items);
  for (const item of allItems) {
    if (item.href === href) continue;
    const [itemPath] = item.href.split("?");
    if (itemPath === hrefPathname && item.href.includes("?")) {
      const itemParams = new URLSearchParams(item.href.split("?")[1]);
      let matchesAll = true;
      for (const [key, value] of Array.from(itemParams.entries())) {
        if (searchParams.get(key) !== value) { matchesAll = false; break; }
      }
      if (matchesAll) return false;
    }
  }
  return true;
}

export default function AdminSidebar({
  displayName,
  role,
  inquiryCount,
}: {
  displayName: string;
  role: string;
  inquiryCount: number;
}) {
  return (
    <Suspense fallback={<aside className={styles.sidebar} />}>
      <SidebarInner displayName={displayName} role={role} inquiryCount={inquiryCount} />
    </Suspense>
  );
}

function SidebarInner({
  displayName,
  role,
  inquiryCount,
}: {
  displayName: string;
  role: string;
  inquiryCount: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sections = getNavSections(role, inquiryCount);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    const initial = saved === "true";
    setCollapsed(initial);
    document.documentElement.style.setProperty("--sidebar-width", initial ? "72px" : "260px");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
    document.documentElement.style.setProperty("--sidebar-width", collapsed ? "72px" : "260px");
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, searchParams]);

  const initials = displayName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  return (
    <>
      <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        <Icon name="menu" />
      </button>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}

      <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${mobileOpen ? styles.mobileOpen : ""}`}>
        <div className={styles.header}>
          {collapsed ? (
            <button className={styles.collapseBtn} onClick={() => setCollapsed(false)} aria-label="Expand sidebar" title="Expand sidebar">
              <Icon name="expand" size={18} />
            </button>
          ) : (
            <>
              <Link href={ADMIN_PATH} className={styles.brand}>
                <Image src="/assets/logo/kj-admin-logo.png" alt="Kerala Jewellers" width={118} height={42} priority unoptimized />
              </Link>
              <button className={styles.collapseBtn} onClick={() => setCollapsed(true)} aria-label="Collapse sidebar">
                <Icon name="collapse" size={18} />
              </button>
            </>
          )}
        </div>

        <nav className={styles.nav} aria-label="Admin navigation">
          {sections.map((section, si) => (
            <div className={styles.section} key={section.label || si}>
              {section.label && !collapsed && <div className={styles.sectionLabel}>{section.label}</div>}
              <div className={styles.items}>
                {section.items.map((item) => {
                  const active = isActive(pathname, searchParams, item.href, item.exact);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`${styles.link} ${active ? styles.active : ""}`}
                      title={collapsed ? item.label : undefined}
                      prefetch={false}
                    >
                      <span className={styles.icon}><Icon name={item.icon} /></span>
                      {!collapsed && <span className={styles.linkLabel}>{item.label}</span>}
                      {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={styles.footer}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{initials}</div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>{displayName}</span>
                <span className={styles.userRole}>{role}</span>
              </div>
            )}
          </div>
          <Link href={`${ADMIN_PATH}/logout`} className={styles.logoutBtn} title="Logout" aria-label="Logout">
            <Icon name="logout" />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
