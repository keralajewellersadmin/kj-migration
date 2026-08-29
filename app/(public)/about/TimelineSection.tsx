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

const timelineFallbackImageByYear: Record<string, string> = {
  "1933": "/assets/images/67986b979c74971ca6057553_Frame%202085665174.png",
  "1958": "/assets/images/67986b979c74971ca6057545_Rectangle%20361.png",
  "1959": "/assets/images/67986b979c74971ca605754c_Rectangle%20363.png",
  "1972": "/assets/images/66ae1615ca0720284bf1565b_Rectangle%20369%20(4).png",
  "1988": "/assets/images/66ae249ccb35781959eac6fc_Rectangle%20366%20(6).png",
  "1992": "/assets/images/66ae22bef52614a0871d61a2_Rectangle%20367%20(8).png",
  "2001": "/assets/images/66ae1617c6c2ad9398a45485_Rectangle%20369%20(1).png",
  "2002": "/assets/images/66ae22bea9cab6312ffdd45d_Rectangle%20367%20(7).png",
  "2008": "/assets/images/66ae1616868e2e539cbfc0c9_Rectangle%20368%20(2).png",
  "2015": "/assets/images/66ae16158fbb46cce3ea01a5_Rectangle%20368%20(1).png",
  "2022": "/assets/images/66ae1617c6c2ad9398a45485_Rectangle%20369%20(1).png",
};

const DESKTOP_MILESTONE_SELECTOR = "[data-milestone-desktop]";
const MOBILE_MILESTONE_SELECTOR = "[data-milestone-mobile]";
const MILESTONE_ACTIVE_SELECTOR = "[data-timeline-milestone]";

function TimelineImage({
  item,
  className,
  width,
  height,
}: {
  item: TimelineItem;
  className: string;
  width: number;
  height: number;
}) {
  const fallbackSrc = timelineFallbackImageByYear[item.year] || "";
  const [src, setSrc] = useState(item.image || fallbackSrc);

  useEffect(() => {
    setSrc(item.image || fallbackSrc);
  }, [fallbackSrc, item.image]);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt={item.title || item.year}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      onError={() => {
        if (fallbackSrc && src !== fallbackSrc) {
          setSrc(fallbackSrc);
        }
      }}
    />
  );
}

export default function TimelineSection({
  timeline,
  intro,
  heading,
}: TimelineSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const desktopProgressRef = useRef<HTMLDivElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const [milestones, setMilestones] = useState<number[]>([]);
  const [mobileMilestones, setMobileMilestones] = useState<number[]>([]);

  useEffect(() => {
    let ticking = false;

    const isVisible = (element: HTMLDivElement | null) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && rect.height > 0;
    };

    const collectMilestones = (
      root: HTMLDivElement | null,
      selector: string,
    ) => {
      if (!root || !isVisible(root)) return [];

      const rootEl = root;
      const rootRect = rootEl.getBoundingClientRect();
      const nodes = Array.from(rootEl.querySelectorAll<HTMLElement>(selector));

      return nodes
        .map((node) => {
          const rect = node.getBoundingClientRect();
          const center = rect.top - rootRect.top + rect.height / 2;
          return rootRect.height > 0 ? (center / rootRect.height) * 100 : 0;
        })
        .filter((value) => value >= 0 && value <= 100);
    };

    const updateMilestones = () => {
      setMilestones(
        collectMilestones(trackRef.current, DESKTOP_MILESTONE_SELECTOR),
      );
      setMobileMilestones(
        collectMilestones(mobileTrackRef.current, MOBILE_MILESTONE_SELECTOR),
      );
    };

    const applyProgress = (root: HTMLDivElement | null, progress: number) => {
      if (!root) return;

      const progressBar = root === trackRef.current
        ? desktopProgressRef.current
        : mobileProgressRef.current;

      if (progressBar) {
        progressBar.style.setProperty("--timeline-progress", `${progress / 100}`);
        progressBar.style.setProperty("--timeline-progress-percent", `${progress}`);
      }

      const milestoneNodes = Array.from(
        root.querySelectorAll<HTMLElement>(MILESTONE_ACTIVE_SELECTOR),
      );

      for (const node of milestoneNodes) {
        const topValue = Number(node.dataset.progressTop || "0");
        if (progress >= topValue) {
          node.classList.add(styles.timelineMilestoneActive);
        } else {
          node.classList.remove(styles.timelineMilestoneActive);
        }
      }
    };

    const handleScroll = () => {
      const scrollTop =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const viewportMid = viewportHeight / 2;
      const currentScroll = scrollTop + viewportMid;

      const getTrackProgress = (element: HTMLDivElement | null) => {
        if (!element || !isVisible(element)) return 0;

        const trackEl = element;
        const rect = trackEl.getBoundingClientRect();
        const trackTop = rect.top + scrollTop;
        const trackHeight = rect.height;
        const trackBottom = trackTop + trackHeight;

        if (currentScroll < trackTop) return 0;
        if (currentScroll > trackBottom) return 100;

        return ((currentScroll - trackTop) / trackHeight) * 100;
      };

      const desktopProgress = getTrackProgress(trackRef.current);
      const mobileProgress = getTrackProgress(mobileTrackRef.current);

      applyProgress(trackRef.current, desktopProgress);
      applyProgress(mobileTrackRef.current, mobileProgress);

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", updateMilestones);
    window.addEventListener("resize", handleScroll);
    updateMilestones();
    handleScroll();

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", updateMilestones);
      window.removeEventListener("resize", handleScroll);
    };
  }, [timeline.length]);

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

          <div className={styles.timelineDesktop}>
            <div className={styles.timelineGridWrap} ref={trackRef}>
              <div className={styles.timelineProgress} ref={desktopProgressRef}>
                <div className={styles.timelineProgressFill} />
                <div className={styles.timelineDot} />
              </div>
              {milestones.map((milestone, index) => (
                <span
                  key={`desktop-milestone-${index}`}
                  className={styles.timelineMilestone}
                  style={{ top: `${milestone}%` }}
                  data-progress-top={milestone}
                  data-timeline-milestone
                  aria-hidden
                />
              ))}
              <div className={styles.timelineGrid}>
                {timeline.map((item, index) => {
                  const isLeftText = index % 2 === 0;

                  if (isLeftText) {
                    return (
                      <React.Fragment key={`${item.year}-${index}`}>
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
                        <div
                          className={styles.timelineTrackWrap}
                          data-milestone-desktop
                        >
                          <div className={styles.timelineTrack} />
                        </div>
                        <div className={styles.timelineImageCell}>
                          {item.image || timelineFallbackImageByYear[item.year] ? (
                            <div className={styles.timelineImageCard}>
                              <TimelineImage
                                item={item}
                                className={styles.timelineImage}
                                width={270}
                                height={300}
                              />
                            </div>
                          ) : (
                            <div className={styles.timelineImageCard} aria-hidden />
                          )}
                        </div>
                      </React.Fragment>
                    );
                  }

                  return (
                    <React.Fragment key={`${item.year}-${index}`}>
                      <div className={styles.timelineImageCell}>
                        {item.image || timelineFallbackImageByYear[item.year] ? (
                          <div className={styles.timelineImageCard}>
                            <TimelineImage
                              item={item}
                              className={styles.timelineImage}
                              width={270}
                              height={300}
                            />
                          </div>
                        ) : (
                          <div className={styles.timelineImageCard} aria-hidden />
                        )}
                      </div>
                      <div
                        className={styles.timelineTrackWrap}
                        data-milestone-desktop
                      >
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
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.timelineMobile}>
            <div className={styles.timelineMobileGridWrap} ref={mobileTrackRef}>
              <div className={styles.timelineMobileProgress} ref={mobileProgressRef}>
                <div className={styles.timelineProgressFill} />
                <div className={styles.timelineDot} />
              </div>
              <div className={styles.timelineMobileTrack} />
              {mobileMilestones.map((milestone, index) => (
                <span
                  key={`mobile-milestone-${index}`}
                  className={`${styles.timelineMilestone} ${styles.timelineMilestoneMobile}`}
                  style={{ top: `${milestone}%` }}
                  data-progress-top={milestone}
                  data-timeline-milestone
                  aria-hidden
                />
              ))}
              <div className={styles.timelineMobileGridInner}>
                {timeline.map((item, index) => (
                  <div
                    key={`m-${item.year}-${index}`}
                    className={styles.timelineMobileRow}
                    data-milestone-mobile
                  >
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
                    {item.image || timelineFallbackImageByYear[item.year] ? (
                      <TimelineImage
                        item={item}
                        className={styles.timelineMobileItemImage}
                        width={400}
                        height={220}
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
