import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metals } from "@/lib/data/utils";
import { getProductsByMetalPaginated, getCategories } from "@/lib/data/cms";
import ProductGrid from "@/components/sections/ProductGrid";
import ProductsHero from "@/components/sections/ProductsHero";
import CategoryFilter from "@/components/ui/CategoryFilter";
import styles from "../products.module.css";

export const revalidate = 300;

export function generateStaticParams() {
  return metals.map((m) => ({ metal: m.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ metal: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const metal = metals.find((m) => m.slug === params.metal);
  if (!metal) return {};
  return {
    title: `${metal.name} Jewellery Collection — Kerala Jewellers`,
    description: metal.description,
    openGraph: {
      title: `${metal.name} Jewellery Collection — Kerala Jewellers`,
      description: metal.description,
      url: `https://keralajewellers.in/products/${metal.slug}`,
      siteName: "Kerala Jewellers",
      type: "website",
    },
  };
}

export default async function MetalProductsPage(props: {
  params: Promise<{ metal: string }>;
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const categorySlug = searchParams.category;
  const sort = searchParams.sort;

  const metal = metals.find((m) => m.slug === params.metal);
  if (!metal) notFound();

  const allCategories = await getCategories(params.metal);
  const result = await getProductsByMetalPaginated(
    params.metal,
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
    : metal.heroTitle;
  const heroSubtitle = categorySlug
    ? `Explore our curated selection of ${categorySlug.replace(/-/g, " ")} jewellery.`
    : metal.heroSubtitle;

  return (
    <>
      <ProductsHero
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={metal.heroBg}
        metal={params.metal as "gold" | "silver" | "diamond"}
      />
      <section className={styles.section} id="product-grid">
        <div className={styles.container}>
          {metal.description && (
            <p className={styles.metalIntro}>{metal.description}</p>
          )}

          <CategoryFilter categories={allCategories} />
          <ProductGrid
            initialProducts={sorted}
            metal={params.metal}
            category={categorySlug}
            totalDocs={result.totalDocs}
          />
        </div>
      </section>
    </>
  );
}
