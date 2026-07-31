"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "@/app/(public)/about/page.module.css";

interface TimelineEntry {
  year: string;
  title: string;
  text: string;
  image: string;
}

export default function AboutTimeline({ items }: { items: TimelineEntry[] }) {
  const progressRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const progress = progressRef.current;
    const track = trackRef.current;
    if (!progress || !track) return;

    let ticking = false;
    let snapTimer: ReturnType<typeof setTimeout> | null = null;
    let isSnapping = false;

    const handleScroll = () => {
      const scrollTop =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop;
      const viewportMid = scrollTop + window.innerHeight / 2;

      const trackRect = track.getBoundingClientRect();
      const trackTop = trackRect.top + scrollTop;
      const trackHeight = trackRect.height;
      const trackBottom = trackTop + trackHeight;

      let pct = 0;
      if (viewportMid < trackTop) pct = 0;
      else if (viewportMid > trackBottom) pct = 100;
      else pct = ((viewportMid - trackTop) / trackHeight) * 100;
      progress.style.height = `${pct}%`;

      rowsRef.current.forEach((row, i) => {
        const dot = dotsRef.current[i];
        if (!row || !dot) return;
        const rowRect = row.getBoundingClientRect();
        const rowCenter = rowRect.top + scrollTop + rowRect.height / 2;
        const dotPct = ((rowCenter - trackTop) / trackHeight) * 100;
        if (pct >= dotPct) {
          dot.classList.add(styles.timelineDotActive);
        } else {
          dot.classList.remove(styles.timelineDotActive);
        }
      });

      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        if (isSnapping) return;
        if (viewportMid < trackTop || viewportMid > trackBottom) return;

        let nearestY = 0;
        let minDist = Infinity;
        rowsRef.current.forEach((row) => {
          if (!row) return;
          const rect = row.getBoundingClientRect();
          const rowCenter = rect.top + scrollTop + rect.height / 2;
          const dist = Math.abs(viewportMid - rowCenter);
          if (dist < minDist) {
            minDist = dist;
            nearestY = rowCenter;
          }
        });

        const target = nearestY - window.innerHeight / 2;
        if (Math.abs(scrollTop - target) < 4) return;

        isSnapping = true;
        window.scrollTo({ top: target, behavior: "smooth" });
        setTimeout(() => {
          isSnapping = false;
        }, 500);
      }, 200);

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      if (snapTimer) clearTimeout(snapTimer);
    };
  }, []);

  return (
    <div className={styles.timelineWrap}>
      <div className={styles.timelineTrack} ref={trackRef}>
        <div className={styles.timelineProgress} ref={progressRef} />
      </div>

      {items.map((item, i) => (
        <div
          key={item.year + "-" + i}
          ref={(el) => {
            rowsRef.current[i] = el;
          }}
          className={`${styles.timelineRow} ${i % 2 === 0 ? styles.timelineRowLeft : styles.timelineRowRight}`}
        >
          <div className={styles.timelineCard}>
            <span className={styles.timelineYear}>{item.year}</span>
            <h3 className={styles.timelineCardTitle}>{item.title}</h3>
            <p className={styles.timelineText}>{item.text}</p>
          </div>
          <div
            className={styles.timelineDot}
            ref={(el) => {
              dotsRef.current[i] = el;
            }}
          />
          <div className={styles.timelineImageWrap}>
            <Image
              src={item.image}
              alt={item.title}
              className={styles.timelineImage}
              width={420}
              height={470}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
