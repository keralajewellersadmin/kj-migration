"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { IMG } from "@/lib/cloudinary/fallbacks";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

interface RateItem {
  type: string;
  metal: string;
  name: string;
  unit: string;
  price: string;
  coin: string;
  featured?: boolean;
}

const DEFAULT_RATE_TYPES: RateItem[] = [
  {
    type: "gold22",
    metal: "gold",
    name: "GOLD 22 KT",
    unit: "per 1 gram",
    price: "7,450",
    coin: IMG.coinGold,
    featured: true,
  },
  {
    type: "gold18",
    metal: "gold",
    name: "GOLD 18 KT",
    unit: "per 1 gram",
    price: "6,080",
    coin: IMG.coinGold,
  },
  {
    type: "platinum",
    metal: "platinum",
    name: "PLATINUM",
    unit: "per 1 gram",
    price: "3,890",
    coin: IMG.coinPlatinum,
  },
  {
    type: "silver",
    metal: "silver",
    name: "SILVER",
    unit: "per 1 gram",
    price: "92",
    coin: IMG.coinSilver,
  },
];

const DEFAULT_RATES_TEXT =
  "Today's Rate (Updated on: 27-06-2026) ; GOLD 22 KT - \u20B97,450 ; GOLD 18 KT - \u20B96,080 ; PLATINUM 1g - \u20B93,890 ; SILVER 1g - \u20B992";

const MEGA_MENUS = {
  gold: {
    href: "/products",
    label: "Gold",
    image: IMG.megamenuGold,
  },
  silver: {
    href: "/products/silver",
    label: "Silver",
    image: IMG.megamenuSilver,
  },
  diamond: {
    href: "/products/diamond",
    label: "Diamond",
    image: IMG.megamenuDiamond,
  },
  scheme: {
    href: "/swarnavarsha",
    label: "Scheme",
    links: ["Swarnavarsha", "Thanga Mazhai"],
    schemeHrefs: ["/swarnavarsha", "/thanga-mazhai"],
  },
};

function RateChevron() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function RateMenuItem({ item }: { item: RateItem }) {
  return (
    <div
      className={`${styles.rateRow} ${item.featured ? styles.rateRowFeatured : ""}`}
    >
      <span className={styles.rateRowCoin}>
        <Image src={item.coin} alt="" width={38} height={38} unoptimized />
      </span>
      <span className={styles.rateRowMeta}>
        <span className={styles.rateRowName}>{item.name}</span>
        <span className={styles.rateRowUnit}>{item.unit}</span>
      </span>
      <span className={styles.rateRowPrice}>
        ₹{item.price.replace(/^₹/, "")}
      </span>
    </div>
  );
}

interface NavbarRates {
  rateGold22: string;
  rateGold18: string;
  rateSilver: string;
  ratePlatinum: string;
  rateUpdated: string;
}

function buildRateTypes(rates?: NavbarRates): RateItem[] {
  if (!rates) return DEFAULT_RATE_TYPES;
  return [
    {
      ...DEFAULT_RATE_TYPES[0],
      price: rates.rateGold22 || DEFAULT_RATE_TYPES[0].price,
    },
    {
      ...DEFAULT_RATE_TYPES[1],
      price: rates.rateGold18 || DEFAULT_RATE_TYPES[1].price,
    },
    {
      ...DEFAULT_RATE_TYPES[2],
      price: rates.ratePlatinum || DEFAULT_RATE_TYPES[2].price,
    },
    {
      ...DEFAULT_RATE_TYPES[3],
      price: rates.rateSilver || DEFAULT_RATE_TYPES[3].price,
    },
  ];
}

function formatRateDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function buildRatesText(rateTypes: RateItem[], updated: string): string {
  const p = rateTypes.map((r) => `₹${r.price.replace(/^₹/, "")}`);
  const dateStr = formatRateDate(updated);
  return `Today's Rate${dateStr ? ` — ${dateStr}` : ""}  •  GOLD 22 KT ${p[0]}/g  •  GOLD 18 KT ${p[1]}/g  •  PLATINUM ${p[2]}/g  •  SILVER ${p[3]}/g`;
}

export default function Navbar({
  navCategories,
  rates,
}: {
  navCategories: Record<string, Array<{ name: string; slug: string }>>;
  rates?: NavbarRates;
}) {
  const [rateOpen, setRateOpen] = useState(false);
  const [dateStr] = useState(() => formatDate(new Date()));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);
  const rateDropdownRef = useRef<HTMLDivElement>(null);
  const rateTypes = buildRateTypes(rates);
  const ratesText = rates
    ? buildRatesText(rateTypes, rates.rateUpdated || "27-06-2026")
    : DEFAULT_RATES_TEXT;

  useEffect(() => {
    if (!rateOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        rateDropdownRef.current &&
        !rateDropdownRef.current.contains(e.target as Node)
      ) {
        setRateOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [rateOpen]);

  return (
    <header className={styles.header} id="lo">
      <div className={styles.rateStrip} data-kj-ratestrip>
        <div className={styles.track}>
          <span data-mobile-rate>{ratesText}</span>
          <span data-mobile-rate>{ratesText}</span>
          <span data-mobile-rate>{ratesText}</span>
          <span data-mobile-rate>{ratesText}</span>
        </div>
      </div>

      {/* Desktop Header */}
      <div className={styles.desktopHeader} role="banner">
        <div className={styles.headerInner}>
          <div className={styles.layoutContainer}>
            <div className={styles.headerContainer}>
              {/* Brand */}
              <div className={styles.brandArea}>
                <Link
                  className={styles.brand}
                  href="/"
                  aria-label="Kerala Jewellers Home"
                >
                  <Image
                    alt="Kerala Jewellers Logo"
                    src={IMG.logoKj}
                    width={244}
                    height={88}
                    unoptimized
                    style={{ width: "auto", height: "auto" }}
                  />
                </Link>
              </div>

              {/* Nav + Rate */}
              <div className={styles.headerActions}>
                <nav className={styles.navPanel} role="navigation">
                  {/* Rate Dropdown */}
                  <div
                    ref={rateDropdownRef}
                    className={styles.rateDropdown}
                    onMouseEnter={() => setRateOpen(true)}
                    onMouseLeave={() => setRateOpen(false)}
                  >
                    <button
                      className={`${styles.rateToggle} ${rateOpen ? styles.rateToggleOpen : ""}`}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={rateOpen}
                      onClick={() => setRateOpen((v) => !v)}
                    >
                      <span className={styles.rateToggleCoin}>
                        <Image
                          src={IMG.coinGold}
                          alt=""
                          width={28}
                          height={28}
                          unoptimized
                        />
                      </span>
                      <span className={styles.rateToggleLabel}>
                        Gold 22K/1g - {rateTypes[0].price}
                      </span>
                      <span className={styles.rateChevron}>
                        <RateChevron />
                      </span>
                    </button>
                    <div
                      className={`${styles.rateMenu} ${rateOpen ? styles.rateMenuOpen : ""}`}
                      role="menu"
                    >
                      <div className={styles.rateMenuHeader} suppressHydrationWarning>
                        Today&apos;s Price — {dateStr}
                      </div>
                      {rateTypes.map((r, i) => (
                        <Fragment key={r.type}>
                          {i > 0 && r.metal !== rateTypes[i - 1].metal && (
                            <div className={styles.rateDivider} />
                          )}
                          <RateMenuItem item={r} />
                        </Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Gold */}
                  <MegaMenuItem
                    menu={MEGA_MENUS.gold}
                    category="Category"
                    categories={navCategories.gold || []}
                  />
                  {/* Silver */}
                  <MegaMenuItem
                    menu={MEGA_MENUS.silver}
                    category="Category"
                    categories={navCategories.silver || []}
                  />
                  {/* Diamond */}
                  <MegaMenuItem
                    menu={MEGA_MENUS.diamond}
                    category="Category"
                    categories={navCategories.diamond || []}
                  />
                  {/* Platinum */}
                  <div className={styles.navItem}>
                    <Link className={styles.navLink} href="/coming-soon">
                      Platinum
                    </Link>
                  </div>
                  {/* About Us */}
                  <div className={styles.navItem}>
                    <Link className={styles.navLink} href="/about">
                      About Us
                    </Link>
                  </div>
                  {/* Scheme */}
                  <MegaMenuItem
                    menu={MEGA_MENUS.scheme}
                    category="Schemes"
                    textOnly
                    hideViewAll
                  />
                  {/* Contact */}
                  <div className={styles.navItem}>
                    <Link className={styles.navLink} href="/contact">
                      Contact
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileHeaderContainer}>
          <Link
            className={styles.brand}
            href="/"
            aria-label="Kerala Jewellers Home"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Image
              alt="Kerala Jewellers Logo"
              src={IMG.logoKj}
              width={244}
              height={88}
              unoptimized
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <div className={`${styles.headerRight} ${mobileMenuOpen ? styles.headerRightHidden : ""}`}>
            <button
              className={`${styles.mobileMenuToggle} ${mobileMenuOpen ? styles.isOpen : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className={styles.mobileMenuToggle__line}></span>
              <span className={styles.mobileMenuToggle__line}></span>
              <span className={styles.mobileMenuToggle__line}></span>
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <div 
          className={`${styles.mobileNavOverlay} ${mobileMenuOpen ? styles.isOpen : ""}`} 
          onClick={() => setMobileMenuOpen(false)} 
        />

        {/* Mobile Nav Menu */}
        <nav className={`${styles.mobileNav} ${mobileMenuOpen ? styles.isOpen : ""}`} role="navigation" id="mobileMenu">
          <div className={styles.mobileNavHeader}>
            <Link
              className={styles.brand}
              href="/"
              aria-label="Kerala Jewellers Home"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                alt="Kerala Jewellers"
                src={IMG.logoKj}
                width={160}
                height={56}
                unoptimized
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <button
              className={styles.mobileNavClose}
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Link className={styles.mobileMenuLink} href="/products" onClick={() => setMobileMenuOpen(false)}>
              Gold
            </Link>
            <Link className={styles.mobileMenuLink} href="/products/silver" onClick={() => setMobileMenuOpen(false)}>
              Silver
            </Link>
            <Link className={styles.mobileMenuLink} href="/products/diamond" onClick={() => setMobileMenuOpen(false)}>
              Diamond
            </Link>
            <Link className={styles.mobileMenuLink} href="/coming-soon" onClick={() => setMobileMenuOpen(false)}>
              Platinum
            </Link>
            <Link className={styles.mobileMenuLink} href="/about" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>
            <Link className={styles.mobileMenuLink} href="/contact" onClick={() => setMobileMenuOpen(false)}>
              Contact Us
            </Link>
            <MobileAccordion
              menu={MEGA_MENUS.scheme}
              categories={[]}
              textOnly
              hideViewAll
              onNavigate={() => setMobileMenuOpen(false)}
              isOpen={!!openAccordions["scheme"]}
              toggle={() => setOpenAccordions(prev => ({ ...prev, scheme: !prev.scheme }))}
            />
          </div>

          <div className={styles.mobileNavCopyright}>
            &copy; 2026 Kerala Jewellers. All rights reserved.
          </div>
        </nav>
      </div>
    </header>
  );
}

function MegaMenuItem({
  menu,
  category,
  categories,
  textOnly,
  hideViewAll,
}: {
  menu: { href: string; label: string; image?: string; links?: string[]; schemeHrefs?: string[] };
  category: string;
  categories?: Array<{ name: string; slug: string }>;
  textOnly?: boolean;
  hideViewAll?: boolean;
}) {
  const styleName = menu.label.toLowerCase();
  const links: string[] =
    "links" in menu && menu.links
      ? (menu.links as string[])
      : (categories || []).map((c) => c.name);
  const linkLabels =
    "linkLabels" in menu && menu.linkLabels
      ? (menu.linkLabels as string[])
      : undefined;

  return (
    <div className={styles.navItem}>
      <div className={styles.dropdown0}>
        <div className={styles.dropdownToggle}>
          <Link href={menu.href}>
            <span>{menu.label}</span>
          </Link>
        </div>
        <nav
          className={`${styles.megaDropdown} ${textOnly ? styles.megaDropdownNarrow : ""}`}
          data-kj-megamenu={styleName}
        >
          <div className={styles.megaRibbon} />
          <div
            className={`${styles.megaPanel} ${textOnly ? styles.megaPanelNarrow : ""}`}
          >
            <div className={styles.megaCol}>
              <div className={styles.megaHeading}>
                <span>✦</span> {category}
              </div>
              <div className={styles.megaLinks}>
                {links.map((link, i) => {
                  const href =
                    textOnly && menu.href === "#"
                      ? "schemeHrefs" in menu
                        ? (menu as { schemeHrefs?: string[] }).schemeHrefs?.[
                            i
                          ] || "#"
                        : "#"
                      : categories?.[i]
                        ? `${menu.href}?category=${encodeURIComponent(categories[i].slug)}`
                        : `${menu.href}?category=${encodeURIComponent(link)}`;
                  const label = linkLabels ? linkLabels[i] : link;
                  return (
                    <Link
                      key={link + i}
                      className={styles.megaLink}
                      href={href}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
              {!hideViewAll && (
                <Link className={styles.megaViewAll} href={menu.href}>
                  View All
                </Link>
              )}
            </div>
            {!textOnly && "image" in menu && menu.image && (
              <div className={styles.megaImageCol}>
                <div className={styles.megaImage}>
                  <Image
                    src={menu.image}
                    alt={`${menu.label} jewellery`}
                    fill
                    sizes="250px"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

function MobileAccordion({
  menu,
  categories,
  textOnly,
  hideViewAll,
  onNavigate,
  isOpen,
  toggle,
}: {
  menu: { href: string; label: string; image?: string; links?: string[]; schemeHrefs?: string[]; linkLabels?: string[] };
  categories?: Array<{ name: string; slug: string }>;
  textOnly?: boolean;
  hideViewAll?: boolean;
  onNavigate: () => void;
  isOpen: boolean;
  toggle: () => void;
}) {
  const links: string[] =
    "links" in menu && menu.links
      ? (menu.links as string[])
      : (categories || []).map((c) => c.name);
  const linkLabels =
    "linkLabels" in menu && menu.linkLabels
      ? (menu.linkLabels as string[])
      : undefined;

  return (
    <div className={styles.mobileAccordion}>
      <button className={`${styles.mobileAccordionToggle} ${isOpen ? styles.isOpen : ""}`} onClick={toggle}>
        <span>{menu.label}</span>
        <svg
          className={`${styles.mobileAccordionIcon} ${isOpen ? styles.isOpen : ""}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`${styles.mobileAccordionContent} ${isOpen ? styles.isOpen : ""}`}>
        <div className={styles.mobileAccordionContentInner}>
          {links.map((link, i) => {
            const href =
              textOnly && menu.href === "#"
                ? "schemeHrefs" in menu
                  ? (menu as { schemeHrefs?: string[] }).schemeHrefs?.[i] || "#"
                  : "#"
                : categories?.[i]
                  ? `${menu.href}?category=${encodeURIComponent(categories[i].slug)}`
                  : `${menu.href}?category=${encodeURIComponent(link)}`;
            const label = linkLabels ? linkLabels[i] : link;
            return (
              <Link key={link + i} className={styles.mobileAccordionLink} href={href} onClick={onNavigate}>
                {label}
              </Link>
            );
          })}
          {!hideViewAll && (
            <Link className={styles.mobileAccordionViewAll} href={menu.href} onClick={onNavigate}>
              View All {menu.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}


