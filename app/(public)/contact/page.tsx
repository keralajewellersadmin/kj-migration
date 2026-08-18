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
          <div className={styles.infoWrapper}>
            <h2 className={styles.infoTitle}>Get In Touch</h2>
            <p className={styles.infoDesc}>
              Looking for a specific jewellery design, bridal collection, custom
              order, or gold/silver rate update? Our team will guide you with
              product availability, store visit support, and purchase
              assistance.
            </p>

            <div className={styles.contactMethods}>
              <div className={styles.methodCard}>
                <div className={styles.methodIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div className={styles.methodDetails}>
                  <h4>Address</h4>
                  <p>
                    19, Pondy Bazaar, T.Nagar,
                    <br />
                    Chennai - 600017
                  </p>
                </div>
              </div>

              <div className={styles.methodCard}>
                <div className={styles.methodIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.496-4.196-7.092-7.092l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div className={styles.methodDetails}>
                  <h4>Phone</h4>
                  <a href="tel:+914428156711">+91 44 2815 6711</a>
                </div>
              </div>

              <div className={styles.methodCard}>
                <div className={styles.methodIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className={styles.methodDetails}>
                  <h4>Email</h4>
                  <a href="mailto:info@keralajewellers.in">info@keralajewellers.in</a>
                </div>
              </div>
            </div>

            <blockquote className={styles.quote}>
              &ldquo;Send us a message and our team will get back to you shortly.&rdquo;
            </blockquote>

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
                  <path fill="currentColor" d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
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
          
          <ContactForm />
        </div>

        <div>
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
                <div className={styles.branchContent}>
                  <h3 className={styles.branchName}>{branch.name}</h3>
                  <p className={styles.branchAddress}>{branch.address}</p>
                  
                  <div className={styles.branchInfoList}>
                    <div className={styles.branchInfoItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.496-4.196-7.092-7.092l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      <a href={`tel:${branch.phoneFull}`}>{branch.phone}</a>
                    </div>
                    {branch.email && (
                      <div className={styles.branchInfoItem}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <a href={`mailto:${branch.email}`}>{branch.email}</a>
                      </div>
                    )}
                    {branch.hours && (
                      <div className={styles.branchInfoItem}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{branch.hours}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.branchActions}>
                    <a
                      href={`https://www.google.com/maps?q=${branch.mapQ}`}
                      className={styles.branchBtn}
                      target="_blank"
                      rel="noopener"
                      aria-label={`Get directions to Kerala Jewellers ${branch.name}`}
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
