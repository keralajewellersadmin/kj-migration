import type { Metadata } from "next";
import LegalSections from "@/components/sections/LegalSections";
import { getLegalPageBySlug } from "@/lib/data/cms";
import { termsSections } from "@/lib/data/legal";
import styles from "@/components/LegalPage.module.css";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPageBySlug("terms-conditions");
  const title = page?.seo?.title || "Terms & Conditions — Kerala Jewellers";
  const description =
    page?.seo?.description ||
    "Read the terms and conditions governing purchases and services at Kerala Jewellers.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://keralajewellers.in/terms-conditions",
      siteName: "Kerala Jewellers",
      type: "website",
      images: page?.seo?.ogImage ? [{ url: page.seo.ogImage }] : undefined,
    },
  };
}

export default async function TermsConditionsPage() {
  const page = await getLegalPageBySlug("terms-conditions");
  const sections = page?.sections || termsSections;
  const title = page?.title || "Terms & Conditions";

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
