import styles from "./page.module.css";
import { swarnavarshaSections } from "@/lib/data/legal";
import { getSiteSettings } from "@/lib/data/cms";

export default async function SwarnavarshaPage() {
  const settings = await getSiteSettings();
  const sw = settings.swarnavarsha;

  const terms = sw.bullets?.length
    ? sw.bullets.map((b) => ({ type: "p" as const, text: b.text, items: [] }))
    : swarnavarshaSections[0].blocks;

  const title = sw.title || "Swarnavarsha Scheme";
  const tcHeading = sw.tcHeading || "TERMS & CONDITIONS:";

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.divider} />
      <div className={styles.content}>
        <p className={styles.schemeName}>Swarnavarsha</p>
        <p className={styles.tcHeading}>{tcHeading}</p>
        {terms.map((block, i) => {
          if (block.type === "p") {
            return (
              <p key={i}>
                {i + 1}. {block.text}
              </p>
            );
          }
          if (block.type === "ul") {
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
