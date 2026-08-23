"use client";

import React, { useState } from "react";
import { useField } from "@payloadcms/ui";

const EyeIcon = ({ visible }: { visible: boolean }) => {
  if (visible) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
  );
};

export const PasswordField: React.FC<{ path: string; field: any }> = ({ path, field }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="field-type password" style={{ marginBottom: "20px" }}>
      <label className="field-label" style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "var(--theme-elevation-800)", fontWeight: 500 }}>
        {field.label !== false && (field.label || field.name)}
        {field.required && <span className="required" style={{ color: "var(--theme-error-500)" }}> *</span>}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={showPassword ? "text" : "password"}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          className={`field-input ${showError ? "error" : ""}`}
          style={{
            width: "100%",
            padding: "10px",
            paddingRight: "40px",
            border: showError ? "1px solid var(--theme-error-500)" : "1px solid var(--theme-elevation-200)",
            borderRadius: "4px",
            background: "var(--theme-elevation-0)",
            color: "var(--theme-elevation-800)",
            fontFamily: "inherit",
            fontSize: "1rem",
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "var(--theme-elevation-500)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "4px",
          }}
        >
          <EyeIcon visible={showPassword} />
        </button>
      </div>
      {showError && errorMessage && (
        <div className="field-error" style={{ color: "var(--theme-error-500)", fontSize: "13px", marginTop: "8px" }}>
          {errorMessage}
        </div>
      )}
      {field.admin?.description && !showError && (
        <div className="field-description" style={{ color: "var(--theme-elevation-400)", fontSize: "13px", marginTop: "8px" }}>
          {typeof field.admin.description === 'string' ? field.admin.description : ''}
        </div>
      )}
    </div>
  );
};
