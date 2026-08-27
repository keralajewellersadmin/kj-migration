"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface Props {
  imageSrc: string;
  onCrop: (pixels: { x: number; y: number; width: number; height: number }) => void;
  containerWidth?: number;
  containerHeight?: number;
}

const HANDLE_SIZE = 10;

export default function FreeCropOverlay({
  imageSrc,
  onCrop,
  containerWidth: propContainerWidth,
  containerHeight: propContainerHeight,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [containerSize, setContainerSize] = useState({ w: propContainerWidth || 560, h: propContainerHeight || 400 });
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [imgDisplay, setImgDisplay] = useState({ w: 0, h: 0, offsetX: 0, offsetY: 0 });

  const [cropRect, setCropRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [dragging, setDragging] = useState<"move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null>(null);
  const dragStart = useRef({ mx: 0, my: 0, rx: 0, ry: 0, rw: 0, rh: 0 });

  const hasCrop = cropRect.w > 10 && cropRect.h > 10;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updateImgDisplay = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    setImgNatural({ w: nw, h: nh });

    const ratio = Math.min(containerSize.w / nw, containerSize.h / nh);
    const dw = nw * ratio;
    const dh = nh * ratio;
    setImgDisplay({
      w: dw,
      h: dh,
      offsetX: (containerSize.w - dw) / 2,
      offsetY: (containerSize.h - dh) / 2,
    });

    if (!hasCrop) {
      const cw = Math.round(dw * 0.7);
      const ch = Math.round(dh * 0.7);
      setCropRect({
        x: Math.round((containerSize.w - cw) / 2),
        y: Math.round((containerSize.h - ch) / 2),
        w: cw,
        h: ch,
      });
    }
  }, [containerSize.w, containerSize.h, hasCrop]);

  useEffect(() => {
    updateImgDisplay();
  }, [updateImgDisplay]);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, action: "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w") => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(action);
      dragStart.current = { mx: e.clientX, my: e.clientY, rx: cropRect.x, ry: cropRect.y, rw: cropRect.w, rh: cropRect.h };
    },
    [cropRect],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStart.current.mx;
      const dy = e.clientY - dragStart.current.my;
      const { rx, ry, rw, rh } = dragStart.current;
      const minSize = 20;

      let nx = cropRect.x, ny = cropRect.y, nw = cropRect.w, nh = cropRect.h;

      if (dragging === "move") {
        nx = clamp(rx + dx, 0, containerSize.w - rw);
        ny = clamp(ry + dy, 0, containerSize.h - rh);
        nw = rw;
        nh = rh;
      } else if (dragging === "se") {
        nw = clamp(rw + dx, minSize, containerSize.w - rx);
        nh = clamp(rh + dy, minSize, containerSize.h - ry);
      } else if (dragging === "sw") {
        nx = clamp(rx + dx, 0, rx + rw - minSize);
        nw = rw - (nx - rx);
        nh = clamp(rh + dy, minSize, containerSize.h - ry);
      } else if (dragging === "ne") {
        ny = clamp(ry + dy, 0, ry + rh - minSize);
        nw = clamp(rw + dx, minSize, containerSize.w - rx);
        nh = rh - (ny - ry);
      } else if (dragging === "nw") {
        nx = clamp(rx + dx, 0, rx + rw - minSize);
        ny = clamp(ry + dy, 0, ry + rh - minSize);
        nw = rw - (nx - rx);
        nh = rh - (ny - ry);
      } else if (dragging === "n") {
        ny = clamp(ry + dy, 0, ry + rh - minSize);
        nh = rh - (ny - ry);
      } else if (dragging === "s") {
        nh = clamp(rh + dy, minSize, containerSize.h - ry);
      } else if (dragging === "e") {
        nw = clamp(rw + dx, minSize, containerSize.w - rx);
      } else if (dragging === "w") {
        nx = clamp(rx + dx, 0, rx + rw - minSize);
        nw = rw - (nx - rx);
      }

      setCropRect({ x: nx, y: ny, w: nw, h: nh });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dragging, containerSize],
  );

  useEffect(() => {
    if (dragging) {
      const onUp = () => setDragging(null);
      window.addEventListener("mouseup", onUp);
      return () => window.removeEventListener("mouseup", onUp);
    }
  }, [dragging]);

  const confirmCrop = useCallback(() => {
    if (!hasCrop || !imgDisplay.w || !imgNatural.w) return;
    const sx = imgNatural.w / imgDisplay.w;
    const sy = imgNatural.h / imgDisplay.h;
    onCrop({
      x: Math.round((cropRect.x - imgDisplay.offsetX) * sx),
      y: Math.round((cropRect.y - imgDisplay.offsetY) * sy),
      width: Math.round(cropRect.w * sx),
      height: Math.round(cropRect.h * sy),
    });
  }, [cropRect, imgDisplay, imgNatural, hasCrop, onCrop]);

  const handleStyle = (cursor: string): React.CSSProperties => ({
    position: "absolute" as const,
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    background: "#fff",
    border: "2px solid #9f1b1f",
    borderRadius: 2,
    zIndex: 20,
    cursor,
    pointerEvents: "auto" as const,
  });

  return (
    <div>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{ position: "relative", width: "100%", height: containerSize.h, background: "#1a1a1a", overflow: "hidden", touchAction: "none", userSelect: "none" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Crop source"
          onLoad={updateImgDisplay}
          draggable={false}
          style={{ position: "absolute", top: imgDisplay.offsetY, left: imgDisplay.offsetX, width: imgDisplay.w, height: imgDisplay.h, objectFit: "contain", pointerEvents: "none" }}
        />

        {hasCrop && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                zIndex: 5,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: cropRect.x,
                top: cropRect.y,
                width: cropRect.w,
                height: cropRect.h,
                border: "2px solid rgba(255,255,255,0.9)",
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                zIndex: 10,
                cursor: "move",
              }}
              onMouseDown={(e) => handleMouseDown(e, "move")}
            >
              <div style={{ position: "absolute", inset: 0, border: "1px dashed rgba(255,255,255,0.4)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "33.3%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: "66.6%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: "33.3%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", left: "66.6%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.25)", pointerEvents: "none" }} />

              <div style={{ ...handleStyle("nw-resize"), top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 }} onMouseDown={(e) => handleMouseDown(e, "nw")} />
              <div style={{ ...handleStyle("ne-resize"), top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 }} onMouseDown={(e) => handleMouseDown(e, "ne")} />
              <div style={{ ...handleStyle("sw-resize"), bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2 }} onMouseDown={(e) => handleMouseDown(e, "sw")} />
              <div style={{ ...handleStyle("se-resize"), bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2 }} onMouseDown={(e) => handleMouseDown(e, "se")} />

              <div style={{ ...handleStyle("n-resize"), top: -HANDLE_SIZE / 2, left: "50%", transform: "translateX(-50%)" }} onMouseDown={(e) => handleMouseDown(e, "n")} />
              <div style={{ ...handleStyle("s-resize"), bottom: -HANDLE_SIZE / 2, left: "50%", transform: "translateX(-50%)" }} onMouseDown={(e) => handleMouseDown(e, "s")} />
              <div style={{ ...handleStyle("e-resize"), top: "50%", right: -HANDLE_SIZE / 2, transform: "translateY(-50%)" }} onMouseDown={(e) => handleMouseDown(e, "e")} />
              <div style={{ ...handleStyle("w-resize"), top: "50%", left: -HANDLE_SIZE / 2, transform: "translateY(-50%)" }} onMouseDown={(e) => handleMouseDown(e, "w")} />

              <div style={{ position: "absolute", bottom: -22, right: 0, fontSize: 10, color: "#aaa", whiteSpace: "nowrap", pointerEvents: "none" }}>
                {Math.round(cropRect.w * (imgNatural.w / imgDisplay.w))} x {Math.round(cropRect.h * (imgNatural.h / imgDisplay.h))}px
              </div>
            </div>
          </>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", padding: "12px 16px" }}>
        <button
          type="button"
          onClick={confirmCrop}
          disabled={!hasCrop}
          style={{
            padding: "8px 20px",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            background: hasCrop ? "#9f1b1f" : "#ccc",
            border: "none",
            borderRadius: 6,
            cursor: hasCrop ? "pointer" : "not-allowed",
          }}
        >
          Crop &amp; Upload
        </button>
      </div>
    </div>
  );
}
