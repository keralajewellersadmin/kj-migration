"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CustomLogin.module.css";

type LoginStep = "login" | "otp" | "forgot" | "reset-sent";

export default function CustomLogin() {
  const [step, setStep] = useState<LoginStep>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [userId, setUserId] = useState<string | number>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      if (data.requiresOtp) {
        setMaskedEmail(data.maskedEmail);
        setUserId(data.userId);
        setStep("otp");
        setResendCooldown(60);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code");
        return;
      }

      if (data.token) {
        document.cookie = `payload-token=${data.token}; path=/; max-age=${60 * 60 * 8}`;
        window.location.href = "/admin";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend code");
        return;
      }

      setResendCooldown(60);
    } catch {
      setError("Failed to resend code");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      await res.json();
      setStep("reset-sent");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.brandPanel} aria-label="Kerala Jewellers">
        <div className={styles.brandContent}>
          <Image
            src="/assets/logo/kj-favicon-transparent.png"
            alt="Kerala Jewellers"
            width={100}
            height={100}
            className={styles.logo}
            priority
          />
          <h1 className={styles.wordmark}>Kerala Jewellers</h1>
          <div className={styles.divider} />
          <p className={styles.tagline}>Trusted Since 1959</p>
        </div>
      </section>

      <section className={styles.loginPanel} aria-label="Admin sign in">
        <div className={styles.card}>
          {step === "login" && (
            <>
              <div className={styles.cardHeader}>
                <h2>Welcome Back</h2>
                <p>Sign in to your admin panel</p>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="identifier">Email or Username</label>
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@keralajewellers.in or admin"
                    autoComplete="username"
                    required
                    autoFocus
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading}
                >
                  {loading ? <span className={styles.spinner} /> : "Continue"}
                </button>

                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => {
                    setStep("forgot");
                    setError("");
                  }}
                >
                  Forgot password?
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className={styles.cardHeader}>
                <h2>Verify Identity</h2>
                <p>Enter the 6-digit code sent to {maskedEmail}</p>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <form onSubmit={handleVerifyOtp} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="otp">Verification code</label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    autoComplete="one-time-code"
                    required
                    autoFocus
                    maxLength={6}
                    className={styles.codeInput}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>

                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
                </button>

                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => {
                    setStep("login");
                    setError("");
                    setOtpCode("");
                  }}
                >
                  Back to sign in
                </button>
              </form>
            </>
          )}

          {step === "forgot" && (
            <>
              <div className={styles.cardHeader}>
                <h2>Reset Password</h2>
                <p>Enter your email or username to receive a reset link</p>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <form onSubmit={handleForgotPassword} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="forgot-id">Email or Username</label>
                  <input
                    id="forgot-id"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="admin@keralajewellers.in or admin"
                    autoComplete="username"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>

                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => {
                    setStep("login");
                    setError("");
                  }}
                >
                  Back to sign in
                </button>
              </form>
            </>
          )}

          {step === "reset-sent" && (
            <>
              <div className={styles.cardHeader}>
                <h2>Check Your Email</h2>
                <p>
                  If an account exists, a password reset link has been sent.
                </p>
              </div>

              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => {
                  setStep("login");
                  setError("");
                }}
              >
                Back to sign in
              </button>
            </>
          )}
        </div>

        <p className={styles.footer}>
          &copy; {new Date().getFullYear()} Kerala Jewellers
        </p>
      </section>
    </main>
  );
}
