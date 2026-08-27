import type { Metadata } from "next";
import Image from "next/image";
import BlogCard from "@/components/ui/BlogCard";
import { getBlogPosts, getSiteSettings } from "@/lib/data/cms";
import styles from "./page.module.css";
import { IMG } from "@/lib/cloudinary/fallbacks";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog â€” Kerala Jewellers",
  description:
    "Shopping guides, lifestyle recommendations, and everything you need to know about gold, silver, and diamond jewellery from Kerala Jewellers.",
  openGraph: {
    title: "Blog â€” Kerala Jewellers",
    description:
      "Shopping guides, lifestyle recommendations, and everything you need to know about jewellery.",
    url: "https://keralajewellers.in/blog",
    siteName: "Kerala Jewellers",
    type: "website",
  },
};

export default async function BlogPage() {
  const [blogPosts, settings] = await Promise.all([getBlogPosts(), getSiteSettings()]);
  const bp = settings.blogPage;
  return (
    <>
      <section
        className={styles.heroOuter}
        aria-label="Wedding Season promotion"
      >
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroInner}>
              <div className={styles.heroBorderBox}>
                <h2 className={styles.heroTitle}>{bp.promoHeading}</h2>
                <Image
                  src={bp.promoImage || IMG.blogDecorative}
                  alt=""
                  className={styles.heroImage}
                  width={400}
                  height={46}
                  priority
                />
                <p className={styles.heroPara}>{bp.promoDescription}</p>
                <a href={bp.promoCtaHref} className={styles.heroBtn}>
                  {bp.promoCtaText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="blog-grid">
        <div className={styles.container}>
          <div className={styles.blogHeader}>
            <h2 className={styles.blogTitle}>{bp.headerTitle}</h2>
            <p className={styles.blogSubtitle}>
              {bp.headerSubtitle}
            </p>
          </div>
          {blogPosts.length > 0 ? (
            <div className={styles.grid}>
              {blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} headingLevel="h2" />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>
                {bp.emptyText}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

