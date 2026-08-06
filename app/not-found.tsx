import Link from "next/link";

export default function NotFound() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "80px 24px",
        textAlign: "center",
        fontFamily: "var(--font-body)",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-decorative)",
          fontSize: "clamp(60px, 10vw, 100px)",
          color: "#991f23",
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <p
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "18px",
          color: "#5a3c3e",
          margin: "16px 0 8px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Page Not Found
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          color: "#7d5f58",
          margin: "0 0 32px",
          maxWidth: 420,
          lineHeight: 1.6,
        }}
      >
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "14px",
          fontWeight: 600,
          color: "#fff",
          backgroundColor: "#ad1c20",
          padding: "12px 32px",
          borderRadius: "5px",
          textDecoration: "none",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          transition: "background-color 0.3s",
        }}
      >
        Back to Home
      </Link>
    </section>
  );
}
