import styles from "./page.module.css";
import { getSiteSettings } from "@/lib/data/cms";

const DEFAULT_BENEFITS = [
  "NO WASTAGE",
  "NO MAKING CHARGES",
  "ONLY PAY GST ON REDEEMED WEIGHT",
];

const DEFAULT_WHY_CHOOSE = [
  "One-time deposit: old gold or equivalent cash",
  "11-month maturity period",
  "Redeem in gold, diamond, silver",
  "Pay only GST, no extra charges",
  "100% purity & transparent valuation",
  "Available at 3 Chennai outlets",
  "Only one-time deposit allowed",
  "Redemption strictly in jewellery, not cash",
  "Aadhar & address proof required",
  "Scheme cannot be clubbed with offers",
  "Early closure allowed (V.A. Charges apply)",
  "Redeem only at the original outlet",
  "Scheme for individuals aged 18+",
  "Kerala Jewellers reserves the rights to modify the terms",
];

export default async function ThangaMazhaiPage() {
  const settings = await getSiteSettings();
  const tm = settings.thangaMazhai;

  const benefits = tm.benefits?.length
    ? tm.benefits.map((b) => b.text)
    : DEFAULT_BENEFITS;

  const whyChoose = tm.whyChoose?.length
    ? tm.whyChoose.map((w) => w.text)
    : DEFAULT_WHY_CHOOSE;

  const title = tm.title || "Thanga Mazhai Scheme";
  const heading = tm.heading || "THANGA MAZHAI IS A ONE TIME INVESTMENT SCHEME WHERE YOU CAN DEPOSIT";
  const description = tm.description || "Old gold ornaments of 916 purity or equivalent cash value (via card, UPI, etc.)";
  
  const bannerStyle = tm.banner
    ? { backgroundImage: `url(${tm.banner})` }
    : undefined;

  return (
    <>
      <div className={styles.bannerWrap}>
        <div className={styles.banner} style={bannerStyle} />
      </div>

      <div className={styles.richText}>
        <h1 style={{ display: "none" }}>{title}</h1>
        <h4 className={styles.schemeHeading}>
          <strong>{heading}</strong>
        </h4>

        <p>{description}</p>

        <p className={styles.uppercase}>
          AFTER 11 MONTHS (335 DAYS), WALK IN AND CHOOSE FROM Our latest
          jewellery collections redeem your deposit for new gold, diamond, or
          silver jewellery.
        </p>

        <ul>
          {benefits.map((b, i) => (
            <li key={i}>
              <strong>{b}</strong>
            </li>
          ))}
        </ul>

        <p>
          YOU CAN ALSO EXCHANGE YOUR OLD JEWELLERY TO JOIN THE PRE-BOOKING.
        </p>

        <p>
          <strong>WHY CHOOSE THANGA MAZHAI</strong>
        </p>

        <ul>
          {whyChoose.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <p>
          All scheme redemptions must be done at the same branch where you
          enrolled. T&amp;C apply.
        </p>

        <p>
          You get new jewellery of exactly the same weight as your old jewel.
          (Just one percent (1%) will be deducted as melting and purifying
          charges).
          <br />
          Valuation of your old jewels will be based on BIS 916 hallmark
          standards.
        </p>

        <p>Questions &amp; Contact Information</p>

        <p>
          If you have any questions, please do not hesitate to contact us via
          mobile at <strong>+91 95660 11899</strong>,{" "}
          <strong>+91 93810 11742</strong>,{" "}
          <strong>+91 74488 42244</strong> or email us at{" "}
          <strong>pondybazaar@keralajewellers.in</strong> or visit us at our
          other branches in Pondy Bazaar, Purasaiwalkam or Porur.
        </p>
      </div>
    </>
  );
}
