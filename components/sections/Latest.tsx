import Image from "next/image";
import styles from "./Latest.module.css";
import { IMG } from "@/lib/image-urls";
import SectionHeader from "@/components/ui/SectionHeader";

const defaultBanners = [
  {
    blockType: "imageBanner" as const,
    image: IMG.latestBanner1,
    alt: "Diamond ring handcrafted daily wear jewels",
    ctaText: "Explore Collection",
    href: "/products/diamond",
  },
  {
    blockType: "imageBanner" as const,
    image: IMG.latestBanner2,
    alt: "Diamond Ring",
    title: "Diamond Ring",
    ctaText: "View Collection",
    href: "/products/diamond",
  },
  {
    blockType: "imageBanner" as const,
    image: IMG.latestBanner3,
    alt: "Daily wear diamond jewellery from Kerala Jewellers Porur",
    ctaText: "Discover More",
    href: "/products/diamond",
  },
];

type LatestBanner = {
  blockType: string;
  image?: string;
  alt?: string;
  title?: string;
  ctaText?: string;
  href?: string;
  heading?: string;
  description?: string;
  ctaLink?: string;
  bgColor?: string;
};

export default function Latest({
  banners: cmsBanners = [],
}: {
  banners?: LatestBanner[];
}) {
  const hasImages = cmsBanners.every((b) => !!b.image);
  const banners =
    cmsBanners.length && hasImages ? cmsBanners : defaultBanners;
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          title="Our Latest"
          subtitle="Check out some of the latest designs in our ever-expanding collection."
        />
        <div className={styles.banners}>
          {banners.map((banner, i) => {
            if (banner.blockType === "textBanner") {
              return (
                <div
                  key={i}
                  className={styles.banner}
                  style={{
                    backgroundColor: banner.bgColor || "var(--color-maroon)",
                  }}
                >
                  <div className={styles.overlay}>
                    <div className={styles.bannerTitle}>
                      {banner.heading || ""}
                    </div>
                    {banner.description && (
                      <p
                        style={{
                          margin: "0 0 16px",
                          fontSize: "14px",
                          lineHeight: 1.5,
                          opacity: 0.9,
                        }}
                      >
                        {banner.description}
                      </p>
                    )}
                    {banner.ctaText && (
                      <a href={banner.ctaLink || "#"} className={styles.cta}>
                        {banner.ctaText}
                      </a>
                    )}
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className={styles.banner}>
                {banner.image && (
                  <Image
                    src={banner.image}
                    alt={banner.alt || ""}
                    className={styles.bannerImage}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 991px) 728px, 940px"
                    loading="lazy"
                  />
                )}
                <div className={styles.overlay}>
                  {banner.title && (
                    <div className={styles.bannerTitle}>{banner.title}</div>
                  )}
                  {banner.href && banner.ctaText && (
                    <a href={banner.href} className={styles.cta}>
                      {banner.ctaText}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
