import type { LegalSection } from "@/lib/data/legal";
import styles from "./LegalSections.module.css";

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

function renderText(text: string) {
  const parts = text.split(EMAIL_RE);
  const matches = text.match(EMAIL_RE) || [];
  const out: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part) out.push(part);
    if (matches[i]) {
      out.push(
        <a key={i} href={`mailto:${matches[i]}`} className={styles.email}>
          {matches[i]}
        </a>,
      );
    }
  });
  return out;
}

export default function LegalSections({
  sections,
}: {
  sections: LegalSection[];
}) {
  return (
    <div className={styles.sections}>
      {sections.map((section, i) => (
        <section key={i} className={styles.section}>
          {section.title && (
            <h3 className={styles.sectionTitle}>{section.title}</h3>
          )}
          {section.blocks.map((block, j) => {
            if (block.type === "ul") {
              return (
                <ul key={j} className={styles.list}>
                  {block.items.map((item, k) => (
                    <li key={k}>{item}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={j} className={styles.body}>
                {renderText(block.text)}
              </p>
            );
          })}
        </section>
      ))}
    </div>
  );
}
