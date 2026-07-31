"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import styles from "./CustomNav.module.css";

type IconName =
  | "activity"
  | "banner"
  | "box"
  | "category"
  | "dashboard"
  | "folder"
  | "image"
  | "mail"
  | "page"
  | "settings"
  | "users"
  | "menu"
  | "logout";

type NavItem = {
  badge?: number;
  href: string;
  icon: IconName;
  label: string;
};

type NavSection = {
  items: NavItem[];
  label?: string;
};

const sections: NavSection[] = [
  {
    items: [{ href: "/admin", icon: "dashboard", label: "Dashboard" }],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/collections/products", icon: "box", label: "Products" },
      {
        href: "/admin/collections/categories",
        icon: "category",
        label: "Categories",
      },
      {
        href: "/admin/collections/products?where[featured][equals]=true",
        icon: "folder",
        label: "Collections",
      },
      { href: "/admin/collections/media", icon: "image", label: "Media" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/collections/legal-pages", icon: "page", label: "Pages" },
      {
        href: "/admin/globals/site-settings",
        icon: "banner",
        label: "Banners",
      },
      {
        href: "/admin/globals/site-settings",
        icon: "settings",
        label: "Site Settings",
      },
    ],
  },
  {
    label: "Communication",
    items: [
      {
        href: "/admin/collections/inquiries",
        icon: "mail",
        label: "Inquiries",
      },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/collections/admin-users", icon: "users", label: "Users" },
      {
        href: "/admin/collections/audit-logs",
        icon: "activity",
        label: "Activity Logs",
      },
    ],
  },
];

function Icon({ name }: { name: IconName }) {
  const common = {
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
  };

  switch (name) {
    case "activity":
      return (
        <svg {...common}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "banner":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      );
    case "category":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
    case "folder":
      return (
        <svg {...common}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "image":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "page":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      );
  }
}

function isActive(
  pathname: string,
  searchParams: URLSearchParams,
  href: string,
) {
  const [hrefPathname, hrefQuery] = href.split("?");

  if (hrefPathname === "/admin") return pathname === "/admin";

  const pathMatches =
    pathname === hrefPathname || pathname.startsWith(`${hrefPathname}/`);
  if (!pathMatches) return false;

  // If this item HAS a query, check if all its params are present in searchParams
  if (hrefQuery) {
    const hrefParams = new URLSearchParams(hrefQuery);
    for (const [key, value] of Array.from(hrefParams.entries())) {
      if (searchParams.get(key) !== value) {
        return false;
      }
    }
    return true;
  }

  // If this item HAS NO query, it is active UNLESS a more specific nav item matches
  const allNavItems = sections.flatMap((s) => s.items);
  for (const item of allNavItems) {
    const [itemPath, itemQuery] = item.href.split("?");
    if (itemPath === hrefPathname && itemQuery) {
      // Check if this more specific item matches the current searchParams
      const itemParams = new URLSearchParams(itemQuery);
      let matchesAll = true;
      for (const [key, value] of Array.from(itemParams.entries())) {
        if (searchParams.get(key) !== value) {
          matchesAll = false;
          break;
        }
      }
      // If a more specific item matches, the base item should NOT be active
      if (matchesAll) {
        return false;
      }
    }
  }

  return true;
}

export default function CustomNavClient(props: {
  displayName: string;
  inquiries: number;
  role: string;
}) {
  return (
    <Suspense fallback={<aside className={`nav ${styles.sidebar}`} />}>
      <NavContent {...props} />
    </Suspense>
  );
}

function NavContent({
  displayName,
  inquiries,
  role,
}: {
  displayName: string;
  inquiries: number;
  role: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname, searchParams]);

  const initials =
    displayName
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Navigation"
      >
        <Icon name="menu" />
      </button>

      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`nav ${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ""}`}
      >
        <Link
          href="/admin"
          className={styles.brand}
          aria-label="Kerala Jewellers dashboard"
        >
          <Image
            src="/assets/logo/kj-admin-logo.png"
            alt="Kerala Jewellers"
            width={118}
            height={42}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Admin navigation">
          {sections.map((section, sectionIndex) => (
            <div className={styles.section} key={section.label || sectionIndex}>
              {section.label && (
                <div className={styles.sectionLabel}>{section.label}</div>
              )}
              <div className={styles.items}>
                {section.items.map((item) => {
                  const active = isActive(pathname, searchParams, item.href);
                  const badge =
                    item.label === "Inquiries" ? inquiries : item.badge;
                  return (
                    <Link
                      className={`${styles.link} ${active ? styles.active : ""}`}
                      href={item.href}
                      key={item.label}
                      onClick={() => setMobileOpen(false)}
                      prefetch={false}
                    >
                      <span className={styles.icon}>
                        <Icon name={item.icon} />
                      </span>
                      <span>{item.label}</span>
                      {Boolean(badge) && (
                        <span className={styles.badge}>{badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={styles.userCard}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userText}>
            <strong>{displayName}</strong>
            <span>{role}</span>
          </div>
          <Link
            href="/admin/logout"
            className={styles.logoutBtn}
            aria-label="Logout"
          >
            <Icon name="logout" />
          </Link>
        </div>
      </aside>
    </>
  );
}
