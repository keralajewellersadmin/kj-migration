import type { Metadata } from "next";
import { getProductsByMetalPaginated, getCategories } from "@/lib/data/cms";
import { metals } from "@/lib/data/utils";
import ProductGrid from "@/components/sections/ProductGrid";
import ProductsHero from "@/components/sections/ProductsHero";
import CategoryFilter from "@/components/ui/CategoryFilter";
import styles from "./products.module.css";

export const revalidate = 300;

export const dynamic = "force-dynamic";

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

  const goldMetal = metals.find((m) => m.slug === "gold")!;
  const allCategories = await getCategories("gold");
  const result = await getProductsByMetalPaginated(
    "gold",
    1,
    24,
    categorySlug || undefined,
  );

  let sorted = result.products;
  if (sort === "asc")
    sorted = [...sorted].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "desc")
    sorted = [...sorted].sort((a, b) => b.name.localeCompare(a.name));

  const heroTitle = categorySlug
    ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, " ")} Collection`
    : goldMetal.heroTitle;
  const heroSubtitle = categorySlug
    ? `Explore our curated selection of ${categorySlug.replace(/-/g, " ")} jewellery.`
    : goldMetal.heroSubtitle;

  return (
    <>
      <ProductsHero
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={goldMetal.heroBg}
        metal="gold"
      />
      <section className={styles.section} id="product-grid">
        <div className={styles.container}>
          <CategoryFilter categories={allCategories} />
          <ProductGrid
            initialProducts={sorted}
            metal="gold"
            category={categorySlug}
            totalDocs={result.totalDocs}
          />
        </div>
      </section>
    </>
  );
}
