"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ADMIN_PATH } from "@/lib/admin-path";
import styles from "./CustomLogin.module.css";

type LoginStep = "login" | "otp" | "forgot" | "reset-sent";

async function readAuthResponse(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return {
    error:
      res.status === 401 || res.status === 403
        ? "This deployment is protected by Vercel. Disable deployment protection before sharing it with the client."
        : "Login service is not reachable. Please try again.",
  };
}

export default function CustomLogin() {
  const [step, setStep] = useState<LoginStep>("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [userId, setUserId] = useState<string | number>("");
  const [error, setError] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

      const data = await readAuthResponse(res);

      if (!res.ok) {
        setError(
          data.error?.message ||
            data.error ||
            data.protection?.error?.message ||
            "Invalid credentials",
        );
        return;
      }

      if (data.requiresOtp) {
        setMaskedEmail(data.maskedEmail);
        setUserId(data.userId);
        setStep("otp");
        setResendCooldown(60);
        return;
      }

      if (data.success) {
        window.location.href = data.redirectTo || ADMIN_PATH;
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
        body: JSON.stringify({ userId, identifier, code: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code");
        return;
      }

      if (data.success) {
        window.location.href = data.redirectTo || ADMIN_PATH;
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

      const data = await res.json();
      setDevResetUrl(data.resetUrl || "");
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
            unoptimized
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
                    placeholder="admin@keralajewellers.in"
                    autoComplete="username"
                    required
                    autoFocus
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="password">Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className={styles.togglePassword}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      )}
                    </button>
                  </div>
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
                    setDevResetUrl("");
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
                    placeholder="admin@keralajewellers.in"
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
                    setDevResetUrl("");
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
                {devResetUrl && (
                  <p className={styles.devResetLink}>
                    Local reset link: <a href={devResetUrl}>{devResetUrl}</a>
                  </p>
                )}
              </div>

              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => {
                  setStep("login");
                  setError("");
                  setDevResetUrl("");
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
