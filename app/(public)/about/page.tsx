import Image from "next/image";
import { getSiteSettings } from "../../../lib/data/cms";
import AboutTimeline from "@/components/sections/AboutTimeline";
import styles from "./page.module.css";
import { IMG } from "@/lib/image-urls";

export const revalidate = 300;

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const { aboutPage } = settings;

  return (
    <main>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>About Us</h1>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.imageWrap}>
              <Image
                src={aboutPage.goldenOccasions.image || IMG.aboutFallback}
                alt={aboutPage.goldenOccasions.alt}
                width={940}
                height={600}
                className={styles.image}
                priority
              />
            </div>
            <div className={styles.content}>
              <h2 className={styles.heading}>
                {aboutPage.goldenOccasions.heading}
              </h2>
              {aboutPage.goldenOccasions.paragraphs.length > 0 ? (
                aboutPage.goldenOccasions.paragraphs.map((p, i) => (
                  <p key={i} className={styles.text}>
                    {p.text}
                  </p>
                ))
              ) : (
                <>
                  <p className={styles.text}>
                    For over five decades, since 1959, Kerala Jewellers has
                    established a gold standard in customer commitment, product
                    purity, and design perfection.
                  </p>
                  <p className={styles.text}>
                    From ethnic and heritage selections to relatively modern
                    pieces, we pride ourselves on providing a range of
                    fashionable options &ndash; gold, diamond, rubies, emeralds,
                    silver, platinum, and more.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.darkSection}>
        <div className={styles.darkOverlay}>
          <div className={styles.darkContent}>
            <h2 className={styles.darkHeading}>
              {aboutPage.tasteMeetsTradition.heading}
            </h2>
            <p className={styles.darkText}>
              {aboutPage.tasteMeetsTradition.text || (
                <>
                  By choosing authentic craftsmanship and signature style, our
                  brand has defined the way people see luxury and jewellery.
                  Personally, we&apos;ve always wanted to create a jewellery
                  range that caters to each customer&apos;s nuanced needs so
                  they can wear them with pride to special occasions and
                  important milestones, including birthdays and weddings.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <div className={styles.timelineHeader}>
            <h2 className={styles.timelineTitle}>
              {aboutPage.origins.heading}
            </h2>
            <p className={styles.timelineIntro}>
              {aboutPage.origins.intro || (
                <>
                  A glimpse into the history of <em>Kerala Jewellers</em>.
                  Kerala Jewellers is a living tradition, continually evolving
                  while staying true to its roots. Each piece is a narrative of
                  the past, a celebration of the present, and a legacy for the
                  future.
                </>
              )}
            </p>
          </div>
          <AboutTimeline items={aboutPage.timeline} />
        </div>
      </section>

      <section className={styles.venturesSection}>
        <div className={styles.container}>
          <h2 className={styles.venturesTitle}>{aboutPage.ventures.heading}</h2>
          <div className={styles.venturesGrid}>
            <div className={styles.venturesImageWrap}>
              <Image
                src={
                  aboutPage.ventures.image ||
                  "/assets/images/ayswariya-mahal-hero-2.webp"
                }
                alt={
                  aboutPage.ventures.alt ||
                  "Aishwarya Mahal — Kerala Jewellers Wedding Hall"
                }
                width={600}
                height={400}
                className={styles.venturesImage}
                priority
              />
            </div>
            <div className={styles.venturesContent}>
              <h3 className={styles.venturesHeading}>
                {aboutPage.ventures.subheading}
              </h3>
              <ul className={styles.venturesList}>
                {aboutPage.ventures.bullets.length > 0 ? (
                  aboutPage.ventures.bullets.map((b, i) => (
                    <li key={i}>{b.text}</li>
                  ))
                ) : (
                  <>
                    <li>
                      Kerala Jewellery Group is a well-diversified business with
                      branches in hospitality, wedding/banquet venues, and real
                      estate ventures.
                    </li>
                    <li>
                      We have our own dedicated wedding venue &ndash; Aishwarya
                      Marriage Hall.
                      <ul className={styles.venturesSubList}>
                        <li>Fully air-conditioned space.</li>
                        <li>
                          Landmark: Chennai MMDA Metro Station at Koyambedu.
                        </li>
                      </ul>
                    </li>
                    <li>
                      Enjoy picture-perfect weddings at our fully-equipped
                      wedding hall.
                    </li>
                  </>
                )}
              </ul>
              <div className={styles.venturesButtons}>
                <a
                  href={aboutPage.ventures.cta1Href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.venturesBtn}
                >
                  {aboutPage.ventures.cta1Text}
                </a>
                <a
                  href={aboutPage.ventures.cta2Href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.venturesBtn}
                >
                  {aboutPage.ventures.cta2Text}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
