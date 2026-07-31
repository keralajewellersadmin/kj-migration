import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/data/types";
import styles from "./BlogCard.module.css";

type Props = {
  post: BlogPost;
  headingLevel?: "h2" | "h3";
};

export default function BlogCard({ post, headingLevel = "h2" }: Props) {
  const Heading = headingLevel;
  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      {post.thumbnail && (
        <div className={styles.imageWrap}>
          <Image
            src={post.thumbnail}
            alt={post.title}
            className={styles.image}
            fill
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.content}>
        <Heading className={styles.title}>{post.title}</Heading>
        <p className={styles.excerpt}>{post.excerpt.slice(0, 120)}...</p>
        <span className={styles.readMore}>Read More</span>
      </div>
    </Link>
  );
}
