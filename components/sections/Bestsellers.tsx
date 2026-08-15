import Image from "next/image";
import styles from "./Bestsellers.module.css";
import { getProductsBySlugs } from "@/lib/data/cms";
import { IMG } from "@/lib/image-urls";
import SectionHeader from "@/components/ui/SectionHeader";

const fallbackProducts = [
  {
    title: "Bombay Choker",
    category: "Gold",
    image: IMG.antiqueJimmiki,
    srcSet: `${IMG.antiqueJimmikiP500} 500w, ${IMG.antiqueJimmikiP800} 800w, ${IMG.antiqueJimmiki} 852w`,
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 727px, 939px",
    href: "/product/bombay-choker",
  },
  {
    title: "Kerala Bangles",
    category: "Gold",
    image: IMG.antiqueIdol,
    srcSet: `${IMG.antiqueIdolP500} 500w, ${IMG.antiqueIdolP800} 800w, ${IMG.antiqueIdolP1080} 1080w, ${IMG.antiqueIdolP1600} 1600w, ${IMG.antiqueIdolP2000} 2000w, ${IMG.antiqueIdol} 2048w`,
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 727px, 939px",
    href: "/product/kerala-bangles",
  },
  {
    title: "Diamond Choker",
    category: "Diamond",
    image: IMG.diamondNecklace,
    srcSet: `${IMG.diamondNecklaceP500} 500w, ${IMG.diamondNecklaceP800} 800w, ${IMG.diamondNecklaceP1080} 1080w, ${IMG.diamondNecklaceP1600} 1600w, ${IMG.diamondNecklaceP2000} 2000w, ${IMG.diamondNecklace} 2048w`,
    sizes: "(max-width: 767px) 100vw, (max-width: 991px) 727px, 939px",
    href: "/product/diamond-choker-kjd005",
  },
];

export default async function Bestsellers({
  bestsellerProducts = "",
  title = "Our Bestsellers",
  subtitle = "Choose from among trendy designs and timeless pieces. There&apos;s something for everyone and every occasion.",
}: {
  bestsellerProducts?: string;
  title?: string;
  subtitle?: string;
}) {
  const slugs = bestsellerProducts
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
  const cmsProducts = slugs.length ? await getProductsBySlugs(slugs) : [];
  const cmsProductCards = slugs
    .map((slug) => cmsProducts.find((product) => product.slug === slug))
    .filter((product): product is NonNullable<typeof product> =>
      Boolean(product),
    )
    .filter((product) => product.image && !product.image.startsWith("/"))
    .map((product) => ({
      title: product.name,
      category: product.metal.charAt(0).toUpperCase() + product.metal.slice(1),
      image: product.image,
      srcSet: product.imageSrcset,
      sizes: "(max-width: 767px) 100vw, (max-width: 991px) 727px, 939px",
      href: `/product/${product.slug}`,
    }));
  const products = cmsProductCards.length ? cmsProductCards : fallbackProducts;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          title={title}
          subtitle={subtitle}
        />
        <div className={styles.grid}>
          {products.map((product, i) => (
            <div key={i} className={styles.card}>
              <a href={product.href} className={styles.cardLink}>
                <span className={styles.cornerMark} aria-hidden="true" />
                <div className={styles.cardMedia}>
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      className={styles.cardImage}
                      width={600}
                      height={600}
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{product.title}</h3>
                  <span className={styles.cardCategory}>
                    {product.category}
                  </span>
                  <span className={styles.viewBtn}>View Item</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
