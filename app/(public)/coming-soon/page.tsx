import styles from "./coming-soon.module.css";

export const metadata = {
  title: "Coming Soon | Kerala Jewellers",
};

export default function ComingSoonPage() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.banner} />
      </div>
    </section>
  );
}
