import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";
import type { Product } from "@/lib/data/types";
import { normalizeCategory } from "@/lib/data/utils";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.media}>
        <span className={styles.title}>{product.name}</span>
        <span className={styles.category}>
          {normalizeCategory(product.category)}
        </span>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt || product.name}
            className={styles.image}
            width={300}
            height={300}
            loading="lazy"
            sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
          />
        ) : (
          <div
            className={styles.image}
            style={{
              background: "var(--theme-elevation-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--theme-elevation-400)",
              fontSize: "14px",
            }}
          >
            No image
          </div>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.viewBtn}>View Item</span>
      </div>
    </Link>
  );
}
