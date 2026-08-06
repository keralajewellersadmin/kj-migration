import Image from "next/image";
import styles from "./SectionHeader.module.css";
import { IMG } from "@/lib/image-urls";

export default function SectionHeader({
  title,
  subtitle,
  subtitleOutside = false,
}: {
  title: string;
  subtitle?: string;
  subtitleOutside?: boolean;
}) {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {subtitleOutside && subtitle ? (
        <>
          <div className={styles.borderBox}>
            <Image
              src={IMG.separator}
              alt=""
              className={styles.separator}
              width={940}
              height={20}
              loading="lazy"
            />
          </div>
          <p className={styles.subtitle}>{subtitle}</p>
        </>
      ) : (
        <div className={styles.borderBox}>
          <Image
            src={IMG.separator}
            alt=""
            className={styles.separator}
            width={940}
            height={20}
            loading="lazy"
          />
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
    </div>
  );
}
