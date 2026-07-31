"use client";

import { Suspense, lazy } from "react";

const Reviews = lazy(() => import("@/components/sections/Reviews"));

type Review = {
  text: string;
  author: string;
  location: string;
};

function ReviewsSkeleton() {
  return (
    <section
      style={{ minHeight: 320, background: "var(--color-ivory, #fffdf7)" }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 200,
            height: 28,
            margin: "0 auto 12px",
            background: "#e8e0d4",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: 320,
            height: 16,
            margin: "0 auto 40px",
            background: "#e8e0d4",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            width: "80%",
            height: 60,
            margin: "0 auto",
            background: "#e8e0d4",
            borderRadius: 8,
          }}
        />
      </div>
    </section>
  );
}

export default function LazyReviews({ reviews }: { reviews?: Review[] }) {
  return (
    <Suspense fallback={<ReviewsSkeleton />}>
      <Reviews reviews={reviews} />
    </Suspense>
  );
}
