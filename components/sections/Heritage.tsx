import styles from "./Heritage.module.css";
import { IMG } from "@/lib/cloudinary/fallbacks";

const defaultHeritage = {
  heading: "Intricate & Intimate",
  description:
    "Beautiful heritage-worthy designs have elevated our jewellery.\nExplore a range of personalised selections for different occasions.\nThe right piece can enrich your look and give people something to\nadmire and appreciate.",
  image: IMG.heritageHero,
};

type HeritageItem = typeof defaultHeritage;

export default function Heritage({
  heritage: cmsHeritage = [],
}: {
  heritage?: HeritageItem[];
}) {
  const heritage = cmsHeritage[0] || defaultHeritage;
  const imageSrc = heritage.image || defaultHeritage.image;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.imageSide}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Heritage designs, Kerala Jewellers Porur"
              className={styles.heroImage}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className={styles.textSide}>
            <h2 className={styles.heading}>{heritage.heading}</h2>
            <p className={styles.description}>{heritage.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

