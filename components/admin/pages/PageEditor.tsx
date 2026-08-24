"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getPageDef, type PageDef, type FieldDef } from "./pageDefs";
import { updateSiteSettings, updateLegalPage, getSiteSettingsData } from "@/lib/actions/updatePageContent";
import ArrayFieldEditor from "./ArrayFieldEditor";
import ImagePicker from "./ImagePicker";

const ADMIN_PATH = "/kj-portal-0d7cfad1";

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setPath(obj: Record<string, any>, path: string, value: unknown): void {
  const keys = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null || typeof cur[keys[i]] !== "object") cur[keys[i]] = {};
    cur = cur[keys[i]] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

export default function PageEditor({ slug: slugProp }: { slug?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const slug = slugProp || pathname.split("/").filter(Boolean).pop() || "";
  const def: PageDef | undefined = getPageDef(slug);

  const [doc, setDoc] = useState<Record<string, unknown> | null>(null);
  const [legalId, setLegalId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "saved" | "error">("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!def) return;
    let cancelled = false;
    (async () => {
      try {
        if (def.source === "global") {
          const data: Record<string, unknown> = await getSiteSettingsData();
          if (cancelled) return;
          setDoc(data);
          const initial: Record<string, string> = {};
          for (const f of def.fields) {
            const raw = getPath(data, f.path);
            if (f.type === "json") {
              initial[f.path] = JSON.stringify(raw ?? null, null, 2);
            } else if (f.type === "array") {
              initial[f.path] = JSON.stringify(raw ?? [], null, 2);
            } else {
              initial[f.path] = String(raw ?? "");
            }
          }
          setValues(initial);
          setStatus("idle");
        } else {
          const res = await fetch(
            `/api/legal-pages?where[slug][equals]=${def.legalSlug}&limit=1&depth=0`,
          );
          const data = await res.json();
          const entry = data.docs?.[0];
          if (cancelled) return;
          if (!entry) {
            setLoadError(`No legal page found for slug "${def.legalSlug}".`);
            setStatus("error");
            return;
          }
          setLegalId(entry.id);
          setDoc(entry);
          const initial: Record<string, string> = {};
          for (const f of def.fields) {
            const raw = getPath(entry, f.path);
            if (f.type === "json") {
              initial[f.path] = JSON.stringify(raw ?? null, null, 2);
            } else if (f.type === "array") {
              initial[f.path] = JSON.stringify(raw ?? [], null, 2);
            } else if (f.type === "checkbox") {
              initial[f.path] = raw ? "true" : "false";
            } else {
              initial[f.path] = String(raw ?? "");
            }
          }
          setValues(initial);
          setStatus("idle");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setError("Failed to load page content.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [def]);

  const handleChange = (path: string, value: string) => {
    setValues((prev) => ({ ...prev, [path]: value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!def || !doc) return;
      setStatus("saving");
      setError("");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const patch: Record<string, any> = JSON.parse(JSON.stringify(doc));
      for (const f of def.fields) {
        const raw = values[f.path] ?? "";
        if (f.type === "array") {
          try {
            const parsed: unknown = JSON.parse(raw || "[]");
            if (f.path === "features" && Array.isArray(parsed)) {
              parsed.forEach((item: Record<string, unknown>) => {
                if (!item.blockType) item.blockType = "circleBanner";
              });
            }
            if (f.path === "banners" && Array.isArray(parsed)) {
              parsed.forEach((item: Record<string, unknown>) => {
                if (!item.blockType) item.blockType = "imageBanner";
              });
            }
            setPath(patch, f.path, parsed);
          } catch {
            setStatus("error");
            setError(`Invalid data in "${f.label}". Please fix and try again.`);
            return;
          }
        } else if (f.type === "json") {
          try {
            setPath(patch, f.path, JSON.parse(raw || "null"));
          } catch {
            setStatus("error");
            setError(`Invalid JSON in "${f.label}". Please fix and try again.`);
            return;
          }
        } else if (f.type === "checkbox") {
          setPath(patch, f.path, raw === "true");
        } else {
          setPath(patch, f.path, raw);
        }
      }

      try {
        if (def.source === "global") {
          await updateSiteSettings(patch);
        } else if (legalId) {
          await updateLegalPage(legalId, patch);
        }
        setDoc(patch);
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setStatus("error");
        setError("Failed to save. Try again.");
      }
    },
    [def, doc, values, legalId],
  );

  if (!def) {
    return <div style={{ padding: 40, color: "#64748b" }}>Unknown page.</div>;
  }

  if (status === "loading" && !doc) {
    return <div style={{ padding: 40, color: "#64748b" }}>Loading {def.title}…</div>;
  }

  if (status === "error" && loadError) {
    return <div style={{ padding: 40, color: "#dc2626" }}>{loadError}</div>;
  }

  const sections = groupBySection(def.fields);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px" }}>
      <a
        href={`${ADMIN_PATH}/pages`}
        onClick={(e) => {
          e.preventDefault();
          router.push(`${ADMIN_PATH}/pages`);
        }}
        style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: "#64748b", textDecoration: "none", marginBottom: 20 }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        All Pages
      </a>

      <h1 style={{ fontSize: 22, fontWeight: 600, color: "#161616", margin: "0 0 4px" }}>
        {def.title}
      </h1>
      <p style={{ fontSize: 13, color: "#888", margin: "0 0 28px" }}>
        {def.description}
      </p>

      {def.note && (
        <div style={{ marginBottom: 24, padding: "10px 14px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 6, fontSize: 12.5, color: "#854d0e" }}>
          {def.note}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {sections.map((section, sIdx) => (
          <div key={section.name ?? sIdx}>
            {sIdx > 0 && <div style={{ borderTop: "1px solid #f0f0f0", margin: "24px 0" }} />}
            {section.name && (
              <div style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>
                {section.name}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {section.fields.map((f) => (
                <div key={f.path}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#333", marginBottom: 5 }}>
                    {f.label}
                  </label>
                  {f.type === "array" && f.arrayFields ? (
                    <ArrayFieldEditor
                      path={f.path}
                      label={f.label}
                      arrayFields={f.arrayFields}
                      value={values[f.path] ?? "[]"}
                      onChange={handleChange}
                    />
                  ) : f.type === "image" ? (
                    <ImagePicker
                      value={values[f.path] ?? ""}
                      onChange={(val) => handleChange(f.path, val)}
                    />
                  ) : f.type === "checkbox" ? (
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#333" }}>
                      <input
                        type="checkbox"
                        checked={values[f.path] === "true"}
                        onChange={(e) => handleChange(f.path, e.target.checked ? "true" : "false")}
                      />
                      {values[f.path] === "true" ? "Enabled" : "Disabled"}
                    </label>
                  ) : f.type === "textarea" ? (
                    <textarea
                      id={f.path}
                      value={values[f.path] ?? ""}
                      onChange={(e) => handleChange(f.path, e.target.value)}
                      placeholder={f.placeholder}
                      rows={3}
                      style={inputStyle}
                    />
                  ) : f.type === "json" ? (
                    <textarea
                      id={f.path}
                      value={values[f.path] ?? ""}
                      onChange={(e) => handleChange(f.path, e.target.value)}
                      rows={10}
                      spellCheck={false}
                      style={{ ...inputStyle, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12.5 }}
                    />
                  ) : (
                    <input
                      id={f.path}
                      type="text"
                      value={values[f.path] ?? ""}
                      onChange={(e) => handleChange(f.path, e.target.value)}
                      placeholder={f.placeholder}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
          {status === "error" && error && (
            <span style={{ fontSize: 13, color: "#dc2626" }}>{error}</span>
          )}
          <button
            type="submit"
            disabled={status === "saving"}
            style={{
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 500,
              color: status === "saved" ? "#fff" : "#333",
              background: status === "saved" ? "#16a34a" : "#fff",
              border: "1px solid #d0d0d0",
              borderRadius: 5,
              cursor: status === "saving" ? "not-allowed" : "pointer",
              opacity: status === "saving" ? 0.6 : 1,
            }}
          >
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function groupBySection(fields: FieldDef[]): { name: string | null; fields: FieldDef[] }[] {
  const groups: { name: string | null; fields: FieldDef[] }[] = [];
  let current: { name: string | null; fields: FieldDef[] } | null = null;
  for (const f of fields) {
    const sectionName = f.section ?? null;
    if (!current || current.name !== sectionName) {
      current = { name: sectionName, fields: [] };
      groups.push(current);
    }
    current.fields.push(f);
  }
  return groups;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 14,
  border: "1px solid #d0d0d0",
  borderRadius: 5,
  background: "#fff",
  color: "#161616",
  boxSizing: "border-box",
  outline: "none",
};
