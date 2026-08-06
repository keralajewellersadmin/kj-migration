export default function Loading() {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "80px 24px",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid rgba(153, 31, 35, 0.15)",
          borderTopColor: "#991f23",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "14px",
          color: "#7d5f58",
          marginTop: 20,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Loading...
      </p>
    </section>
  );
}
