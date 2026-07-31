"use client";

import { useState, useCallback } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/lib/data/types";
import styles from "./ProductGrid.module.css";

interface Props {
  initialProducts: Product[];
  metal: string;
  category?: string;
  totalDocs: number;
}

export default function ProductGrid({
  initialProducts,
  metal,
  category,
  totalDocs,
}: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length < totalDocs);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        metal,
        page: String(page),
        limit: "24",
      });
      if (category) params.set("category", category);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.hasNextPage);
      setPage((p) => p + 1);
    } catch {
      // silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }, [metal, page, category]);

  return (
    <>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      {hasMore && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
          <span className={styles.count}>
            {products.length} of {totalDocs}
          </span>
        </div>
      )}
    </>
  );
}
