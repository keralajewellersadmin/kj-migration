export default function MaintenancePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff8f0",
        color: "#3b2826",
        fontFamily: "Mulish, sans-serif",
        textAlign: "center",
        padding: "40px 20px",
      }}
    >
      <img
        src="/assets/images/logo 1.png"
        alt="Kerala Jewellers"
        style={{ width: 180, height: "auto", marginBottom: 32 }}
      />
      <h1
        style={{
          fontFamily: "Com 4 DL, serif",
          fontSize: 42,
          fontWeight: 300,
          color: "#9f1b1f",
          margin: "0 0 12px",
        }}
      >
        We&apos;ll be back soon
      </h1>
      <p style={{ fontSize: 16, lineHeight: 1.6, maxWidth: 480, color: "#7d5f58", margin: 0 }}>
        Kerala Jewellers is currently under maintenance to bring you an even better
        shopping experience. Please check back shortly.
      </p>
    </main>
  );
}
