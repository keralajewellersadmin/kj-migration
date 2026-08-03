"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ADMIN_PATH } from "@/lib/admin-path";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#faf9f6",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2 style={{ color: "#991f23" }}>Invalid Reset Link</h2>
          <p style={{ color: "#666", marginTop: "1rem" }}>
            This password reset link is invalid or missing.
          </p>
          <Link
            href={`${ADMIN_PATH}/login`}
            style={{
              color: "#991f23",
              marginTop: "1rem",
              display: "inline-block",
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#faf9f6",
        }}
      >
        <div
          style={{ textAlign: "center", padding: "2rem", maxWidth: "400px" }}
        >
          <Image
            src="/assets/logo/kj-favicon-transparent.png"
            alt="Kerala Jewellers"
            width={80}
            height={80}
            style={{ margin: "0 auto 1.5rem" }}
          />
          <h2 style={{ color: "#16a34a", marginBottom: "1rem" }}>
            Password Reset Successful
          </h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            Your password has been updated. You can now log in with your new
            password.
          </p>
          <Link
            href={`${ADMIN_PATH}/login`}
            style={{
              display: "inline-block",
              background: "#9f1b1f",
              color: "#fff",
              padding: "0.75rem 2rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#faf9f6",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2.5rem",
          borderRadius: "12px",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Image
            src="/assets/logo/kj-favicon-transparent.png"
            alt="Kerala Jewellers"
            width={60}
            height={60}
            style={{ margin: "0 auto 1rem" }}
          />
          <h2
            style={{ fontSize: "1.35rem", fontWeight: 700, color: "#1a1a1a" }}
          >
            Set New Password
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
            Enter your new password below
          </p>
        </div>

        {error && (
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
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 12 characters"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.85rem",
                fontWeight: 500,
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: loading ? "#d1d5db" : "#9f1b1f",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link
            href={`${ADMIN_PATH}/login`}
            style={{ color: "#9f1b1f", fontSize: "0.9rem" }}
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
