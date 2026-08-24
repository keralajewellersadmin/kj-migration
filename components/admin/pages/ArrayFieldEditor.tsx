"use client";

import { useState } from "react";
import ImagePicker from "./ImagePicker";

export type ArrayField = { name: string; label: string; type: "text" | "textarea" | "image" | "checkbox"; placeholder?: string };

interface Props {
  path: string;
  label: string;
  arrayFields: ArrayField[];
  value: string;
  onChange: (path: string, value: string) => void;
}

export default function ArrayFieldEditor({ path, label, arrayFields, value, onChange }: Props) {
  const [items, setItems] = useState<Record<string, string | boolean>[]>(() => {
    try {
      const parsed: unknown = JSON.parse(value || "[]");
      return Array.isArray(parsed) ? (parsed as Record<string, string | boolean>[]) : [];
    } catch {
      return [];
    }
  });

  const emit = (newItems: Record<string, string | boolean>[]) => {
    setItems(newItems);
    onChange(path, JSON.stringify(newItems, null, 2));
  };

  const addItem = () => {
    const blank: Record<string, string | boolean> = {};
    arrayFields.forEach((f) => (blank[f.name] = ""));
    emit([...items, blank]);
  };

  const removeItem = (idx: number) => {
    emit(items.filter((_r, i) => i !== idx));
  };

  const updateField = (idx: number, field: string, val: string | boolean) => {
    const copy = items.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item,
    );
    emit(copy);
  };

  const singular = label.replace(/\(.*\)/, "").trim();
  const addItemLabel = singular.endsWith("ies")
    ? singular.slice(0, -3) + "y"
    : singular.endsWith("s") && !singular.endsWith("ss")
      ? singular.slice(0, -1)
      : singular;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.length === 0 && (
        <div style={{ fontSize: 13, color: "#aaa", padding: "12px 0" }}>
          No items yet.
        </div>
      )}
      {items.map((item, idx) => (
        <div key={idx} style={itemStyle}>
          <div style={itemHeaderStyle}>
            <span style={{ fontSize: 12, color: "#999" }}>{idx + 1}.</span>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              style={removeStyle}
            >
              Remove
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
            {arrayFields.map((f) => (
              <div key={f.name}>
                <label style={fieldLabelStyle}>{f.label}</label>
                {f.type === "image" ? (
                  <ImagePicker
                    value={String(item[f.name] ?? "")}
                    onChange={(val) => updateField(idx, f.name, val)}
                  />
                ) : f.type === "textarea" ? (
                  <textarea
                    value={String(item[f.name] ?? "")}
                    onChange={(e) => updateField(idx, f.name, e.target.value)}
                    placeholder={f.placeholder}
                    rows={2}
                    style={fieldInputStyle}
                  />
                ) : f.type === "checkbox" ? (
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12.5, color: "#333" }}>
                    <input
                      type="checkbox"
                      checked={item[f.name] === true || String(item[f.name]) === "true"}
                      onChange={(e) => updateField(idx, f.name, e.target.checked)}
                    />
                    {item[f.name] === true || String(item[f.name]) === "true" ? "Yes" : "No"}
                  </label>
                ) : (
                  <input
                    type="text"
                    value={String(item[f.name] ?? "")}
                    onChange={(e) => updateField(idx, f.name, e.target.value)}
                    placeholder={f.placeholder}
                    style={fieldInputStyle}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        style={addStyle}
      >
        + Add {addItemLabel}
      </button>
    </div>
  );
}

const itemStyle: React.CSSProperties = {
  border: "1px solid #e8e8e8",
  borderRadius: 5,
  padding: "12px 14px",
  background: "#fafafa",
};

const itemHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
};

const removeStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#999",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 500,
  color: "#666",
  marginBottom: 4,
};

const fieldInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  fontSize: 14,
  border: "1px solid #d0d0d0",
  borderRadius: 5,
  background: "#fff",
  color: "#161616",
  boxSizing: "border-box",
  outline: "none",
};

const addStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#888",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px 0",
  textAlign: "left" as const,
};
