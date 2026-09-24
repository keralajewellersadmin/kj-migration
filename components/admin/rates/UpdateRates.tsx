"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { updateRates, getRates } from "@/lib/actions/updateRates";

import { ADMIN_PATH } from "@/lib/admin-path";

const fields = [
  { key: "gold22", label: "Gold 22K", placeholder: "e.g. 7,450" },
  { key: "gold18", label: "Gold 18K", placeholder: "e.g. 6,080" },
  { key: "silver", label: "Silver", placeholder: "e.g. 92" },
  { key: "platinum", label: "Platinum", placeholder: "e.g. 3,890" },
] as const;

type RateKey = (typeof fields)[number]["key"];

export default function UpdateRates() {
  const router = useRouter();
  const [rates, setRates] = useState<Record<RateKey, string>>({
    gold22: "",
    gold18: "",
    silver: "",
    platinum: "",
  });
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    getRates()
      .then((data) => {
        setRates({
          gold22: data.gold22 || "",
          gold18: data.gold18 || "",
          silver: data.silver || "",
          platinum: data.platinum || "",
        });
        if (data.lastUpdated) {
          setLastUpdated(data.lastUpdated);
        }
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, [router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("saving");
      try {
        const result = await updateRates(rates);
        if (!result.success) {
          setStatus("error");
          setTimeout(() => setStatus("idle"), 3000);
          return;
        }
        setStatus("saved");
        setLastUpdated(new Date().toISOString().split("T")[0]);
        setTimeout(() => {
          window.location.href = ADMIN_PATH;
        }, 1500);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    },
    [rates],
  );

  return (
    <div style={{ maxWidth: 580, margin: "32px auto", padding: "0 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <a
          href={ADMIN_PATH}
          onClick={(e) => { e.preventDefault(); window.location.href = ADMIN_PATH; }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 12, fontWeight: 500, transition: "color 0.15s" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to Dashboard
        </a>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 6, fontFamily: "Plus Jakarta Sans, sans-serif" }}>
          Metal Rates
        </h1>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
          Prices in INR (₹) per gram. Updates appear on the live storefront and navbar instantly.
        </p>
      </div>

      {/* Card Form */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "28px 32px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
      }}>
        {lastUpdated && (
          <div style={{
            fontSize: 12.5,
            color: "#64748b",
            marginBottom: 20,
            paddingBottom: 12,
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <span>Last Updated: <strong style={{ color: "#0f172a" }}>{lastUpdated}</strong></span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#16a34a", fontSize: 12, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
              Live
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {fields.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#334155",
                    marginBottom: 6,
                  }}
                >
                  {label} (₹/g)
                </label>
                <input
                  id={key}
                  type="text"
                  inputMode="numeric"
                  placeholder={placeholder}
                  value={rates[key]}
                  onChange={(e) => setRates((prev) => ({ ...prev, [key]: e.target.value }))}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    fontSize: 14.5,
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    background: "#ffffff",
                    color: "#0f172a",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.15s ease",
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 14 }}>
            {status === "error" && (
              <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 500 }}>
                Failed to update rates. Try again.
              </span>
            )}
            <button
              type="submit"
              disabled={status === "saving" || status === "loading"}
              style={{
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                color: "#ffffff",
                background: status === "saved" ? "#16a34a" : "#9f1b1f",
                border: "none",
                borderRadius: 6,
                cursor: status === "saving" || status === "loading" ? "not-allowed" : "pointer",
                opacity: status === "saving" || status === "loading" ? 0.7 : 1,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "background 0.2s ease",
              }}
            >
              {status === "saving" ? "Saving..." : status === "saved" ? "Rates Updated!" : "Save Rates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
