/**
 * FrameCanvas.jsx
 *
 * Drone frame viewer with interactive marker placement.
 * - Clicking shows a Google-Maps-style GPS popup with reverse-geocoded place name
 * - Each confirmed marker shows lat/lon label on the canvas
 * - Polygon draws at ≥3 markers
 * - Unlimited markers (A, B, C … Z, 27, 28 …)
 */

import React, { useRef, useEffect, useCallback, useState } from "react";
import { getFrameUrl } from "../../services/droneApi";

const ORIGINAL_WIDTH = 1920;
const MARKER_COLORS = [
  "#ff4d4d",
  "#4daaff",
  "#ffe04d",
  "#4dff91",
  "#ff9f43",
  "#a29bfe",
  "#fd79a8",
  "#55efc4",
];

function markerLabel(i) {
  return i < 26 ? String.fromCharCode(65 + i) : String(i + 1);
}
function markerColor(i) {
  return MARKER_COLORS[i % MARKER_COLORS.length];
}

/** Convert pixel coordinates to GPS using GSD + frame center lat/lon */
function pixelToGPS(origX, origY, imageWidth, imageHeight, telemetry, gsdCmPx) {
  const gsdM = gsdCmPx / 100;
  const dx = origX - imageWidth / 2;
  const dy = origY - imageHeight / 2;
  const eastM = dx * gsdM;
  const northM = -dy * gsdM;
  const latPerMeter = 1 / 111320;
  const lonPerMeter = 1 / (111320 * Math.cos((telemetry.lat * Math.PI) / 180));
  return {
    lat: +(telemetry.lat + northM * latPerMeter).toFixed(8),
    lon: +(telemetry.lon + eastM * lonPerMeter).toFixed(8),
  };
}

/** Reverse geocode via OpenStreetMap Nominatim (free, no API key) */
async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=14`,
      { headers: { "Accept-Language": "en" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};
    const name =
      addr.village ||
      addr.town ||
      addr.suburb ||
      addr.city ||
      addr.hamlet ||
      addr.municipality ||
      addr.county ||
      "Unknown";
    const region = addr.state || addr.country || "";
    return { name, region };
  } catch {
    return null;
  }
}

export default function FrameCanvas({
  frame,
  markers,
  onMarkersChange,
  telemetry,
  gsdCmPx,
}) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [pendingMarker, setPendingMarker] = useState(null);
  const [placeInfo, setPlaceInfo] = useState(null); // { name, region } | null

  /* ── Reverse geocode whenever pendingMarker changes ─── */
  useEffect(() => {
    if (!pendingMarker) {
      setPlaceInfo(null);
      return;
    }
    setPlaceInfo({ name: "Loading…", region: "", loading: true });
    reverseGeocode(pendingMarker.lat, pendingMarker.lon).then((info) => {
      setPlaceInfo(
        info
          ? { ...info, loading: false }
          : { name: "Unknown location", region: "", loading: false },
      );
    });
  }, [pendingMarker?.lat, pendingMarker?.lon]);

  /* ── Draw markers + coordinate labels on canvas ─── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const displayW = img.clientWidth;
    const displayH = img.clientHeight;
    if (!displayW || !displayH) return;

    const wrap = canvas.parentElement;
    if (wrap) {
      const wrapRect = wrap.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();
      canvas.style.left = `${imgRect.left - wrapRect.left}px`;
      canvas.style.top = `${imgRect.top - wrapRect.top}px`;
      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;
    }

    canvas.width = displayW;
    canvas.height = displayH;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, displayW, displayH);

    if (!markers || markers.length === 0) return;

    const scaleX = displayW / (img.naturalWidth || ORIGINAL_WIDTH);
    const scaleY = displayH / (img.naturalHeight || ORIGINAL_WIDTH * (9 / 16));

    /* Polygon fill when 3+ markers */
    if (markers.length >= 3) {
      ctx.beginPath();
      markers.forEach((m, i) => {
        const px = m.x * scaleX,
          py = m.y * scaleY;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(102, 187, 106, 0.18)";
      ctx.fill();
      ctx.strokeStyle = "rgba(102, 187, 106, 0.9)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    /* Marker circles + labels + coordinate tags */
    markers.forEach((m, i) => {
      const px = m.x * scaleX;
      const py = m.y * scaleY;
      const color = markerColor(i);
      const label = markerLabel(i);
      const r = 10;

      // Circle
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Letter label inside circle
      ctx.font = "bold 10px Sora, sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, px, py);

      // Coordinate tag below the marker (when GPS available)
      if (m.lat != null && m.lon != null) {
        const coordText = `${m.lat.toFixed(6)}, ${m.lon.toFixed(6)}`;
        ctx.font = "8.5px monospace";
        const tw = ctx.measureText(coordText).width;
        const tagW = tw + 10;
        const tagH = 14;
        const tagX = px - tagW / 2;
        const tagY = py + r + 4;

        // Pill background
        ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
        ctx.beginPath();
        ctx.roundRect(tagX, tagY, tagW, tagH, 3);
        ctx.fill();

        // Coordinate text in teal
        ctx.fillStyle = "#4dffb0";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(coordText, px, tagY + tagH / 2);
      }
    });
  }, [markers]);

  useEffect(() => {
    draw();
  }, [draw, frame]);

  useEffect(() => {
    setPendingMarker(null);
  }, [frame]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  /* ── Canvas click handler ─── */
  const handleCanvasClick = (e) => {
    if (pendingMarker) {
      setPendingMarker(null);
      return;
    }
    if (!markers) return;
    const img = imgRef.current;
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const displayX = e.clientX - imgRect.left;
    const displayY = e.clientY - imgRect.top;

    const origX = Math.round(
      displayX * ((img.naturalWidth || ORIGINAL_WIDTH) / img.clientWidth),
    );
    const origY = Math.round(
      displayY *
        ((img.naturalHeight || ORIGINAL_WIDTH * (9 / 16)) / img.clientHeight),
    );

    const hasGPS =
      telemetry?.lat != null && telemetry?.lon != null && gsdCmPx > 0;

    if (hasGPS) {
      const { lat, lon } = pixelToGPS(
        origX,
        origY,
        img.naturalWidth || ORIGINAL_WIDTH,
        img.naturalHeight || ORIGINAL_WIDTH * (9 / 16),
        telemetry,
        gsdCmPx,
      );

      const wrapRect = wrapRef.current?.getBoundingClientRect() || imgRect;
      // Popup is ~280px wide, ~180px tall
      let popupX = e.clientX - wrapRect.left + 14;
      let popupY = e.clientY - wrapRect.top - 14;
      if (popupX + 280 > wrapRect.width)
        popupX = e.clientX - wrapRect.left - 294;
      if (popupY + 180 > wrapRect.height)
        popupY = e.clientY - wrapRect.top - 190;

      setPendingMarker({
        origX,
        origY,
        lat,
        lon,
        popupX,
        popupY,
        index: markers.length,
        label: markerLabel(markers.length),
      });
    } else {
      onMarkersChange([...markers, { x: origX, y: origY }]);
    }
  };

  const handleAddMarker = () => {
    if (!pendingMarker) return;
    onMarkersChange([
      ...markers,
      {
        x: pendingMarker.origX,
        y: pendingMarker.origY,
        lat: pendingMarker.lat,
        lon: pendingMarker.lon,
      },
    ]);
    setPendingMarker(null);
  };

  const handleCopy = () => {
    if (!pendingMarker) return;
    navigator.clipboard.writeText(`${pendingMarker.lat}, ${pendingMarker.lon}`);
  };

  const handleMaps = () => {
    if (!pendingMarker) return;
    window.open(
      `https://www.google.com/maps?q=${pendingMarker.lat},${pendingMarker.lon}`,
      "_blank",
    );
  };

  if (!frame) {
    return (
      <div className="analysis-panel__placeholder">
        <span className="analysis-panel__placeholder-icon">🛸</span>
        Select a captured frame to begin analysis
      </div>
    );
  }

  return (
    <div className="frame-canvas-wrap" ref={wrapRef}>
      <img
        ref={imgRef}
        className="frame-canvas-wrap__img"
        src={getFrameUrl(frame.frame_id)}
        alt={`Frame ${frame.frame_num}`}
        onLoad={draw}
        draggable={false}
      />
      <canvas
        ref={canvasRef}
        className="frame-canvas-wrap__canvas"
        onClick={handleCanvasClick}
        title={`Click to place marker ${markerLabel(markers.length)}`}
      />

      {/* ── Google-Maps-style GPS popup ── */}
      {pendingMarker && (
        <div
          className="gps-popup"
          style={{ left: pendingMarker.popupX, top: pendingMarker.popupY }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            className="gps-popup__close"
            onClick={() => setPendingMarker(null)}
          >
            ✕
          </button>

          {/* Top: thumbnail + place info */}
          <div className="gps-popup__top">
            <div className="gps-popup__thumb">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="6" fill="#e8f5e9" />
                <path
                  d="M24 10C18.48 10 14 14.48 14 20c0 7.5 10 18 10 18s10-10.5 10-18c0-5.52-4.48-10-10-10zm0 13.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
                  fill="#2e7d32"
                />
              </svg>
            </div>
            <div className="gps-popup__place">
              <div className="gps-popup__place-name">
                {placeInfo?.loading ? (
                  <span className="gps-popup__place-loading">Locating…</span>
                ) : (
                  placeInfo?.name || "Unknown location"
                )}
              </div>
              {placeInfo?.region && !placeInfo?.loading && (
                <div className="gps-popup__place-region">
                  {placeInfo.region}
                </div>
              )}
              <div className="gps-popup__marker-tag">
                Marker {pendingMarker.label}
              </div>
            </div>
          </div>

          {/* Coordinates row */}
          <div className="gps-popup__coords-row">
            {pendingMarker.lat}, {pendingMarker.lon}
          </div>

          {/* Action buttons */}
          <div className="gps-popup__actions">
            <button
              className="gps-popup__btn gps-popup__btn--add"
              onClick={handleAddMarker}
            >
              + Add Marker
            </button>
            <button
              className="gps-popup__btn gps-popup__btn--icon"
              onClick={handleMaps}
              title="Open in Google Maps"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                width="16"
                height="16"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              className="gps-popup__btn gps-popup__btn--icon"
              onClick={handleCopy}
              title="Copy coordinates"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                width="16"
                height="16"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="frame-canvas-wrap__controls">
        <span className="frame-canvas-wrap__marker-count">
          {markers.length} marker{markers.length !== 1 ? "s" : ""}
        </span>
        {markers.length > 0 && (
          <button
            className="frame-canvas-wrap__clear-btn"
            onClick={() => {
              onMarkersChange([]);
              setPendingMarker(null);
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
