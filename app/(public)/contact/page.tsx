import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/cms";
import { DEFAULT_BRANCHES } from "@/lib/data/branches";
import ContactForm from "@/components/sections/ContactForm";
import styles from "./page.module.css";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact Us — Kerala Jewellers",
  description:
    "Get in touch with Kerala Jewellers. Visit our stores in Pondy Bazaar, Purasawalkam, and Porur, Chennai. For enquiries, call or message us anytime.",
  openGraph: {
    title: "Contact Us — Kerala Jewellers",
    description:
      "Get in touch with Kerala Jewellers. Visit our stores in Chennai.",
    url: "https://keralajewellers.in/contact",
    siteName: "Kerala Jewellers",
    type: "website",
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const cp = settings.contactPage;
  const branches = settings.branches?.length
    ? settings.branches
    : DEFAULT_BRANCHES;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>{cp.heroTitle}</h1>
          <p className={styles.heroSubtitle}>
            {cp.heroSubtitle}
          </p>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.grid}>
          <ContactForm />

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{cp.cardTitle}</h2>
            <div className={styles.infoText}>
              <p>
                {cp.cardDescription}
              </p>
              <ul className={styles.infoList}>
                {cp.cardItems.map((item, i) => (
                  <li key={i}>{item.text}</li>
                ))}
              </ul>
              <p className={styles.quote}>
                &ldquo;{cp.cardQuote}&rdquo;
              </p>
            </div>
            <div className={styles.socialLinks}>
              <a
                href={
                  settings.instagramUrl ||
                  "https://www.instagram.com/keralajewellers1959/"
                }
                target="_blank"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                  />
                </svg>
              </a>
              <a
                href={
                  settings.facebookUrl ||
                  "https://www.facebook.com/KeralaJewellers"
                }
                target="_blank"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  />
                </svg>
              </a>
              <a
                href={
                  settings.youtubeUrl ||
                  "https://www.youtube.com/@kerala_jewellers"
                }
                target="_blank"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.branchesSection}>
          <h2 className={styles.branchesTitle}>{cp.branchesTitle}</h2>
          <div className={styles.branchesGrid}>
            {branches.map((branch) => (
              <div key={branch.name} className={styles.branchCard}>
                <div className={styles.branchMap}>
                  <iframe
                    src={
                      branch.mapEmbedUrl ||
                      `https://www.google.com/maps?q=${branch.mapQ}&output=embed`
                    }
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
                  <a
                    href={`https://www.google.com/maps?q=${branch.mapQ}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.branchBtn}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
