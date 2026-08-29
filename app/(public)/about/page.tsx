import Image from "next/image";
import { getSiteSettings } from "../../../lib/data/cms";
import styles from "./page.module.css";
import { IMG } from "@/lib/cloudinary/fallbacks";
import TimelineSection from "./TimelineSection";

export const revalidate = 300;

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const { aboutPage } = settings;

  return (
    <main className={styles.aboutPage}>
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroBanner}>
            <div className={`${styles.heroIntro} ${styles.fadeInUp}`}>
              <div className={styles.heroHeadingWrap}>
                <h1 className={styles.heroTitle}>About Us</h1>
              </div>
            </div>

            <div className={`${styles.goldenGrid} ${styles.fadeInUp} ${styles.fadeInUpDelay}`}>
              <div className={styles.goldenImageWrap}>
                <Image
                  src={
                    aboutPage.goldenOccasions.image || IMG.aboutFallback
                  }
                  alt={aboutPage.goldenOccasions.alt}
                  width={940}
                  height={600}
                  sizes="(max-width: 767px) 100vw, (max-width: 991px) 728px, 940px"
                  className={styles.goldenImage}
                  priority
                />
                <div className={styles.imageGlow} aria-hidden />
              </div>
              <div className={styles.goldenContent}>
                <p className={styles.sectionEyebrow}>Kerala Jewellers</p>
                <h2 className={styles.goldenHeading}>
                  {aboutPage.goldenOccasions.heading}
                </h2>
                {aboutPage.goldenOccasions.paragraphs.length > 0 ? (
                  aboutPage.goldenOccasions.paragraphs.map((p, i) => (
                    <div key={i} className={styles.goldenTextWrap}>
                      <p className={styles.goldenText}>{p.text}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className={styles.goldenTextWrap}>
                      <p className={styles.goldenText}>
                        For over five decades, since 1959, Kerala Jewellers has
                        established a gold standard in customer commitment,
                        product purity, and design perfection.
                      </p>
                    </div>
                    <div className={styles.goldenTextWrap}>
                      <p className={styles.goldenText}>
                        From ethnic and heritage selections to relatively modern
                        pieces, we pride ourselves on providing a range of
                        fashionable options &ndash; gold, diamond, rubies,
                        emeralds, silver, platinum, and more.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.tasteSection}>
        <div className={styles.tasteContainer}>
          <div className={`${styles.tasteContent} ${styles.fadeInUp}`}>
            <div className={styles.tasteInner}>
              <p className={styles.tasteEyebrow}>Signature Story</p>
              <h2 className={styles.tasteHeading}>
                {aboutPage.tasteMeetsTradition.heading}
              </h2>
              <p className={styles.tasteText}>
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
        </div>
      </section>

      <TimelineSection
        timeline={aboutPage.timeline}
        intro={aboutPage.origins.intro}
        heading={aboutPage.origins.heading}
      />

      <section className={styles.venturesTitleSection}>
        <div className={styles.venturesContainer}>
          <div className={styles.venturesBanner}>
            <div className={`${styles.venturesIntro} ${styles.fadeInUp}`}>
              <div className={styles.venturesHeadingWrap}>
                <h2 className={styles.venturesMainTitle}>
                  {aboutPage.ventures.heading}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.venturesContentSection}>
        <div className={styles.venturesContentContainer}>
          <div className={`${styles.venturesGrid} ${styles.fadeInUp} ${styles.fadeInUpDelay}`}>
            <div className={styles.venturesImageWrap}>
              <Image
                src={
                  aboutPage.ventures.image || IMG.aboutVenturesFallback
                }
                alt={
                  aboutPage.ventures.alt ||
                  "Aishwarya Mahal — Kerala Jewellers Wedding Hall"
                }
                width={940}
                height={600}
                sizes="100vw"
                className={styles.venturesImage}
                loading="lazy"
              />
              <div className={styles.imageGlow} aria-hidden />
            </div>
            <div className={styles.venturesTextContent}>
              <p className={styles.sectionEyebrow}>Beyond Jewellery</p>
              <h3 className={styles.venturesSubHeading}>
                {aboutPage.ventures.subheading}
              </h3>
              <ul className={styles.venturesBullets}>
                {aboutPage.ventures.bullets.length > 0 ? (
                  aboutPage.ventures.bullets.map((b, i) => (
                    <li key={i} className={styles.venturesBullet}>
                      {b.text}
                    </li>
                  ))
                ) : (
                  <>
                    <li className={styles.venturesBullet}>
                      Kerala Jewellery Group is a well-diversified business with
                      branches in hospitality, wedding/banquet venues, and real
                      estate ventures.
                    </li>
                    <li className={styles.venturesBullet}>
                      We have our own dedicated wedding venue &ndash; Aishwarya
                      Marriage Hall.
                      <ul className={styles.venturesSubBullets}>
                        <li>Fully air-conditioned space.</li>
                        <li>
                          Landmark: Chennai MMDA Metro Station at Koyambedu.
                        </li>
                      </ul>
                    </li>
                    <li className={styles.venturesBullet}>
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

