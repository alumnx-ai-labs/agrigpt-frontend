/**
 * CapturedFrames.jsx
 *
 * Horizontal scrollable strip of captured frame thumbnails.
 * Click a thumbnail to select it for the main analysis panel.
 */

import React from "react";
import { getFrameUrl } from "../../services/droneApi";

export default function CapturedFrames({ frames, selectedFrameId, onSelect }) {
  return (
    <div className="captured-frames-panel">
      <div className="captured-frames-panel__header">
        <span className="captured-frames-panel__title">Captured Frames</span>
        {frames.length > 0 && (
          <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
            {frames.length} frame{frames.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="captured-frames-panel__strip">
        {frames.length === 0 ? (
          <span className="captured-frames-panel__empty">
            No frames captured yet
          </span>
        ) : (
          frames.map((frame) => (
            <FrameThumb
              key={frame.frame_id}
              frame={frame}
              isSelected={frame.frame_id === selectedFrameId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

function FrameThumb({ frame, isSelected, onSelect }) {
  const label = `#${frame.frame_num ?? "?"}${
    frame.time_sec !== undefined ? ` · ${frame.time_sec.toFixed(1)}s` : ""
  }`;

  return (
    <div
      className={`frame-thumb${isSelected ? " frame-thumb--selected" : ""}`}
      onClick={() => onSelect(frame)}
      title={label}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(frame)}
    >
      <img
        className="frame-thumb__img"
        src={getFrameUrl(frame.frame_id)}
        alt={label}
        loading="lazy"
      />
      <div className="frame-thumb__label">{label}</div>
    </div>
  );
}
