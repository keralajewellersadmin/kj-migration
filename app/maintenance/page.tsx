export const dynamic = "force-static";

export default function MaintenancePage() {
  return (
    <main className="kj-maintenance">
      {/* Top ribbon */}
      <div className="kj-ribbon" aria-hidden />

      <div className="kj-bg-ornament" aria-hidden />

      <div className="kj-wrap">
        <div className="kj-card">
          {/* Logo */}
          <div className="kj-logoWrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/logo 1.png"
              alt="Kerala Jewellers — Since 1959"
              width={220}
              height={72}
              className="kj-logo"
            />
          </div>

          {/* Badge */}
          <div className="kj-badge">
            <span className="kj-badgeDot" aria-hidden />
            Under Construction
            <span className="kj-badgeDot" aria-hidden />
          </div>

          {/* Heading */}
          <h1 className="kj-title">
            We’ll be <span>back soon</span>
          </h1>

          {/* Decorative divider — gold line + diamond */}
          <div className="kj-divider" aria-hidden>
            <span className="kj-dividerLine" />
            <span className="kj-dividerGem">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path
                  d="M12 2 20.5 8.5 12 22 3.5 8.5 12 2Z"
                  fill="#d4af37"
                  stroke="#b58f35"
                  strokeWidth="1.2"
                />
                <path d="M3.5 8.5H20.5M12 2 8 8.5M12 2l4 6.5M12 22 8 8.5M12 22l4-13.5" stroke="#fff" strokeOpacity="0.85" strokeWidth="0.9" />
              </svg>
            </span>
            <span className="kj-dividerLine" />
          </div>

          <p className="kj-subtitle">
            Crafting an even more exquisite experience
          </p>

          <p className="kj-desc">
            Kerala Jewellers is currently under scheduled maintenance to bring you a
            brighter, faster and more beautiful shopping experience. Our craftsmen are
            polishing every detail — please check back shortly.
          </p>

          {/* Info cards */}
          <div className="kj-cards">
            <div className="kj-infoCard">
              <div className="kj-infoIcon" aria-hidden>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path
                    d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
                    stroke="#991f23"
                    strokeWidth="1.7"
                  />
                  <circle cx="12" cy="10" r="2.8" stroke="#b58f35" strokeWidth="1.6" />
                </svg>
              </div>
              <div>
                <strong>Visit Our Stores</strong>
                <span>Purasaiwakkam &amp; Mogappair, Chennai</span>
              </div>
            </div>
            <div className="kj-infoCard">
              <div className="kj-infoIcon" aria-hidden>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                  <path
                    d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.2.9.5 1.8.8 2.6a2 2 0 0 1-.5 2L9 10.6a16 16 0 0 0 4.4 4.4l1.3-1.3a2 2 0 0 1 2-.5c.8.3 1.7.6 2.6.8A2 2 0 0 1 22 16.9Z"
                    stroke="#991f23"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <strong>Need assistance?</strong>
                <a href="tel:+914426615647">044-2661 5647</a>
                <a href="mailto:kjpurasai@gmail.com">kjpurasai@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Timing pill */}
          <div className="kj-timing">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="#7d5f58" strokeWidth="1.6" />
              <path d="M12 7v5l3.5 2" stroke="#7d5f58" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            10:00 AM – 9:00 PM &nbsp;·&nbsp; All days
          </div>

          {/* Progress shimmer */}
          <div className="kj-progress" aria-hidden>
            <div className="kj-progressBar" />
          </div>
          <p className="kj-progressLabel">Polishing every detail — back shortly</p>
        </div>

        {/* Footer */}
        <p className="kj-footer">
          © {new Date().getFullYear()} Kerala Jewellers. All Rights Reserved.
          <span className="kj-footerDot" aria-hidden />
          Crafted with <span style={{ color: "#b00000" }}>♥</span> in Chennai since 1959
        </p>
      </div>

      <style>{`
        .kj-maintenance{
          min-height:100vh;
          min-height:100dvh;
          display:flex;
          flex-direction:column;
          background: radial-gradient(1200px 600px at 50% -10%, rgba(212,175,55,0.12), transparent 60%),
                      radial-gradient(900px 500px at 92% 95%, rgba(153,31,35,0.06), transparent 60%),
                      var(--color-ivory, #fffaf0);
          color: var(--color-charcoal, #4f403d);
          font-family: var(--font-body, "Mulish", sans-serif);
          position:relative;
          overflow:hidden;
        }
        .kj-ribbon{
          height:4px;
          width:100%;
          background: var(--gradient-ribbon, linear-gradient(90deg, #991f23 0%, #d4af37 50%, #991f23 100%));
          flex-shrink:0;
        }
        .kj-bg-ornament{
          position:absolute;
          inset:0;
          pointer-events:none;
          opacity:0.035;
          background-image: radial-gradient(circle at 1px 1px, #991f23 1px, transparent 0);
          background-size: 28px 28px;
        }
        .kj-wrap{
          flex:1;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding: 36px 20px 28px;
          position:relative;
          z-index:1;
        }
        .kj-card{
          width:100%;
          max-width: 640px;
          background: var(--color-white, #fff);
          border: 1px solid var(--color-product-card-border, rgba(181,143,53,0.22));
          border-top: 3px solid var(--color-gold, #d4af37);
          border-radius: 16px;
          box-shadow: var(--shadow-soft, 0 12px 30px rgba(65,35,28,0.06)), 0 8px 32px rgba(153,31,35,0.07);
          padding: 40px 36px 32px;
          text-align:center;
          position:relative;
          overflow:hidden;
        }
        .kj-card::before{
          content:"";
          position:absolute;
          top:0; left:0; right:0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.45), transparent);
        }
        .kj-logoWrap{
          display:flex;
          justify-content:center;
          margin-bottom: 22px;
        }
        .kj-logo{
          width: 190px;
          height:auto;
          object-fit:contain;
          filter: drop-shadow(0 4px 12px rgba(212,175,55,0.12));
          animation: kj-float 4.5s ease-in-out infinite;
        }
        .kj-badge{
          display:inline-flex;
          align-items:center;
          gap:8px;
          font-family: var(--font-ui, "Montserrat", sans-serif);
          font-size: 11px;
          font-weight:700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-maroon, #991f23);
          background: var(--color-cream, #fff5d8);
          border:1px solid rgba(181,143,53,0.3);
          padding: 7px 16px;
          border-radius: var(--radius-full, 9999px);
          margin: 0 auto 18px;
        }
        .kj-badgeDot{
          width:6px; height:6px;
          border-radius:50%;
          background: var(--color-gold, #d4af37);
          box-shadow: 0 0 0 5px rgba(212,175,55,0.15);
          animation: kj-pulse 1.8s ease-in-out infinite;
        }
        .kj-badgeDot:last-child{ animation-delay: 0.9s; }
        .kj-title{
          font-family: var(--font-decorative, "Com 4 DL", Georgia, serif);
          font-weight:300;
          font-size: clamp(32px, 6vw, 44px);
          line-height:1.05;
          color: var(--color-scheme-heading, #3b2826);
          margin:0 0 14px;
          letter-spacing: -0.02em;
        }
        .kj-title span{
          color: var(--color-maroon-bright, #9f1b1f);
          font-weight:300;
        }
        .kj-divider{
          display:flex;
          align-items:center;
          justify-content:center;
          gap:12px;
          margin: 6px 0 16px;
        }
        .kj-dividerLine{
          height:1px;
          width:72px;
          background: linear-gradient(90deg, transparent, var(--color-gold, #d4af37), transparent);
          opacity:0.9;
        }
        .kj-dividerGem{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          width:28px; height:28px;
          border-radius:50%;
          background: var(--color-ivory, #fffaf0);
          border:1px solid rgba(181,143,53,0.28);
          box-shadow: 0 2px 8px rgba(212,175,55,0.14);
          flex-shrink:0;
        }
        .kj-subtitle{
          font-family: var(--font-ui, "Montserrat", sans-serif);
          font-size: 13px;
          font-weight:600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-gold-muted, #b58f35);
          margin:0 0 14px;
        }
        .kj-desc{
          font-size: 15px;
          line-height:1.75;
          color: var(--color-product-card-category, #7d5f58);
          max-width: 520px;
          margin: 0 auto 26px;
        }
        .kj-cards{
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap:12px;
          text-align:left;
          margin-bottom: 22px;
        }
        .kj-infoCard{
          display:flex;
          gap:12px;
          align-items:flex-start;
          background: var(--color-ivory-soft, #fffdf7);
          border:1px solid var(--color-line, rgba(181,143,53,0.22));
          border-radius: 10px;
          padding: 14px 14px;
        }
        .kj-infoIcon{
          width:36px; height:36px;
          border-radius:10px;
          background:#fff;
          border:1px solid rgba(181,143,53,0.18);
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
          box-shadow: 0 2px 10px rgba(65,35,28,0.05);
        }
        .kj-infoCard strong{
          display:block;
          font-family: var(--font-ui, "Montserrat", sans-serif);
          font-size:12.5px;
          font-weight:700;
          color: var(--color-scheme-heading, #3b2826);
          margin-bottom:2px;
          letter-spacing: -0.01em;
        }
        .kj-infoCard span, .kj-infoCard a{
          display:block;
          font-size:13px;
          line-height:1.5;
          color: var(--color-text-muted, #636363);
          text-decoration:none;
        }
        .kj-infoCard a{ color: var(--color-maroon, #991f23); font-weight:600; }
        .kj-infoCard a:hover{ text-decoration:underline; }
        .kj-timing{
          display:inline-flex;
          align-items:center;
          gap:7px;
          font-family: var(--font-ui, "Montserrat", sans-serif);
          font-size:12px;
          font-weight:600;
          color: var(--color-text-muted, #636363);
          background: var(--color-smoke, #f1f1f1);
          border-radius: 9999px;
          padding: 8px 16px;
          margin: 0 auto 20px;
          letter-spacing:0.02em;
        }
        .kj-progress{
          height:3px;
          background: var(--color-smoke-deep, #e1e1e1);
          border-radius:9999px;
          overflow:hidden;
          margin: 0 0 8px;
        }
        .kj-progressBar{
          height:100%;
          width:42%;
          background: var(--gradient-gold, linear-gradient(135deg, #d4af37 0%, #d2ab00 100%));
          border-radius:9999px;
          animation: kj-shimmer 1.6s ease-in-out infinite;
        }
        .kj-progressLabel{
          font-family: var(--font-ui, "Montserrat", sans-serif);
          font-size:11px;
          font-weight:600;
          letter-spacing:0.08em;
          text-transform: uppercase;
          color: #9a8a7a;
          margin:0;
        }
        .kj-footer{
          margin-top: 22px;
          font-family: var(--font-ui, "Montserrat", sans-serif);
          font-size:11.5px;
          font-weight:500;
          color: #9a8a7a;
          letter-spacing:0.02em;
          display:flex;
          align-items:center;
          gap:10px;
          flex-wrap:wrap;
          justify-content:center;
          text-align:center;
        }
        .kj-footerDot{
          width:3px; height:3px;
          background:#c9bbb0;
          border-radius:50%;
          display:inline-block;
        }
        @keyframes kj-float{ 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-4px)} }
        @keyframes kj-pulse{ 0%,100%{ opacity:1; transform: scale(1)} 50%{ opacity:0.65; transform: scale(0.92)} }
        @keyframes kj-shimmer{ 0%{ transform: translateX(-40%)} 100%{ transform: translateX(280%)} }
        @media (max-width: 640px){
          .kj-wrap{ padding: 24px 16px 20px; }
          .kj-card{ padding: 28px 20px 24px; border-radius: 14px; }
          .kj-cards{ grid-template-columns: 1fr; }
          .kj-logo{ width: 168px; }
          .kj-dividerLine{ width:52px; }
        }
        @media (prefers-reduced-motion: reduce){
          .kj-logo, .kj-badgeDot, .kj-progressBar{ animation: none; }
        }
      `}</style>
    </main>
  );
}
