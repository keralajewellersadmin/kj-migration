"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import styles from "./Features.module.css";
import { IMG } from "@/lib/image-urls";

type Feature = {
  blockType?: string;
  title?: string;
  heading?: string;
  description?: string;
  image?: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  ctaText?: string;
  ctaLink?: string;
};

const defaultFeatures: Feature[] = [
  {
    blockType: "circleBanner",
    title: "Weddings",
    description: "Find the wedding jewellery you've always dreamed of.",
    image: IMG.featuresWeddings,
    srcSet: `${IMG.featuresWeddingsP1080} 1080w, ${IMG.featuresWeddings} 1571w`,
    sizes:
      "(max-width: 479px) 81vw, (max-width: 767px) 49vw, (max-width: 991px) 356px, 462px",
    alt: "Wedding wear, diamond jewellery",
  },
  {
    blockType: "circleBanner",
    title: "Authenticity",
    description:
      "Choose from a wide range of certified and authentic jewellery for all occasions.",
    image: IMG.featuresAuthenticity,
    srcSet: `${IMG.featuresAuthenticityP500} 500w, ${IMG.featuresAuthenticity} 601w`,
    sizes:
      "(max-width: 479px) 89vw, (max-width: 767px) 49vw, (max-width: 991px) 356px, 462px",
    alt: "Artmanship jewellery from Kerala Jewellers",
  },
  {
    blockType: "circleBanner",
    title: "Heritage",
    description:
      "Step back in time and bring a slice of the bejewelled past to the present.",
    image: IMG.featuresHeritage,
    srcSet: `${IMG.featuresHeritageP500} 500w, ${IMG.featuresHeritage} 601w`,
    sizes:
      "(max-width: 479px) 81vw, (max-width: 767px) 49vw, (max-width: 991px) 356px, 462px",
    alt: "Heritage collections of Kerala Jewellers",
  },
];

const SWIPE_THRESHOLD = 40;

export default function Features({
  features: cmsFeatures = [],
}: {
  features?: Feature[];
}) {
  const hasImages = cmsFeatures.every((f) => !!f.image);
  const features =
    cmsFeatures.length && hasImages ? cmsFeatures : defaultFeatures;
  const [active, setActive] = useState(0);
  const isCarousel = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 991px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 991px)").matches,
    () => false,
  );
  const dragRef = useRef(0);
  const startX = useRef(0);
  const dragging = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: number) => {
      setActive((prev) => {
        const next = prev + dir;
        if (next < 0) return features.length - 1;
        if (next >= features.length) return 0;
        return next;
      });
    },
    [features.length],
  );

  const onPointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (!isCarousel) return;
        dragging.current = true;
        startX.current = e.clientX;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      },
      [isCarousel],
    ),
    onPointerMove = useCallback((e: React.PointerEvent) => {
      if (!dragging.current) return;
      dragRef.current = e.clientX - startX.current;
      if (trackRef.current) {
        trackRef.current.style.setProperty(
          "--kj-banner2-drag",
          `${dragRef.current}px`,
        );
        trackRef.current.style.transition = "none";
      }
    }, []),
    onPointerUp = useCallback(() => {
      if (!dragging.current) return;
      dragging.current = false;
      const delta = dragRef.current;
      dragRef.current = 0;
      if (trackRef.current) {
        trackRef.current.style.removeProperty("--kj-banner2-drag");
        trackRef.current.style.transition = "";
      }
      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        go(delta < 0 ? 1 : -1);
      }
    }, [go]);

  const position = (i: number): "active" | "prev" | "next" | "hidden" => {
    if (i === active) return "active";
    if (i === (active - 1 + features.length) % features.length) return "prev";
    if (i === (active + 1) % features.length) return "next";
    return "hidden";
  };

  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <div
          ref={trackRef}
          className={`${styles.grid} ${isCarousel ? styles.carouselTrack : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {features.map((feature, i) => (
              <div
                key={i}
                className={`${styles.item} ${isCarousel ? styles.carouselSlide : ""} ${isCarousel ? styles[`pos-${position(i)}`] : ""}`}
                data-kj-position={isCarousel ? position(i) : undefined}
              >
                {feature.image && (
                  <div className={styles.imageWrap}>
                    <Image
                      src={feature.image}
                      alt={feature.alt || ""}
                      className={styles.image}
                      fill
                      sizes="(max-width: 991px) 340px, 200px"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                )}
                <h2 className={styles.title}>{feature.title}</h2>
                <p className={styles.description}>{feature.description}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
