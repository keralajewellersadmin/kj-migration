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
      setError(err || "Submission failed. Please try again.");
    } else {
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.successMessage}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={styles.successTitle}>Message Received</h3>
          <p className={styles.successDesc}>Thank you for reaching out. A client advisor will contact you within one business day.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Send Us a Message</h2>
      <p className={styles.formSubtitle}>For inquiries, appointments, or bespoke requests, please fill out the form below.</p>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fieldRow}>
          <div className={styles.floatingField}>
            <input
              className={styles.floatingInput}
              type="text"
              name="name"
              id="name"
              placeholder=" "
              required
            />
            <label htmlFor="name" className={styles.floatingLabel}>Full Name *</label>
          </div>
          <div className={styles.floatingField}>
            <input
              className={styles.floatingInput}
              type="email"
              name="email"
              id="email"
              placeholder=" "
              required
            />
            <label htmlFor="email" className={styles.floatingLabel}>Email Address *</label>
          </div>
        </div>
        <div className={styles.floatingField}>
          <textarea
            className={styles.floatingTextarea}
            name="message"
            id="message"
            placeholder=" "
            rows={4}
            required
          />
          <label htmlFor="message" className={styles.floatingLabel}>Your Message *</label>
        </div>
        
        {error && <p className={styles.errorText}>{error}</p>}
        
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
