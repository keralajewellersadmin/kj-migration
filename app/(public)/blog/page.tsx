import type { Metadata } from "next";
import Image from "next/image";
import BlogCard from "@/components/ui/BlogCard";
import { getBlogPosts } from "@/lib/data/cms";
import styles from "./page.module.css";
import { IMG } from "@/lib/image-urls";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Kerala Jewellers",
  description:
    "Shopping guides, lifestyle recommendations, and everything you need to know about gold, silver, and diamond jewellery from Kerala Jewellers.",
  openGraph: {
    title: "Blog — Kerala Jewellers",
    description:
      "Shopping guides, lifestyle recommendations, and everything you need to know about jewellery.",
    url: "https://keralajewellers.in/blog",
    siteName: "Kerala Jewellers",
    type: "website",
  },
};

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();
  return (
    <>
      <section
        className={styles.heroOuter}
        aria-label="Wedding Season promotion"
      >
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>Wedding Season is here</h2>
            <Image
              src={IMG.blogDecorative}
              alt=""
              className={styles.heroImage}
              width={280}
              height={280}
            />
            <p className={styles.heroPara}>
              Embrace the magic of the wedding season with our exquisite
              jewellery collection. Elevate your bridal ensemble or find the
              perfect gift for the happy couple with our stunning array of
              wedding-ready pieces.
            </p>
            <a href="#blog-grid" className={styles.heroBtn}>
              Show Now
            </a>
          </div>
        </div>
      </section>

      <section className={styles.section} id="blog-grid">
        <div className={styles.container}>
          <div className={styles.blogHeader}>
            <h2 className={styles.blogTitle}>Our Blog</h2>
            <p className={styles.blogSubtitle}>
              From Shopping Guides To Lifestyle Recommendations, Explore Our
              Blog And Learn Everything You Need To Know About Jewellery.
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
                Blog posts coming soon. Stay tuned for shopping guides,
                lifestyle tips, and everything about jewellery.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
