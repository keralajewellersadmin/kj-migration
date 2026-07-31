"use client";

import React, { useEffect, useState, useCallback } from "react";

export default function TwoFactorGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [needsOtp, setNeedsOtp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const sendOtp = useCallback(async () => {
    try {
      const res = await fetch("/api/otp/generate", { method: "POST" });
      if (res.ok) {
        setOtpSent(true);
        setResendCooldown(60);
      }
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/2fa/status");
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (!data.authenticated) {
          setLoading(false);
          return;
        }

        // Always require email OTP after login
        setNeedsOtp(true);
        // Auto-send OTP
        await sendOtp();
      } catch {
        // Skip 2FA check on error
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [sendOtp]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a 6-digit code");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: otp }),
      });
      if (res.ok) {
        setVerified(true);
        setNeedsOtp(false);
      } else {
        const data = await res.json();
        setOtpError(data.error || "Invalid code");
      }
    } catch {
      setOtpError("Network error");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtpError(null);
    setOtp("");
    await sendOtp();
  };

  if (loading) return null;

  if (!needsOtp || verified) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "2.5rem",
            borderRadius: "12px",
            maxWidth: "420px",
            width: "90%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "#f0e6d2",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto 1rem",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9f1b1f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: "0.5rem",
              }}
            >
              Verify Your Identity
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.5 }}>
              {otpSent
                ? "We've sent a 6-digit verification code to your email address."
                : "Sending verification code to your email..."}
            </p>
          </div>

          {otpError && (
            <div
              style={{
                background: "#fef2f2",
                color: "#991b1b",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "0.85rem",
                border: "1px solid #fecaca",
              }}
            >
              {otpError}
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setOtpError(null);
              }}
              placeholder="000000"
              maxLength={6}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              style={{
                width: "100%",
                padding: "1rem",
                fontSize: "1.5rem",
                textAlign: "center",
                letterSpacing: "0.75rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                background: "#fafafa",
                color: "#1a1a1a",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#9f1b1f")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={otpLoading || otp.length !== 6}
            style={{
              width: "100%",
              padding: "0.875rem",
              background:
                otpLoading || otp.length !== 6 ? "#d1d5db" : "#9f1b1f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor:
                otpLoading || otp.length !== 6 ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {otpLoading ? "Verifying..." : "Verify & Continue"}
          </button>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              style={{
                background: "none",
                border: "none",
                color: resendCooldown > 0 ? "#9ca3af" : "#9f1b1f",
                fontSize: "0.85rem",
                cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                textDecoration: resendCooldown > 0 ? "none" : "underline",
              }}
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Resend code"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
