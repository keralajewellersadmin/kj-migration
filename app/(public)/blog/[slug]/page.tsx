import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import BlogCard from "@/components/ui/BlogCard";
import { getRelatedBlogPosts, getBlogPostBySlug } from "@/lib/data/cms";
import styles from "./page.module.css";

export const revalidate = 300;

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  const title = post.seo?.title || `${post.title} — Kerala Jewellers Blog`;
  const description =
    post.seo?.description ||
    post.excerpt ||
    `Read about ${post.title} on the Kerala Jewellers blog.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://keralajewellers.in/blog/${post.slug}`,
      siteName: "Kerala Jewellers",
      type: "article",
      images: post.seo?.ogImage
        ? [{ url: post.seo.ogImage }]
        : post.thumbnail
          ? [{ url: post.thumbnail }]
          : undefined,
    },
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const related = await getRelatedBlogPosts(post.slug, 3);

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <Link href="/blog" className={styles.backLink}>
            &larr; Back to Blog
          </Link>
          <article className={styles.article}>
            <div className={styles.header}>
              <h1 className={styles.title}>{post.title}</h1>
              {post.date && <p className={styles.date}>{post.date}</p>}
            </div>
            <div className={styles.imageWrap}>
              <Image
                src={post.thumbnail}
                alt={post.title}
                className={styles.image}
                width={800}
                height={460}
              />
            </div>
            <div className={styles.content}>
              {post.body?.map((block, i) => {
                if (block.type === "h2") {
                  return (
                    <h2 key={i} className={styles.h2}>
                      {block.text}
                    </h2>
                  );
                }
                if (block.type === "p") {
                  return (
                    <p key={i} className={styles.body}>
                      {block.text}
                    </p>
                  );
                }
                return (
                  <ul key={i} className={styles.list}>
                    {block.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                );
              })}
            </div>
          </article>
          {related.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>More Articles</h2>
              <div className={styles.relatedGrid}>
                {related.map((r) => (
                  <BlogCard key={r.slug} post={r} headingLevel="h3" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
