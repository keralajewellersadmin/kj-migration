"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";
import { IMG } from "@/lib/image-urls";

type HeroSlide = {
  heading: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  image?: string;
  isPinned?: boolean;
};

const defaultSlides: HeroSlide[] = [
  {
    heading: "Celebrate\nEvery Precious Moment",
    description:
      "Find jewellery that complements every occasion.\nExplore our exclusive collections in-store & online.",
    ctaText: "EXPLORE",
    ctaHref: "/products",
    image: IMG.heroSlide1,
  },
  {
    heading: "Ethnic Excellence",
    description: "Wrap yourself in a timeless aura with our heritage designs.",
    ctaText: "EXPLORE",
    ctaHref: "/products",
    image: IMG.heroSlide2,
  },
  {
    heading: "Gleaming Gold",
    description:
      "Accessorize in authentic gold featuring assorted embellishments.",
    ctaText: "EXPLORE",
    ctaHref: "/products",
    image: IMG.heroSlide3,
  },
  {
    heading: "What A Bride Wants",
    description:
      "Bridal jewellery that honors tradition, yet feels undeniably yours.",
    ctaText: "EXPLORE",
    ctaHref: "/products",
    image: IMG.heroSlide4,
  },
];

export default function Hero({
  slides: cmsSlides = [],
  paused = false,
}: {
  slides?: HeroSlide[];
  paused?: boolean;
}) {
  const slides = cmsSlides.length ? cmsSlides : defaultSlides;
  const currentRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // If paused, only show the pinned slide (or fallback to the first slide)
  const displayedSlides = paused
    ? [slides.find((s) => s.isPinned) || slides[0]]
    : slides;

  const goTo = useCallback(
    (idx: number) => {
      const total = displayedSlides.length;
      if (total <= 1) return;
      const next = ((idx % total) + total) % total;
      currentRef.current = next;

      const container = containerRef.current;
      if (!container) return;
      const allSlides = container.querySelectorAll<HTMLElement>(
        `.${styles.slide}`,
      );
      allSlides.forEach((s, i) => {
        if (i === next) {
          s.classList.add(styles.active);
        } else {
          s.classList.remove(styles.active);
        }
      });
    },
    [displayedSlides.length],
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      goTo(currentRef.current + 1);
    }, 5000);
  }, [goTo]);

  useEffect(() => {
    if (paused || displayedSlides.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, displayedSlides.length, startTimer]);

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.sliderWrapper}>
          <div className={styles.slider}>
            <div className={styles.stack} ref={containerRef}>
              {displayedSlides.map((slide, i) => {
                const hasText = Boolean(slide.heading || slide.description || slide.ctaText);
                return (
                  <div
                    key={i}
                    className={`${styles.slide} ${i === 0 ? styles.active : ""}`}
                  >
                    <div className={`${styles.banner} ${!hasText ? styles.bannerOnly : ""}`}>
                      {slide.image && (
                        <Image
                          src={slide.image}
                          alt={slide.heading || "Banner"}
                          fill
                          className={styles.bgImage}
                          priority={i === 0}
                        />
                      )}
                      {hasText && (
                        <div className={styles.content}>
                          <h1 className={styles.heading}>{slide.heading}</h1>
                          <div className={styles.textContent}>
                            <div className={styles.decorativeLine}>
                              <Image
                                src={IMG.heroDecorative}
                                alt=""
                                width={400}
                                height={132}
                                className={styles.decorativeImg}
                              />
                            </div>
                            <p className={styles.description}>
                              {slide.description}
                            </p>
                            {slide.ctaText && (
                              <a href={slide.ctaHref} className={styles.cta}>
                                <span className={styles.ctaText}>
                                  {slide.ctaText}
                                </span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
