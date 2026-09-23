import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { metals } from "@/lib/data/utils";
import { getProductsByMetalPaginated, getCategories, getSiteSettings } from "@/lib/data/cms";
import ProductGrid from "@/components/sections/ProductGrid";
import ProductsHero from "@/components/sections/ProductsHero";
import CategoryFilter from "@/components/ui/CategoryFilter";
import styles from "../products.module.css";

export const dynamicParams = true;

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

  const [settings, allCategories, result] = await Promise.all([
    getSiteSettings(),
    getCategories(params.metal),
    getProductsByMetalPaginated(params.metal, 1, 24, categorySlug || undefined, sort),
  ]);

  const sorted = result.products;

  const metalKey = params.metal as "gold" | "silver" | "diamond" | "platinum";
  const heroKey = `${metalKey}Hero` as "goldHero" | "silverHero" | "diamondHero" | "platinumHero";
  const cmsHero = settings.productsPage[heroKey];
  const cleanCategory = categorySlug?.replace(/-(gold|silver|diamond|platinum)$/, "") || "";
  const heroTitle = cleanCategory
    ? `${cleanCategory.charAt(0).toUpperCase() + cleanCategory.slice(1).replace(/-/g, " ")} Collection`
    : cmsHero.title;
  const heroSubtitle = cleanCategory
    ? `Explore our curated selection of ${cleanCategory.replace(/-/g, " ")} jewellery.`
    : cmsHero.subtitle;

  return (
    <>
      <ProductsHero
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={cmsHero.image || metal.heroBg}
        metal={metalKey}
      />
      <section className={styles.section} id="product-grid">
        <div className={styles.container}>
          {metal.description && (
            <p className={styles.metalIntro}>{metal.description}</p>
          )}

          <CategoryFilter categories={allCategories} />
          <ProductGrid
            key={`${categorySlug || "all"}-${sort || "default"}`}
            initialProducts={sorted}
            metal={params.metal}
            category={categorySlug}
            sort={sort}
            totalDocs={result.totalDocs}
          />
        </div>
      </section>
    </>
  );
}
