import Image from "next/image";
import styles from "./ProductsHero.module.css";
import { IMG } from "@/lib/image-urls";

interface ProductsHeroProps {
  title: string;
  subtitle: string;
  bgImage: string;
  metal?: "gold" | "silver" | "diamond";
}

export default function ProductsHero({
  title,
  subtitle,
  bgImage,
  metal = "gold",
}: ProductsHeroProps) {
  return (
    <section className={`${styles.hero} ${styles[metal] || styles.gold}`}>
      <div className={styles.container}>
        <div
          className={styles.banner}
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className={styles.content}>
            <h1 className={styles.heading}>
              {title.split(/<br\s*\/?>/i).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <div className={styles.decorativeLine}>
              <Image
                src={IMG.heroDecorative}
                alt=""
                width={382}
                height={13}
                className={styles.decorativeImg}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <p className={styles.description}>{subtitle}</p>
            <a href="#product-grid" className={styles.cta}>
              <span className={styles.ctaText}>EXPLORE</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
