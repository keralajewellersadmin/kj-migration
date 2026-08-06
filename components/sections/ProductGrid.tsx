"use client";

import { useState, useCallback } from "react";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/lib/data/types";
import styles from "./ProductGrid.module.css";
import { apiGet } from "@/lib/api-client";

interface Props {
  initialProducts: Product[];
  metal: string;
  category?: string;
  totalDocs: number;
}

interface ProductPage {
  products: Product[];
  hasNextPage: boolean;
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
    const params = new URLSearchParams({ metal, page: String(page), limit: "24" });
    if (category) params.set("category", category);
    const { data, ok } = await apiGet<ProductPage>(`/api/frontend-products?${params}`);
    if (ok && data) {
      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.hasNextPage);
      setPage((p) => p + 1);
    }
    setLoading(false);
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
