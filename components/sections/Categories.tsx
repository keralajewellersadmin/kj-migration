import styles from "./Categories.module.css";

const defaultCategories: CategoryTile[] = [
  {
    title: "Golden Allure",
    description:
      "Browse our vast collection of exquisite gold necklaces and get ready to dazzle.",
    ctaText: "View Collection",
    ctaHref: "/products",
    variant: "gold",
    image: "",
  },
  {
    title: "Signature Silver",
    description:
      "Explore our signature silver jewellery and step into your own beautiful light.",
    ctaText: "View Collection",
    ctaHref: "/products/silver",
    variant: "silver",
    image: "",
  },
  {
    title: "Artistic Diamonds",
    description:
      "A diamond ring is more than a piece of jewellery, it's a statement. Make your statement today.",
    ctaText: "View Collection",
    ctaHref: "/products/diamond",
    variant: "diamond",
    image: "",
  },
  {
    title: "Platinum Perfection",
    description:
      "Dive into a wide range of trendy platinum jewellery and stand out from the crowd.",
    ctaText: "Coming Soon",
    ctaHref: "#",
    variant: "platinum",
    image: "",
  },
];

type CategoryTile = {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  variant: string;
  image?: string;
};

export default function Categories({
  categories: cmsCategories = [],
}: {
  categories?: CategoryTile[];
}) {
  const categories = cmsCategories.length ? cmsCategories : defaultCategories;
  return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`${styles.card} ${styles[cat.variant]}`}
              role="img"
              aria-label={cat.title ? `${cat.title} — Kerala Jewellers ${cat.variant} collection` : ""}
              style={cat.image ? {
                backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.35) 0%, transparent 60%), url(${cat.image})`,
              } : undefined}
            >
              <div className={styles.cardContent}>
                <h2 className={styles.heading}>{cat.title}</h2>
                <p className={styles.description}>{cat.description}</p>
                <a href={cat.ctaHref} className={styles.cta}>
                  {cat.ctaText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
