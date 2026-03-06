/**
 * VideoPlayer.jsx
 *
 * Props:
 *  onCapture(meta)         — called after successful frame capture
 *  initialTime (number)    — seek to this timestamp on mount (preserves position)
 *  onTimeUpdate(t)         — fires as user scrubs (for parent to persist time)
 *  large (bool)            — true = fills analysis panel; false = compact preview
 */

import React, { useRef, useState, useEffect } from "react";
import { captureFrame } from "../../services/droneApi";
import { API_CONFIG } from "../../config/api.config";

const VIDEO_SRC = `${API_CONFIG.DRONE_BASE_URL}/video`;

export default function VideoPlayer({
  onCapture,
  initialTime = 0,
  onTimeUpdate,
  large = false,
}) {
  const videoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(null);

  /* Seek to persisted position on mount */
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !initialTime) return;
    const onReady = () => {
      vid.currentTime = initialTime;
    };
    if (vid.readyState >= 1) {
      vid.currentTime = initialTime;
    } else {
      vid.addEventListener("loadedmetadata", onReady, { once: true });
    }
    return () => vid.removeEventListener("loadedmetadata", onReady);
  }, []); /* run once on mount only */

  const handleTimeUpdate = () => {
    if (onTimeUpdate && videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    const time_sec = videoRef.current.currentTime;
    setCapturing(true);
    setError(null);
    try {
      const result = await captureFrame(time_sec);
      if (onCapture) onCapture(result);
    } catch (err) {
      setError("Capture failed: " + err.message);
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div className={`video-panel${large ? " video-panel--large" : ""}`}>
      <div className="video-panel__header">
        <span className="video-panel__title">
          {large ? "Drone Video" : "Video Preview"}
        </span>
        <button
          className="capture-btn"
          onClick={handleCapture}
          disabled={capturing}
          title="Capture current frame"
        >
          {capturing ? (
            <>
              <span className="capture-btn__spinner" /> Capturing…
            </>
          ) : (
            <>
              <CameraIcon /> Capture Frame
            </>
          )}
        </button>
      </div>

      <video
        ref={videoRef}
        className="video-panel__video"
        src={VIDEO_SRC}
        controls
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
      />

      {error && <div className="video-panel__error">{error}</div>}
    </div>
  );
}

function CameraIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
