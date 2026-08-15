"use client";

import { useState, useEffect, useCallback } from "react";
import { updateRates } from "@/lib/actions/updateRates";

const fields = [
  { key: "gold22", label: "Gold 22K", placeholder: "e.g. 7,450" },
  { key: "gold18", label: "Gold 18K", placeholder: "e.g. 6,080" },
  { key: "silver", label: "Silver", placeholder: "e.g. 92" },
  { key: "platinum", label: "Platinum", placeholder: "e.g. 3,890" },
] as const;

type RateKey = (typeof fields)[number]["key"];

export default function UpdateRates() {
  const [rates, setRates] = useState<Record<RateKey, string>>({
    gold22: "",
    gold18: "",
    silver: "",
    platinum: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    fetch("/api/globals/site-settings")
      .then((r) => r.json())
      .then((data) => {
        setRates({
          gold22: data.rateGold22 || "",
          gold18: data.rateGold18 || "",
          silver: data.rateSilver || "",
          platinum: data.ratePlatinum || "",
        });
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("saving");
      try {
        await updateRates(rates);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    },
    [rates],
  );

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4, fontFamily: "var(--font-body), Mulish, system-ui, sans-serif" }}>
        Update Metal Rates
      </h1>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>
        Prices in INR per gram. Updates appear on the website immediately.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {fields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label
                htmlFor={key}
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#444",
                  marginBottom: 4,
                  fontFamily: "var(--font-body), Mulish, system-ui, sans-serif",
                }}
              >
                {label}
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
                  padding: "10px 12px",
                  fontSize: 15,
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  background: "#fff",
                  fontFamily: "var(--font-body), Mulish, system-ui, sans-serif",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="submit"
            disabled={status === "saving" || status === "loading"}
            style={{
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              background: status === "saved" ? "#2d8a4e" : "#3b2826",
              border: "none",
              borderRadius: 6,
              cursor: status === "saving" || status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "saving" || status === "loading" ? 0.6 : 1,
              fontFamily: "var(--font-body), Mulish, system-ui, sans-serif",
              transition: "background 0.2s",
            }}
          >
            {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Save Rates"}
          </button>

          {status === "error" && (
            <span style={{ fontSize: 13, color: "#c00" }}>Something went wrong. Try again.</span>
          )}
        </div>
      </form>
    </div>
  );
}
