import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import type { SiteSettingsData } from "@/lib/data/cms";
import { DEFAULT_BRANCHES } from "@/lib/data/branches";
import { IMG } from "@/lib/image-urls";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="currentColor"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
      />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path
        fill="currentColor"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={styles.checkIcon}
    >
      <polyline
        points="20 6 9 17 4 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" className={styles.infoIcon}>
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" className={styles.infoIcon}>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" className={styles.infoIcon}>
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" className={styles.infoIcon}>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="12 6 12 12 16 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Branch = (typeof DEFAULT_BRANCHES)[number];

function BranchCard({ branch }: { branch: Branch }) {
  const embedUrl =
    branch.mapEmbedUrl ||
    `https://www.google.com/maps?q=${branch.mapQ}&output=embed`;
  return (
    <div className={styles.branchCard}>
      <div className={styles.branchMap}>
        <iframe
          src={embedUrl}
          title={`${branch.name} Branch`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <h3 className={styles.branchName}>{branch.name}</h3>
      <p className={styles.branchAddress}>{branch.address}</p>
      <p className={styles.branchPhone}>
        <strong>Phone:</strong>{" "}
        <a href={`tel:${branch.phoneFull}`}>{branch.phone}</a>
      </p>
      {branch.email && (
        <p className={styles.branchPhone}>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${branch.email}`}>{branch.email}</a>
        </p>
      )}
      {branch.hours && (
        <p className={styles.branchPhone}>
          <strong>Hours:</strong> {branch.hours}
        </p>
      )}
      <div className={styles.branchActions}>
        <a href={`tel:${branch.phoneFull}`} className={styles.branchBtn}>
          Call Store
        </a>
        <a
          href={`https://www.google.com/maps?q=${branch.mapQ}`}
          className={`${styles.branchBtn} ${styles.branchBtnOutline}`}
          target="_blank"
          rel="noopener"
          aria-label={`Get directions to Kerala Jewellers ${branch.name}`}
        >
          Get Directions
        </a>
      </div>
    </div>
  );
}

export default function Footer({
  hideMaps = false,
  settings,
}: {
  hideMaps?: boolean;
  settings?: SiteSettingsData;
}) {
  const branches = settings?.branches?.length
    ? settings.branches
    : DEFAULT_BRANCHES;
  const footerAbout =
    settings?.footerAbout ||
    "Celebrating tradition, elegance, and craftsmanship through thoughtfully curated jewellery collections designed for every milestone and memorable occasion.";
  const phone = settings?.phone || "044-2661 5647";
  const phoneHref = phone.replace(/[^\d+]/g, "");
  const whatsapp = settings?.whatsapp || "+91 93810 11742";
  const whatsappHref = whatsapp.replace(/[^\d]/g, "");
  const email = settings?.email || "kjpurasai@gmail.com";
  const storeTiming = settings?.storeTiming || "10:00 AM - 9:00 PM";

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.support}>
            <Link
              href="/"
              className={styles.logoLink}
              aria-label="Kerala Jewellers Home"
            >
              <Image
                className={styles.logo}
                alt="Kerala Jewellers Logo"
                src={IMG.logoKj}
                width={170}
                height={57}
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <h4 className={styles.heading}>CUSTOMER SUPPORT</h4>
            <div className={styles.linksGrid}>
              <Link href="/contact">Contact Us</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/blog">Blogs</Link>
              <Link href="/terms-conditions">Terms &amp; Conditions</Link>
            </div>
            <div className={styles.socials}>
              <a
                href={
                  settings?.instagramUrl ||
                  "https://www.instagram.com/keralajewellers1959/"
                }
                target="_blank"
                aria-label="Visit Kerala Jewellers on Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={
                  settings?.facebookUrl ||
                  "https://www.facebook.com/KeralaJewellers"
                }
                target="_blank"
                aria-label="Visit Kerala Jewellers on Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={
                  settings?.youtubeUrl ||
                  "https://www.youtube.com/@kerala_jewellers"
                }
                target="_blank"
                aria-label="Visit Kerala Jewellers on YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>

          <div className={styles.storeInfo}>
            <h4 className={styles.heading}>ABOUT KERALA JEWELLERS</h4>
            <p className={styles.description}>{footerAbout}</p>
            <ul className={styles.featuresList}>
              <li>
                <CheckIcon />
                <span>Gold, Silver &amp; Diamond Jewellery</span>
              </li>
              <li>
                <CheckIcon />
                <span>Contemporary &amp; Traditional Designs</span>
              </li>
              <li>
                <CheckIcon />
                <span>Trusted Shopping Experience</span>
              </li>
              <li>
                <CheckIcon />
                <span>Dedicated Customer Support</span>
              </li>
            </ul>
            <div className={styles.infoGrid}>
              <div className={styles.infoBlock}>
                <strong>
                  <PhoneIcon />
                  Phone
                </strong>
                <a href={`tel:${phoneHref}`}>{phone}</a>
              </div>
              <div className={styles.infoBlock}>
                <strong>
                  <WhatsAppIcon />
                  WhatsApp
                </strong>
                <a href={`https://wa.me/${whatsappHref}`}>{whatsapp}</a>
              </div>
              <div className={styles.infoBlock}>
                <strong>
                  <EmailIcon />
                  Email
                </strong>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
              <div className={styles.infoBlock}>
                <strong>
                  <ClockIcon />
                  Store Timing
                </strong>
                <p>{storeTiming}</p>
              </div>
            </div>
          </div>
        </div>

        {!hideMaps && (
          <div className={styles.branches}>
            {branches.map((b) => (
              <BranchCard key={b.name} branch={b} />
            ))}
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <div className={styles.container}>
          <p>&copy; Kerala Jewellers. All Rights Reserved.</p>
          <p>Crafted by Random Stacks Technologies</p>
        </div>
      </div>
    </footer>
  );
}
