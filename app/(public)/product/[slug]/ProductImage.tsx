"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./productDetail.module.css";

interface Props {
  image: string;
  name: string;
}

const ZOOM = 3;

export default function ProductImage({ image, name }: Props) {
  const imageRef = useRef<HTMLDivElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const [loupeVisible, setLoupeVisible] = useState(false);

  const draw = useCallback(() => {
    const container = imageRef.current;
    const loupe = loupeRef.current;
    if (!container || !loupe) return;

    const containerRect = container.getBoundingClientRect();
    const img = container.querySelector("img");
    if (!img || !img.naturalWidth) return;

    const imgRect = img.getBoundingClientRect();

    const x = Math.max(0, Math.min(targetRef.current.x, containerRect.width));
    const y = Math.max(0, Math.min(targetRef.current.y, containerRect.height));

    loupe.style.left = `${x}px`;
    loupe.style.top = `${y}px`;

    loupe.style.backgroundImage = `url("${image}")`;
    loupe.style.backgroundSize = `${imgRect.width * ZOOM}px ${imgRect.height * ZOOM}px`;

    const imgOffsetX = imgRect.left - containerRect.left;
    const imgOffsetY = imgRect.top - containerRect.top;
    const imgX = x - imgOffsetX;
    const imgY = y - imgOffsetY;
    const bgX = (imgX / imgRect.width) * 100;
    const bgY = (imgY / imgRect.height) * 100;
    loupe.style.backgroundPosition = `${bgX}% ${bgY}%`;
  }, [image]);

  useEffect(() => {
    if (!loupeVisible) return;
    let raf = 0;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [loupeVisible, draw]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = imageRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    targetRef.current.x = e.clientX - rect.left;
    targetRef.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseEnter = useCallback(() => {
    setLoupeVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setLoupeVisible(false);
  }, []);

  return (
    <div
      className={styles.imageWrapper}
      ref={imageRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt={name}
        className={styles.mainImage}
        fetchPriority="high"
      />
      <div
        ref={loupeRef}
        className={`${styles.loupe} ${loupeVisible ? styles.loupeVisible : ""}`}
      />
    </div>
  );
}
