/**
 * DroneAnalysis.jsx
 *
 * Layout:
 *  left main-pane  — video player or selected frame canvas + query panel
 *  right sidebar   — video selector, controls, captured frames panel
 */

import { useState, useEffect, useRef } from "react";
import "./DroneAnalysis.css";
import FrameCanvas from "./FrameCanvas";
import QueryPanel from "./QueryPanel";
import {
  listVideos,
  captureFrame,
  listFrames,
  getFrameUrl,
} from "../../services/droneApi";
import { API_CONFIG } from "../../config/api.config";

function fmtTime(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function DroneAnalysis() {
  // ── Video catalogue ──────────────────────────────────────
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // ── View state ────────────────────────────────────────────
  const [viewMode, setViewMode] = useState("video"); // "video" | "frame"
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [markers, setMarkers] = useState([]);

  // ── Video player ─────────────────────────────────────────
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState(
    "Select a video, scrub to a frame, then capture",
  );

  // ── Load video list on mount ─────────────────────────────
  useEffect(() => {
    listVideos()
      .then((data) => {
        const list = data.videos || [];
        setVideos(list);
        if (list.length > 0) {
          setSelectedVideoId(list[0].video_id);
        } else {
          // Backend has no S3/local list yet — use the known default video
          setSelectedVideoId("drone");
        }
      })
      .catch(() => {
        // Network error — still try the default
        setSelectedVideoId("drone");
      });
  }, []);

  // ── When selected video changes: reload captures, reset state ──
  useEffect(() => {
    if (!selectedVideoId) return;
    setCapturedFrames([]);
    setSelectedFrame(null);
    setMarkers([]);
    setViewMode("video");
    setCurrentTime(0);
    if (videoRef.current) videoRef.current.load();

    listFrames(selectedVideoId)
      .then((data) => {
        if (Array.isArray(data.frames)) setCapturedFrames(data.frames);
      })
      .catch(() => {});
  }, [selectedVideoId]);

  // ── Video src ─────────────────────────────────────────────
  const videoSrc = selectedVideoId
    ? `${API_CONFIG.DRONE_BASE_URL}/video/${selectedVideoId}`
    : null;

  // ── Video event handlers ──────────────────────────────────
  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };
  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };
  const togglePlayPause = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused || vid.ended) vid.play();
    else vid.pause();
  };
  const handleScrub = (e) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = parseFloat(e.target.value);
  };

  // ── Capture ───────────────────────────────────────────────
  const handleCapture = async () => {
    const vid = videoRef.current;
    if (!vid || !selectedVideoId) return;
    setCapturing(true);
    setCaptureStatus("Capturing…");
    try {
      const result = await captureFrame(vid.currentTime, selectedVideoId);
      setCapturedFrames((prev) =>
        prev.some((f) => f.frame_id === result.frame_id)
          ? prev
          : [...prev, result],
      );
      setCaptureStatus(`Frame #${result.frame_num} captured`);
    } catch (err) {
      setCaptureStatus(`Error: ${err.message}`);
    } finally {
      setCapturing(false);
    }
  };

  // ── Frame selection ───────────────────────────────────────
  const handleSelectFrame = (frame) => {
    setSelectedFrame(frame);
    setMarkers([]);
    setViewMode("frame");
  };
  const handleBackToVideo = () => {
    setViewMode("video");
    setSelectedFrame(null);
    setMarkers([]);
  };

  const statusCls = captureStatus.startsWith("Error")
    ? " drone-capture-status--err"
    : captureStatus.includes("captured")
      ? " drone-capture-status--ok"
      : "";

  return (
    <div className="drone-layout">
      {/* ══════════════════════════════════════════
          LEFT: main pane
          ═════════════════════════════════════════ */}
      <div className="drone-main-pane">
        {viewMode === "video" ? (
          <div className="drone-video-area">
            {videoSrc ? (
              <>
                <video
                  ref={videoRef}
                  className="drone-video"
                  src={videoSrc}
                  preload="metadata"
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                  onClick={togglePlayPause}
                />
                <div className="drone-video-hint">
                  Click video to play/pause · scrub in sidebar · capture frame
                </div>
              </>
            ) : (
              <div className="drone-video-placeholder">Select a video →</div>
            )}
          </div>
        ) : (
          <div className="drone-frame-area">
            <FrameCanvas
              frame={selectedFrame}
              markers={markers}
              onMarkersChange={setMarkers}
              telemetry={selectedFrame?.telemetry}
              gsdCmPx={selectedFrame?.gsd_cm_px}
            />
          </div>
        )}

        {viewMode === "frame" && (
          <QueryPanel frame={selectedFrame} markers={markers} />
        )}
      </div>

      {/* ══════════════════════════════════════════
          RIGHT: sidebar
          ═════════════════════════════════════════ */}
      <aside className="drone-sidebar">
        {/* ── Back to video ──────────────────────── */}
        {viewMode === "frame" && (
          <div className="drone-sidebar-back">
            <button className="drone-back-btn" onClick={handleBackToVideo}>
              ← Back to Video
            </button>
            {selectedFrame && (
              <span className="drone-frame-chip">
                #{selectedFrame.frame_num}
                {selectedFrame.telemetry?.rel_alt_m != null &&
                  ` · ${selectedFrame.telemetry.rel_alt_m}m`}
              </span>
            )}
          </div>
        )}

        {/* ── Video Selector ─────────────────────── */}
        <div className="drone-sidebar-section">
          <div className="drone-sidebar-heading">Select Video</div>
          {videos.length === 0 ? (
            <div className="drone-thumbs-empty">No videos found</div>
          ) : (
            <div className="drone-video-list">
              {videos.map((v) => (
                <button
                  key={v.video_id}
                  className={`drone-video-item${
                    selectedVideoId === v.video_id
                      ? " drone-video-item--active"
                      : ""
                  }`}
                  onClick={() => setSelectedVideoId(v.video_id)}
                >
                  <span className="drone-video-icon">🎥</span>
                  <span className="drone-video-name">{v.video_id}</span>
                  <span className="drone-video-source">{v.source}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Video Controls ─────────────────────── */}
        {selectedVideoId && (
          <div className="drone-sidebar-section">
            <div className="drone-sidebar-heading">Video Controls</div>

            <div className="drone-time-display">
              {fmtTime(currentTime)} / {fmtTime(duration)}
            </div>

            <div className="drone-scrubber-wrap">
              <input
                type="range"
                className="drone-scrubber"
                min="0"
                max={duration || 100}
                step="0.05"
                value={currentTime}
                onChange={handleScrub}
              />
            </div>

            <div className="drone-playback-row">
              <button
                className="drone-playpause-btn"
                onClick={togglePlayPause}
                title={playing ? "Pause" : "Play"}
              >
                {playing ? "⏸" : "▶"}
              </button>
              <button
                className="drone-capture-btn"
                onClick={handleCapture}
                disabled={capturing}
              >
                {capturing ? (
                  <>
                    <span className="drone-btn-spinner" /> Capturing…
                  </>
                ) : (
                  <>📷 Capture Frame</>
                )}
              </button>
            </div>

            <div className={`drone-capture-status${statusCls}`}>
              {captureStatus}
            </div>
          </div>
        )}

        {/* ── Captured Frames Panel ──────────────── */}
        <div className="drone-sidebar-section drone-sidebar-section--compact">
          <div className="drone-sidebar-heading">
            Captures{" "}
            <span className="drone-count">({capturedFrames.length})</span>
          </div>
        </div>

        <div className="drone-thumbs-scroll">
          {capturedFrames.length === 0 ? (
            <div className="drone-thumbs-empty">No captures yet</div>
          ) : (
            <div className="drone-thumbs-grid">
              {capturedFrames.map((frame) => (
                <div
                  key={frame.frame_id}
                  className={`drone-thumb${
                    selectedFrame?.frame_id === frame.frame_id
                      ? " drone-thumb--selected"
                      : ""
                  }`}
                  onClick={() => handleSelectFrame(frame)}
                >
                  <img
                    src={getFrameUrl(frame.frame_id)}
                    alt={`Frame ${frame.frame_num}`}
                  />
                  <div className="drone-thumb-label">#{frame.frame_num}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
