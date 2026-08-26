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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the section
      const totalHeight = rect.height;
      // Start progress when top of the section enters the center of viewport
      const start = rect.top - windowHeight / 2;
      const current = -start;
      
      let p = (current / totalHeight) * 100;
      if (p < 0) p = 0;
      if (p > 100) p = 100;
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className={styles.timelineSection}>
      <div className={styles.timelineContainer}>
        <div className={styles.timelineIntroWrap}>
          <h2 className={styles.timelineMainTitle}>
            {heading || "The Origins"}
          </h2>
          {intro && (
            <p className={styles.timelineIntro}>
              {intro}
            </p>
          )}
        </div>

        {/* Desktop: Alternating timeline grid */}
        <div className={styles.timelineDesktop}>
          <div className={styles.timelineGridInner}>
            {/* Absolute track in the center */}
            <div className={styles.timelineTrackAbsolute}>
              <div
                className={styles.timelineProgress}
                style={{ height: `${progress}%` }}
              />
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
                          {item.title ? `${item.title}. ` : ""}
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
                            width={270}
                            height={300}
                            loading="lazy"
                          />
                        </div>
                      )
                    )}
                  </div>

                  {/* Center Dot */}
                  <div className={styles.timelineTrackWrap}>
                    <div className={styles.timelineTrackPlaceholder}>
                      <div className={styles.timelineDot} />
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className={styles.timelineSide}>
                    {!isLeft ? (
                      <div className={`${styles.timelineItemWrap} ${styles.rightAlign}`}>
                        <p className={styles.timelineYear}>{item.year}</p>
                        <p className={styles.timelineText}>
                          {item.title ? `${item.title}. ` : ""}
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
                            width={270}
                            height={300}
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
            <div
              className={styles.timelineMobileProgress}
              style={{ height: `${progress}%` }}
            />
            <div className={styles.timelineMobileGridInner}>
              {timeline.map((item) => (
                <div key={item.year}>
                  <div className={styles.timelineMobileTrack}>
                    <div className={styles.timelineMobileItem}>
                      <p className={styles.timelineMobileItemYear}>
                        {item.year}
                      </p>
                      <p className={styles.timelineMobileItemText}>
                        {item.title ? `${item.title}. ` : ""}
                        {item.text}
                      </p>
                    </div>
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title || ""}
                        className={styles.timelineMobileItemImage}
                        width={400}
                        height={220}
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
