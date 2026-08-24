"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const ADMIN_PATH = "/kj-portal-0d7cfad1";

interface MediaDoc {
  id: string;
  url: string;
  alt?: string;
  filename?: string;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function ImagePicker({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaDoc[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [tab, setTab] = useState<"browse" | "upload">("browse");
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchPreview = useCallback(async (mediaId: string) => {
    if (!mediaId) { setPreviewUrl(""); return; }
    try {
      const res = await fetch(`${ADMIN_PATH}/api/media/${mediaId}?depth=0`);
      const doc = await res.json();
      if (doc.url) setPreviewUrl(doc.url);
    } catch {
      setPreviewUrl("");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPreview(value);
  }, [value, fetchPreview]);

  const fetchMedia = async (search?: string) => {
    setLoading(true);
    try {
      const where = search
        ? `&where[or][0][alt][contains]=${encodeURIComponent(search)}&where[or][1][filename][contains]=${encodeURIComponent(search)}`
        : "";
      const res = await fetch(`${ADMIN_PATH}/api/media?limit=24&sort=-createdAt&depth=0${where}`);
      const data = await res.json();
      setResults(data.docs || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleOpen = () => {
    setTab("browse");
    setFile(null);
    setAlt("");
    setUploadError("");
    setOpen(true);
    fetchMedia();
  };

  const uploadImage = async () => {
    if (!file) {
      setUploadError("Choose an image file first.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (alt) fd.append("alt", alt);
      const res = await fetch(`${ADMIN_PATH}/api/media`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg =
          (errData?.errors && errData.errors[0]?.message) ||
          `Upload failed (${res.status})`;
        throw new Error(msg);
      }
      const data = await res.json();
      const doc = data.doc || data;
      if (doc && doc.id) {
        onChange(String(doc.id));
        setOpen(false);
      } else {
        throw new Error("Upload succeeded but no media was returned.");
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    }
    setUploading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedia(query || undefined);
  };

  const selectImage = (doc: MediaDoc) => {
    onChange(String(doc.id));
    setOpen(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        {value && previewUrl ? (
          <div style={previewStyle}>
            <Image
              src={previewUrl}
              alt="Preview"
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: 4 }}
              unoptimized
            />
          </div>
        ) : (
          <div style={placeholderStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" onClick={handleOpen} style={browseBtnStyle}>
              Browse Media
            </button>
            {value && (
              <button type="button" onClick={() => { onChange(""); setPreviewUrl(""); }} style={clearBtnStyle}>
                Clear
              </button>
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Media ID (e.g. 123)"
            style={inputStyle}
          />
        </div>
      </div>

      {open && (
        <div style={modalOverlayStyle} onClick={() => setOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Select Image</span>
              <button type="button" onClick={() => setOpen(false)} style={closeBtnStyle}>X</button>
            </div>
            <div style={tabBarStyle}>
              <button
                type="button"
                onClick={() => setTab("browse")}
                style={tab === "browse" ? tabActiveStyle : tabBtnStyle}
              >
                Browse Media
              </button>
              <button
                type="button"
                onClick={() => setTab("upload")}
                style={tab === "upload" ? tabActiveStyle : tabBtnStyle}
              >
                Upload New
              </button>
            </div>
            {tab === "browse" ? (
              <>
                <form onSubmit={handleSearch} style={{ display: "flex", gap: 6, padding: "12px 16px" }}>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or filename..."
                    style={{ ...inputStyle, flex: 1, fontSize: 14, fontFamily: "inherit" }}
                  />
                  <button type="submit" style={browseBtnStyle}>Search</button>
                </form>
                <div style={gridStyle}>
                  {loading && <div style={{ padding: 20, color: "#999", fontSize: 13 }}>Loading...</div>}
                  {!loading && results.length === 0 && (
                    <div style={{ padding: 20, color: "#999", fontSize: 13 }}>No media found. Switch to the &ldquo;Upload New&rdquo; tab to add an image.</div>
                  )}
                  {results.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => selectImage(doc)}
                      style={thumbBtnStyle}
                      title={doc.alt || doc.filename || `Media #${doc.id}`}
                    >
                      <Image
                        src={doc.url}
                        alt={doc.alt || ""}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: 4, width: "100%", height: "100%" }}
                        unoptimized
                      />
                      <span style={thumbIdStyle}>#{doc.id}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={uploadFormStyle}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ fontSize: 13 }}
                />
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Alt text (optional)"
                  style={inputStyle}
                />
                {uploadError && <div style={uploadErrStyle}>{uploadError}</div>}
                <button
                  type="button"
                  onClick={uploadImage}
                  disabled={uploading}
                  style={uploadBtnStyle}
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const previewStyle: React.CSSProperties = {
  width: 80,
  height: 80,
  borderRadius: 4,
  overflow: "hidden",
  border: "1px solid #e0e0e0",
  flexShrink: 0,
};

const placeholderStyle: React.CSSProperties = {
  width: 80,
  height: 80,
  borderRadius: 4,
  border: "1px dashed #d0d0d0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  background: "#fafafa",
};

const inputStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 12,
  border: "1px solid #d0d0d0",
  borderRadius: 5,
  background: "#fff",
  color: "#161616",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const browseBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: 12,
  fontWeight: 500,
  color: "#333",
  background: "#f5f5f5",
  border: "1px solid #d0d0d0",
  borderRadius: 5,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const clearBtnStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 12,
  color: "#999",
  background: "none",
  border: "1px solid #e0e0e0",
  borderRadius: 5,
  cursor: "pointer",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 10000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 8,
  width: "90vw",
  maxWidth: 720,
  maxHeight: "80vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 16px",
  borderBottom: "1px solid #eee",
};

const closeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: 18,
  color: "#666",
  cursor: "pointer",
  padding: "0 4px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
  gap: 8,
  padding: 16,
  overflowY: "auto",
  flex: 1,
};

const tabBarStyle: React.CSSProperties = {
  display: "flex",
  gap: 4,
  padding: "10px 16px 0",
  borderBottom: "1px solid #eee",
};

const tabBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  fontSize: 13,
  fontWeight: 500,
  color: "#666",
  background: "none",
  border: "none",
  borderBottom: "2px solid transparent",
  cursor: "pointer",
};

const tabActiveStyle: React.CSSProperties = {
  ...tabBtnStyle,
  color: "#9f1b1f",
  borderBottom: "2px solid #9f1b1f",
};

const uploadFormStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  padding: 20,
};

const uploadErrStyle: React.CSSProperties = {
  color: "#b00000",
  fontSize: 12.5,
};

const uploadBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  fontSize: 13,
  fontWeight: 600,
  color: "#fff",
  background: "#9f1b1f",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const thumbBtnStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: "1",
  border: "2px solid transparent",
  borderRadius: 4,
  overflow: "hidden",
  cursor: "pointer",
  background: "#f5f5f5",
  padding: 0,
};

const thumbIdStyle: React.CSSProperties = {
  position: "absolute",
  bottom: 2,
  right: 2,
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  fontSize: 9,
  padding: "1px 4px",
  borderRadius: 3,
};
