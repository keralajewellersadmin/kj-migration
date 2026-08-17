"use client";

import { useState } from "react";
import styles from "@/app/(public)/contact/page.module.css";
import { apiPost } from "@/lib/api-client";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const { ok, error: err } = await apiPost("/api/inquiry", {
      name: fd.get("name"),
      email: fd.get("email"),
      message: fd.get("message"),
    });
    if (!ok) {
      setError(err || "Submission failed.");
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Send Us a Message</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Name"
              aria-label="Name"
              required
            />
          </div>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email Address*"
              aria-label="Email Address"
              required
            />
          </div>
        </div>
        <textarea
          className={styles.textarea}
          name="message"
          placeholder="Your Message"
          aria-label="Your Message"
          rows={5}
          required
        />
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      {submitted && (
        <p style={{ color: "var(--color-emerald)", marginTop: "12px" }}>
          Thank you! Your message has been received.
        </p>
      )}
      {error && <p style={{ color: "var(--color-bright-red)", marginTop: "12px" }}>{error}</p>}
      <p className={styles.note}>
        Our team typically replies within one business day.
      </p>
    </div>
  );
}
