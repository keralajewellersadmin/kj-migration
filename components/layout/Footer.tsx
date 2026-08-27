import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";
import type { SiteSettingsData } from "@/lib/data/cms";
import { DEFAULT_BRANCHES } from "@/lib/data/branches";
import { IMG } from "@/lib/cloudinary/fallbacks";

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
        d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"
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
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
        fill="currentColor"
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
                width={244}
                height={88}
                unoptimized
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

