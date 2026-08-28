"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-body, system-ui, sans-serif)",
          background: "#fffaf5",
        }}
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-decorative, Georgia, serif)",
              fontSize: "clamp(40px, 8vw, 64px)",
              color: "#991f23",
              margin: 0,
              lineHeight: 1,
            }}
          >
            Oops
          </h1>
          <p
            style={{
              fontFamily: "var(--font-ui, system-ui, sans-serif)",
              fontSize: "18px",
              color: "#5a3c3e",
              margin: "16px 0 8px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Something went wrong
          </p>
          <p
            style={{
              fontFamily: "var(--font-body, system-ui, sans-serif)",
              fontSize: "15px",
              color: "#7d5f58",
              margin: "0 0 8px",
              maxWidth: 420,
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred. Please try again.
          </p>
          {error?.digest && (
            <p style={{ fontSize: "12px", color: "#9a8a86", margin: "0 0 24px" }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            style={{
              fontFamily: "var(--font-ui, system-ui, sans-serif)",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#ad1c20",
              padding: "12px 32px",
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
      </body>
    </html>
  );
}
