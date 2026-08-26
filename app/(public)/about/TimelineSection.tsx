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

export default function TimelineSection({ timeline, intro, heading }: TimelineSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const viewportMid = viewportHeight / 2;
      const currentScroll = scrollTop + viewportMid; // Trigger point is the middle of the screen

      const trackRect = trackRef.current.getBoundingClientRect();
      const trackTop = trackRect.top + scrollTop;
      const trackHeight = trackRect.height;
      const trackBottom = trackTop + trackHeight;

      let percentage = 0;
      if (currentScroll < trackTop) {
        percentage = 0;
      } else if (currentScroll > trackBottom) {
        percentage = 100;
      } else {
        percentage = ((currentScroll - trackTop) / trackHeight) * 100;
      }

      setProgress(percentage);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.timelineSection}>
      <div className={styles.timelineContainer}>
        <div className={styles.timelineIntroWrap}>
          <h2 className={styles.timelineMainTitle}>
            {heading || "Our Origins"}
          </h2>
          {intro && (
            <p className={styles.timelineIntro}>
              {intro}
            </p>
          )}
        </div>

        {/* Desktop: Alternating timeline grid */}
        <div className={styles.timelineDesktop}>
          <div className={styles.timelineGridInner} ref={trackRef}>
            {/* Absolute track in the center */}
            <div className={styles.timelineTrackAbsolute}>
              <div
                className={styles.timelineProgress}
                style={{ height: `${progress}%` }}
              >
                {/* Single moving dot at the bottom of the progress bar */}
                <div className={styles.timelineDot} />
              </div>
            </div>

            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={item.year} className={styles.timelineRow}>
                  {/* Left Side */}
                  <div className={styles.timelineSide}>
                    {isLeft ? (
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
                    ) : (
                      item.image && (
                        <div className={styles.timelineImageCard}>
                          <Image
                            src={item.image}
                            alt={item.title || ""}
                            className={styles.timelineImage}
                            width={380}
                            height={250}
                            loading="lazy"
                          />
                        </div>
                      )
                    )}
                  </div>

                  {/* Center Column Spacer */}
                  <div className={styles.timelineTrackWrap}>
                    <div className={styles.timelineTrackPlaceholder} />
                  </div>

                  {/* Right Side */}
                  <div className={styles.timelineSide}>
                    {!isLeft ? (
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
                    ) : (
                      item.image && (
                        <div className={styles.timelineImageCard}>
                          <Image
                            src={item.image}
                            alt={item.title || ""}
                            className={styles.timelineImage}
                            width={380}
                            height={250}
                            loading="lazy"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: single column */}
        <div className={styles.timelineMobile}>
          <div className={styles.timelineMobileGrid}>
            <div className={styles.timelineMobileTrack}>
              <div
                className={styles.timelineMobileProgress}
                style={{ height: `${progress}%` }}
              >
                <div className={styles.timelineDot} />
              </div>
            </div>
            <div className={styles.timelineMobileGridInner}>
              {timeline.map((item) => (
                <div key={item.year} className={styles.timelineMobileRow}>
                  <div className={styles.timelineMobileItem}>
                    <p className={styles.timelineMobileItemYear}>
                      {item.year}
                    </p>
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
                  {item.image && (
                    <div className={styles.timelineMobileImageWrap}>
                      <Image
                        src={item.image}
                        alt={item.title || ""}
                        className={styles.timelineMobileItemImage}
                        width={400}
                        height={220}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
