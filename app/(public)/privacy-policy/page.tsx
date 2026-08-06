import type { Metadata } from "next";
import LegalSections from "@/components/sections/LegalSections";
import { getLegalPageBySlug } from "@/lib/data/cms";
import { privacySections } from "@/lib/data/legal";
import styles from "@/components/styles/LegalPage.module.css";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPageBySlug("privacy-policy");
  const title = page?.seo?.title || "Privacy Policy — Kerala Jewellers";
  const description =
    page?.seo?.description ||
    "Read the privacy policy of Kerala Jewellers. Learn how we collect, use, and protect your personal information.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://keralajewellers.in/privacy-policy",
      siteName: "Kerala Jewellers",
      type: "website",
      images: page?.seo?.ogImage ? [{ url: page.seo.ogImage }] : undefined,
    },
  };
}

export default async function PrivacyPolicyPage() {
  const page = await getLegalPageBySlug("privacy-policy");
  const sections = page?.sections || privacySections;
  const title = page?.title || "Privacy Policy";

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.titleDivider} />
        <LegalSections sections={sections} />
      </div>
    </section>
  );
}
