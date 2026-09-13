import Image from "next/image";
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
            <Image
              src={imageSrc}
              alt="Heritage designs by Kerala Jewellers showcasing intricate traditional jewellery craftsmanship"
              className={styles.heroImage}
              width={800}
              height={600}
              sizes="(max-width: 991px) 100vw, 462px"
              loading="lazy"
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

