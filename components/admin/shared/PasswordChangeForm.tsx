"use client";

import React, { useState } from "react";
import { useDocumentInfo } from "@payloadcms/ui";
import { toast } from "@payloadcms/ui";

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

export const PasswordChangeForm: React.FC = () => {
  const { id: documentId } = useDocumentInfo();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("New password and confirm password are required.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: documentId,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update password");
      } else {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (
    label: string, 
    value: string, 
    setValue: (val: string) => void, 
    show: boolean, 
    setShow: (val: boolean) => void,
    description?: string
  ) => (
    <div style={{ marginBottom: "20px", flex: 1 }}>
      <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "var(--theme-elevation-800)", fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            paddingRight: "40px",
            border: "1px solid var(--theme-elevation-200)",
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
          onClick={() => setShow(!show)}
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
          <EyeIcon visible={show} />
        </button>
      </div>
      {description && (
        <div style={{ color: "var(--theme-elevation-400)", fontSize: "13px", marginTop: "8px" }}>
          {description}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ 
      marginTop: "40px", 
      paddingTop: "20px", 
      borderTop: "1px solid var(--theme-elevation-150)" 
    }}>
      <h3 style={{ marginBottom: "20px", fontSize: "1.2rem", fontWeight: 600 }}>Change Password</h3>
      
      {renderInput("Current Password", currentPassword, setCurrentPassword, showCurrent, setShowCurrent, "Required if you are changing your own password.")}
      
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {renderInput("New Password", newPassword, setNewPassword, showNew, setShowNew, "Must be at least 8 characters.")}
        {renderInput("Confirm Password", confirmPassword, setConfirmPassword, showConfirm, setShowConfirm, "Must match the new password.")}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          padding: "10px 20px",
          background: "var(--theme-elevation-800)",
          color: "var(--theme-elevation-0)",
          border: "none",
          borderRadius: "4px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          fontWeight: 600,
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? "Updating..." : "Change Password"}
      </button>
    </div>
  );
};
