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
    <>
      <h2 className={styles.formTitle}>Send Us a Message</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Your Name"
              aria-label="Your Name"
              required
            />
          </div>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email Address"
              aria-label="Email Address"
              required
            />
          </div>
        </div>
        <textarea
          className={styles.textarea}
          name="message"
          placeholder="How can we help you?"
          aria-label="Your Message"
          rows={5}
          required
        />
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
      {submitted && (
        <p className={styles.formSuccess}>
          Thank you! Your message has been received. We&apos;ll get back to
          you shortly.
        </p>
      )}
      {error && <p className={styles.formError}>{error}</p>}
      <p className={styles.formNote}>
        Our team typically responds within one business day.
      </p>
    </>
  );
}
