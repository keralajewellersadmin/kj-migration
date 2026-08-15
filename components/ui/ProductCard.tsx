import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import type { Product } from "@/lib/data/types";
import { normalizeCategory } from "@/lib/data/utils";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const categorySource =
    product.category &&
    product.category.toLowerCase() !== product.metal.toLowerCase()
      ? product.category
      : product.name;
  const displayCategory = normalizeCategory(categorySource, product.metal);

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.media}>
        <div className={styles.header}>
          <div className={styles.title}>{product.name}</div>
          <div className={styles.category}>{displayCategory}</div>
        </div>
        <div className={styles.imageArea}>
          {product.image ? (
            <Image
              src={product.image}
              alt={product.imageAlt || product.name}
              className={styles.image}
              fill
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              sizes="(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
            />
          ) : (
            <div className={styles.image}>No image</div>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <span className={styles.viewBtn}>View Item</span>
      </div>
    </Link>
  );
}
