"use client";

import { useState } from "react";
import ImagePicker from "./ImagePicker";

export type ArrayField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "image" | "checkbox";
  placeholder?: string;
  description?: string;
  aspectRatio?: number;
  recommendedWidth?: number;
  recommendedHeight?: number;
};

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
    arrayFields.forEach((f) => {
      if (f.type === "checkbox") blank[f.name] = false;
      else if (f.name === "heading" || f.name === "title") blank[f.name] = "New " + (f.label || f.name);
      else blank[f.name] = "";
    });
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
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {items.length === 0 && (
        <div className="kj-pe-empty">
          No items yet.
        </div>
      )}
      {items.map((item, idx) => (
        <div key={idx} className="kj-pe-repeater-card">
          <div className="kj-pe-repeater-header">
            <span className="kj-pe-repeater-badge">{singular} {idx + 1}</span>
            <button
              type="button"
              onClick={() => removeItem(idx)}
              className="kj-pe-remove-btn"
            >
              Remove
            </button>
          </div>
          <div className="kj-pe-fields">
            {arrayFields.map((f) => (
              <div key={f.name}>
                <label className="kj-pe-field-label">{f.label}</label>
                {f.description && <div className="kj-pe-hint">{f.description}</div>}
                {f.type === "image" ? (
                  <ImagePicker
                    value={String(item[f.name] ?? "")}
                    onChange={(val) => updateField(idx, f.name, val)}
                    aspectRatio={f.aspectRatio}
                    recommendedWidth={f.recommendedWidth}
                    recommendedHeight={f.recommendedHeight}
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
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12.5, color: "#334155", fontWeight: 500 }}>
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
        className="kj-pe-add-btn"
      >
        + Add {addItemLabel}
      </button>
    </div>
  );
}

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
