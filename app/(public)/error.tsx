"use client";

import { useEffect } from "react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Public] Route error:", error);
  }, [error]);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        padding: "60px 24px",
        textAlign: "center",
        fontFamily: "var(--font-body)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-decorative)",
          fontSize: "clamp(32px, 6vw, 48px)",
          color: "#991f23",
          margin: 0,
          lineHeight: 1,
        }}
      >
        Oops
      </h1>
      <p
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "16px",
          color: "#5a3c3e",
          margin: "14px 0 8px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Something went wrong
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          color: "#7d5f58",
          margin: "0 0 24px",
          maxWidth: 420,
          lineHeight: 1.6,
        }}
      >
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={() => reset()}
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "13px",
          fontWeight: 600,
          color: "#fff",
          backgroundColor: "#ad1c20",
          padding: "10px 28px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Try Again
      </button>
    </section>
  );
}
