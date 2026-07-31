import styles from "./Categories.module.css";

const defaultCategories = [
  {
    title: "Golden Allure",
    description:
      "Browse our vast collection of exquisite gold necklaces and get ready to dazzle.",
    ctaText: "View Collection",
    ctaHref: "/products",
    variant: "gold",
  },
  {
    title: "Signature Silver",
    description:
      "Explore our signature silver jewellery and step into your own beautiful light.",
    ctaText: "View Collection",
    ctaHref: "/products/silver",
    variant: "silver",
  },
  {
    title: "Artistic Diamonds",
    description:
      "A diamond ring is more than a piece of jewellery, it's a statement. Make your statement today.",
    ctaText: "View Collection",
    ctaHref: "/products/diamond",
    variant: "diamond",
  },
  {
    title: "Platinum Perfection",
    description:
      "Dive into a wide range of trendy platinum jewellery and stand out from the crowd.",
    ctaText: "Coming Soon",
    ctaHref: "#",
    variant: "platinum",
  },
];

type CategoryTile = {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  variant: string;
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
            <div key={i} className={`${styles.card} ${styles[cat.variant]}`}>
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
