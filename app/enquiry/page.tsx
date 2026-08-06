"use client";

import { Suspense } from "react";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { IMG } from "@/lib/image-urls";

function EnquiryForm() {
  const params = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [productName] = useState(params.get("product") || "");
  const [productId] = useState(params.get("id") || "");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("customerName"),
          phone: fd.get("mobile"),
          email: fd.get("email") || "",
          message: [
            fd.get("city") ? `City: ${fd.get("city")}` : "",
            fd.get("preferredTime")
              ? `Preferred Time: ${fd.get("preferredTime")}`
              : "",
            fd.get("productName") ? `Product: ${fd.get("productName")}` : "",
            fd.get("productId") ? `Product ID: ${fd.get("productId")}` : "",
            fd.get("message") || "",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Submission failed. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (!form) return;
    const fd = new FormData(form);
    const name = fd.get("customerName") || "";
    const mobile = fd.get("mobile") || "";
    const email = fd.get("email") || "";
    const city = fd.get("city") || "";
    const time = fd.get("preferredTime") || "";
    const product = fd.get("productName") || "";
    const pid = fd.get("productId") || "";
    const message = fd.get("message") || "";

    const lines = [
      `*Product Enquiry*`,
      ``,
      `Name: ${name}`,
      `Mobile: ${mobile}`,
      email ? `Email: ${email}` : "",
      city ? `City: ${city}` : "",
      time ? `Preferred Contact: ${time}` : "",
      product ? `Product: ${product}` : "",
      pid ? `Product ID: ${pid}` : "",
      message ? `Message: ${message}` : "",
    ]
      .filter(Boolean)
      .join("%0A");

    window.open(`https://wa.me/919381011742?text=${lines}`, "_blank");
  };

  return (
    <main className={styles.shell}>
      <div className={styles.shellInner}>
        <Link
          className={styles.logo}
          href="/"
          aria-label="Kerala Jewellers home"
        >
          <Image
            fetchPriority="high"
            src={IMG.logoKj}
            alt="Kerala Jewellers"
            width={190}
            height={64}
            unoptimized
          />
        </Link>

        <section className={styles.hero} aria-labelledby="enquiry-title">
          <p className={styles.eyebrow}>Product Enquiry</p>
          <h1 id="enquiry-title" className={styles.heroTitle}>
            Let us help you choose the right jewel.
          </h1>
          <p className={styles.heroSubtitle}>
            Share your details and the Kerala Jewellers team will contact you
            with availability, pricing, and store guidance.
          </p>
        </section>

        <section className={styles.card} aria-label="Product enquiry form">
          {submitted ? (
            <div className={styles.successBox}>
              <p className={styles.successText}>
                Thank you. Your enquiry details are ready, and our team will
                contact you soon.
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span className={styles.label}>Customer Name</span>
                  <input
                    className={styles.input}
                    type="text"
                    name="customerName"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Mobile Number</span>
                  <input
                    className={styles.input}
                    type="tel"
                    name="mobile"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Email</span>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    autoComplete="email"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>City</span>
                  <input
                    className={styles.input}
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Preferred Contact Time</span>
                  <select className={styles.input} name="preferredTime">
                    <option value="">Choose a time</option>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Product Name</span>
                  <input
                    className={styles.input}
                    type="text"
                    name="productName"
                    readOnly
                    value={productName}
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Product ID</span>
                  <input
                    className={styles.input}
                    type="text"
                    name="productId"
                    readOnly
                    value={productId}
                  />
                </label>

                <label className={`${styles.field} ${styles.fieldWide}`}>
                  <span className={styles.label}>Message / Requirements</span>
                  <textarea
                    className={styles.textarea}
                    name="message"
                    rows={5}
                  />
                </label>
              </div>

              {error && (
                <p style={{ color: "var(--color-bright-red)", marginBottom: "12px" }}>
                  {error}
                </p>
              )}
              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Enquiry"}
                </button>
                <button
                  type="button"
                  className={styles.whatsappBtn}
                  onClick={handleWhatsApp}
                >
                  WhatsApp Enquiry
                </button>
              </div>
            </form>
          )}
        </section>

        <p className={styles.footnote}>
          For urgent support, call{" "}
          <a href="tel:+919840088324" className={styles.footnoteLink}>
            98400 88324
          </a>{" "}
          or visit your nearest Kerala Jewellers showroom.
        </p>
      </div>
    </main>
  );
}

export default function EnquiryPage() {
  return (
    <Suspense fallback={null}>
      <EnquiryForm />
    </Suspense>
  );
}
