import Image from "next/image";
import styles from "./Heritage.module.css";
import { IMG } from "@/lib/image-urls";

const defaultHeritage = {
  heading: "Intricate & Intimate",
  description:
    "Beautiful heritage-worthy designs have elevated our jewellery.\nExplore a range of personalised selections for different occasions.\nThe right piece can enrich your look and give people something to\nadmire and appreciate.",
  image: IMG.heritageHero,
  srcSet: `${IMG.heritageHeroP1080} 1080w, ${IMG.heritageHeroP1600} 1600w, ${IMG.heritageHeroP2000} 2000w, ${IMG.heritageHero} 2408w`,
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
              alt="Heritage designs, Kerala Jewellers Porur"
              className={styles.heroImage}
              width={600}
              height={400}
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
