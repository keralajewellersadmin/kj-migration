"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

interface TimelineItem {
  year: string;
  title: string;
  text: string;
  image: string;
}

interface TimelineSectionProps {
  timeline: TimelineItem[];
  intro?: string;
  heading?: string;
}

/**
 * Mirrors origin about.html: vertical alternating timeline
 * (NOT a horizontal marquee). Reference is .timeline_grid with
 * columns 1fr .25fr 1fr, vertical .timeline_progress with scroll
 * height, and duplicated .timeline_inner / .timeline_inner-mobile
 * for responsive (not for seamless loop).
 */
export default function TimelineSection({ timeline, intro, heading }: TimelineSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const updateFor = (el: HTMLDivElement | null) => {
        if (!el) return 0;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const viewportMid = viewportHeight / 2;
        const currentScroll = scrollTop + viewportMid;
        const rect = el.getBoundingClientRect();
        const trackTop = rect.top + scrollTop;
        const trackHeight = rect.height;
        const trackBottom = trackTop + trackHeight;
        if (currentScroll < trackTop) return 0;
        if (currentScroll > trackBottom) return 100;
        return ((currentScroll - trackTop) / trackHeight) * 100;
      };
      // Desktop and mobile share same progress value (single scroll position)
      const desktop = updateFor(trackRef.current);
      const mobile = updateFor(mobileTrackRef.current);
      setProgress(Math.max(desktop, mobile));
    };

    window.addEventListener("scroll", handleScroll, { passive: true } as AddEventListenerOptions);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!timeline.length) return null;

  return (
    <section className={styles.timelineSection}>
      <div className={styles.timelineWrap}>
        <div className={styles.timelinePadding}>
          <div className={styles.timelineHeader}>
            <h2 className={styles.timelineTitle}>{heading || "The Origins"}</h2>
            {intro ? (
              <p className={styles.timelineIntro}>{intro}</p>
            ) : (
              <p className={styles.timelineIntro}>
                A glimpse into the history of <strong><em>Kerala Jewellers</em></strong>. Kerala jewellers is a living
                tradition, continually evolving while staying true to its roots. Each piece is a narrative of the past,
                a celebration of the present, and a legacy for the future.
              </p>
            )}
          </div>

          {/* Desktop+: alternating 3-col grid matching origin .timeline_grid */}
          <div className={styles.timelineDesktop}>
            <div className={styles.timelineGridWrap} ref={trackRef}>
              <div className={styles.timelineProgress} style={{ height: `${progress}%` }}>
                <div className={styles.timelineDot} />
              </div>
              <div className={styles.timelineGrid}>
                {timeline.map((item, i) => {
                  const isLeftText = i % 2 === 0;
                  // Origin alternates: odd rows text-left / image-right, even rows image-left / text-right
                  // For single-image entries we place text on one side, image on the other.
                  return (
                    <React.Fragment key={`${item.year}-${i}`}>
                      {isLeftText ? (
                        <>
                          <div className={`${styles.timelineItemWrap} ${styles.leftAlign}`}>
                            <p className={styles.timelineYear}>{item.year}</p>
                            <p className={`${styles.timelineText} ${styles.alignRight}`}>
                              {item.title ? (
                                <>
                                  <strong>{item.title}</strong>
                                  <br />
                                  <br />
                                </>
                              ) : null}
                              {item.text}
                            </p>
                          </div>
                          <div className={styles.timelineTrackWrap}>
                            <div className={styles.timelineTrack} />
                          </div>
                          <div className={styles.timelineImageCell}>
                            {item.image ? (
                              <div className={styles.timelineImageCard}>
                                <Image
                                  src={item.image}
                                  alt={item.title || item.year}
                                  className={styles.timelineImage}
                                  width={270}
                                  height={300}
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className={styles.timelineImageCard} aria-hidden />
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles.timelineImageCell}>
                            {item.image ? (
                              <div className={styles.timelineImageCard}>
                                <Image
                                  src={item.image}
                                  alt={item.title || item.year}
                                  className={styles.timelineImage}
                                  width={270}
                                  height={300}
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className={styles.timelineImageCard} aria-hidden />
                            )}
                          </div>
                          <div className={styles.timelineTrackWrap}>
                            <div className={styles.timelineTrack} />
                          </div>
                          <div className={`${styles.timelineItemWrap} ${styles.rightAlign}`}>
                            <p className={styles.timelineYear}>{item.year}</p>
                            <p className={styles.timelineText}>
                              {item.title ? (
                                <>
                                  <strong>{item.title}</strong>
                                  <br />
                                  <br />
                                </>
                              ) : null}
                              {item.text}
                            </p>
                          </div>
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile: single-column stack matching origin .timeline_inner-mobile */}
          <div className={styles.timelineMobile}>
            <div className={styles.timelineMobileGridWrap} ref={mobileTrackRef}>
              <div className={styles.timelineMobileProgress} style={{ height: `${progress}%` }}>
                <div className={styles.timelineDot} />
              </div>
              <div className={styles.timelineMobileTrack} />
              <div className={styles.timelineMobileGridInner}>
                {timeline.map((item, i) => (
                  <div key={`m-${item.year}-${i}`} className={styles.timelineMobileRow}>
                    <div className={styles.timelineMobileItem}>
                      <p className={styles.timelineMobileItemYear}>{item.year}</p>
                      <p className={styles.timelineMobileItemText}>
                        {item.title ? (
                          <>
                            <strong>{item.title}</strong>
                            <br />
                            <br />
                          </>
                        ) : null}
                        {item.text}
                      </p>
                    </div>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title || item.year}
                        className={styles.timelineMobileItemImage}
                        width={400}
                        height={220}
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
