import { getSiteSettings } from "@/lib/data/cms";
import styles from "./coming-soon.module.css";

export const revalidate = 300;

export const metadata = {
  title: "Coming Soon | Kerala Jewellers",
};

export default async function ComingSoonPage() {
  const settings = await getSiteSettings();
  const bannerUrl =
    settings.productsPage?.platinumHero?.image ||
    "/assets/images/67a73a3dbb8c680323ef26c4_KJ%20WEBSITE%20BANNER-01.webp";

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div
          className={styles.banner}
          style={{ backgroundImage: `url(${bannerUrl})` }}
        />
      </div>
    </section>
  );
}
