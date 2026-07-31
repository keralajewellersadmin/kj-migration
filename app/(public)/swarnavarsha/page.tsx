"use client";

import styles from "./page.module.css";
import { swarnavarshaSections } from "@/lib/data/legal";

export default function SwarnavarshaPage() {
  const terms = swarnavarshaSections[0].blocks;

  return (
    <div className={styles.layout}>
      <h1 className={styles.title}>Swarnavarsha Scheme</h1>
      <div className={styles.divider} />
      <div className={styles.content}>
        <p className={styles.schemeName}>Swarnavarsha</p>
        <p className={styles.tcHeading}>TERMS &amp; CONDITIONS:</p>
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
