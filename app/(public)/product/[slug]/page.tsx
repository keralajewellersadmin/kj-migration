import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getRelatedProducts,
  getAllProductSlugs,
} from "@/lib/data/cms";
import ProductImage from "./ProductImage";
import ProductCard from "@/components/ui/ProductCard";
import styles from "./productDetail.module.css";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getAllProductSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  const metal = product.metal.charAt(0).toUpperCase() + product.metal.slice(1);
  const title =
    product.seo?.title ||
    `${product.name} — ${metal} Jewellery | Kerala Jewellers`;
  const description =
    product.seo?.description ||
    product.description ||
    `Shop ${product.name} — ${metal} jewellery at Kerala Jewellers. ${product.purity ? `Purity: ${product.purity}.` : ""} ${product.weight ? `Weight: ${product.weight}.` : ""}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://keralajewellers.in/product/${product.slug}`,
      siteName: "Kerala Jewellers",
      type: "website",
      images: product.seo?.ogImage
        ? [{ url: product.seo.ogImage }]
        : product.image
          ? [{ url: product.image }]
          : undefined,
    },
  };
}

export default async function ProductDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.metal, product.slug, 4);

  const metal = product.metal.charAt(0).toUpperCase() + product.metal.slice(1);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Shop ${product.name} — ${metal} jewellery at Kerala Jewellers.`,
    image: product.image || undefined,
    brand: {
      "@type": "Brand",
      name: "Kerala Jewellers",
    },
    sku: product.code || undefined,
    offers: {
      "@type": "Offer",
      url: `https://keralajewellers.in/product/${product.slug}`,
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.layout}>
            <div className={styles.gallery}>
              <nav className={styles.breadcrumb}>
                <span className={styles.item}>
                  <Link href="/products" className={styles.link}>
                    {product.metal.charAt(0).toUpperCase() +
                      product.metal.slice(1)}{" "}
                    Products
                  </Link>
                  <svg
                    className={styles.divider}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M6 3L11 8L6 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <span className={styles.item}>
                  <Link
                    href={`/product/${product.slug}`}
                    className={styles.breadcrumbCurrent}
                  >
                    {product.name}
                  </Link>
                </span>
              </nav>
              <ProductImage image={product.image} name={product.name} />
            </div>
            <div className={styles.details}>
              <h1 className={styles.name}>{product.name}</h1>
              <div className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Product Name:</span>
                  <span className={styles.infoValue}>{product.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Product Purity:</span>
                  <span className={styles.infoValue}>{product.purity}</span>
                </div>
                {product.weight && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Weight:</span>
                    <span className={styles.infoValue}>{product.weight}</span>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Product Code:</span>
                  <span className={styles.infoValue}>{product.code}</span>
                </div>
              </div>
              <div className={styles.description}>
                <h2 className={styles.descTitle}>Description</h2>
                <p className={styles.descText}>{product.description}</p>
              </div>
              <div className={styles.actions}>
                <Link
                  href={`/enquiry?product=${encodeURIComponent(product.name)}&id=${encodeURIComponent(product.code)}`}
                  className={styles.enquiryBtn}
                >
                  Enquire
                </Link>
                <a href="tel:04426615647" className={styles.callBtn}>
                  Call for Price
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <h2 className={styles.relatedTitle}>Similar Items</h2>
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
