import type { Metadata } from "next";
import { getProductsByMetalPaginated, getCategories, getSiteSettings } from "@/lib/data/cms";
import { metals } from "@/lib/data/utils";
import ProductGrid from "@/components/sections/ProductGrid";
import ProductsHero from "@/components/sections/ProductsHero";
import CategoryFilter from "@/components/ui/CategoryFilter";
import styles from "./products.module.css";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gold Jewellery Collection — Kerala Jewellers",
  description:
    "Explore our exclusive collection of gold jewellery at Kerala Jewellers. Necklaces, bangles, rings, earrings, and more — crafted for every occasion.",
  openGraph: {
    title: "Gold Jewellery Collection — Kerala Jewellers",
    description:
      "Explore our exclusive collection of gold jewellery at Kerala Jewellers.",
    url: "https://keralajewellers.in/products",
    siteName: "Kerala Jewellers",
    type: "website",
  },
};

export default async function ProductsPage(props: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams.category;
  const sort = searchParams.sort;

  const [settings, allCategories, result] = await Promise.all([
    getSiteSettings(),
    getCategories("gold"),
    getProductsByMetalPaginated("gold", 1, 24, categorySlug || undefined, sort),
  ]);

  const sorted = result.products;

  const goldHero = settings.productsPage.goldHero;
  const cleanCategory = categorySlug?.replace(/-(gold|silver|diamond|platinum)$/, "") || "";
  const heroTitle = cleanCategory
    ? `${cleanCategory.charAt(0).toUpperCase() + cleanCategory.slice(1).replace(/-/g, " ")} Collection`
    : goldHero.title;
  const heroSubtitle = cleanCategory
    ? `Explore our curated selection of ${cleanCategory.replace(/-/g, " ")} jewellery.`
    : goldHero.subtitle;

  return (
    <>
      <ProductsHero
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={goldHero.image || metals.find((m) => m.slug === "gold")!.heroBg}
        metal="gold"
      />
      <section className={styles.section} id="product-grid">
        <div className={styles.container}>
          <CategoryFilter categories={allCategories} />
          <ProductGrid
            key={`${categorySlug || "all"}-${sort || "default"}`}
            initialProducts={sorted}
            metal="gold"
            category={categorySlug}
            sort={sort}
            totalDocs={result.totalDocs}
          />
        </div>
      </section>
    </>
  );
}
