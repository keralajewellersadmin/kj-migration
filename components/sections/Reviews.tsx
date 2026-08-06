"use client";

import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import styles from "./Reviews.module.css";
import SectionHeader from "@/components/ui/SectionHeader";

const baseReviews = [
  {
    text: "When we started shopping for my wedding jewelry, Kerala Jewellers made my dream come true. They truly became a part of our big day. Thank you for making my wedding sparkle!",
    author: "Shruthi",
    location: "Kodambakkam",
  },
  {
    text: "For my daughter's first birthday, we wanted something meaningful. Kerala Jewellers helped us find the perfect little gold necklace, and their warmth and service made the moment even more special.",
    author: "Pavithra",
    location: "Porur",
  },
  {
    text: "Jewelry isn't just about gold and diamonds, it's about memories. We have been shopping at Kerala Jewellers for years—every festival, wedding, and special occasion is incomplete without their beautifully crafted pieces.",
    author: "Sivanya",
    location: "Pondybazar",
  },
  {
    text: "For our anniversary, I wanted to give my wife something special. Kerala Jewellers helped me pick the most stunning necklace. Every time she wears it, she smiles a little brighter.",
    author: "Srikanth",
    location: "Valasaravakkam",
  },
];

function QuoteIcon() {
  return (
    <svg
      width="32"
      height="24"
      viewBox="0 0 32 24"
      fill="none"
      className={styles.quoteIcon}
    >
      <path
        d="M10 24C4.477 24 0 19.523 0 14V0h10v14H4c0 5.523 4.477 10 10 10v-4zm18 0c-5.523 0-10-4.477-10-10V0h10v14h-6c0 5.523 4.477 10 10 10v-4z"
        fill="#991f23"
      />
    </svg>
  );
}

type Review = {
  text: string;
  author: string;
  location: string;
};

export default function Reviews({
  reviews: cmsReviews = [],
}: {
  reviews?: Review[];
}) {
  const base = cmsReviews.length ? cmsReviews : baseReviews;
  const reviews = [...base, ...base];
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      setActiveIdx(swiper.realIndex % base.length);
    },
    [base.length],
  );

  const handleInit = useCallback(
    (swiper: SwiperClass) => {
      swiperRef.current = swiper;
      setActiveIdx(swiper.realIndex % base.length);
    },
    [base.length],
  );

  const goTo = useCallback((i: number) => {
    swiperRef.current?.slideToLoop(i);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          title="Customer Reviews"
          subtitle="Our Jewelry Isn&apos;t Just Worn. It&apos;s Cherished. Each Piece Tells A Story, And You Can Hear It From Our Customers Who Wear Theirs With Pride."
          subtitleOutside
        />
        <div className={styles.track}>
          <div className={styles.carouselWrap}>
            <Swiper
              onSwiper={handleInit}
              onSlideChange={handleSlideChange}
              modules={[Autoplay]}
              slidesPerView={1.3}
              spaceBetween={24}
              centeredSlides
              loop
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                992: { slidesPerView: 2.0 },
                768: { slidesPerView: 2.0 },
                480: { slidesPerView: 1.6 },
              }}
              className={styles.swiper}
            >
              {reviews.map((review, i) => (
                <SwiperSlide key={i} className={styles.swiperSlide}>
                  <div className={styles.card}>
                    <div className={styles.cardInner}>
                      <QuoteIcon />
                      <p className={styles.text}>{review.text}</p>
                      <div className={styles.author}>
                        &mdash; {review.author}, {review.location}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className={styles.dots}>
              {base.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dotBtn} ${i === activeIdx ? styles.dotActive : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
