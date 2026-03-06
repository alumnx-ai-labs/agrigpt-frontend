/**
 * Drone Analysis API Service
 * All calls target the FastAPI backend at http://localhost:8000
 */

import { API_CONFIG } from "../config/api.config";

const BASE = API_CONFIG.DRONE_BASE_URL;

/**
 * Capture the current video frame at the given timestamp.
 * @param {number} time_sec - Current video time in seconds
 * @returns {Promise<{ frame_id: string, frame_num: number, time_sec: number, storage: string, telemetry: object, gsd_cm_px: number }>}
 */
export const listVideos = () =>
  fetch(`${BASE}/video/list/all`).then((r) => {
    if (!r.ok) throw new Error(`List videos failed: ${r.status}`);
    return r.json();
  });

export const captureFrame = (time_sec, video_id) =>
  fetch(`${BASE}/image-query/capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ time_sec, video_id }),
  }).then((r) => {
    if (!r.ok) throw new Error(`Capture failed: ${r.status}`);
    return r.json();
  });

/**
 * Returns a direct image URL for the given frame_id.
 * Use as <img src={getFrameUrl(frame_id)} />.
 * @param {string} frame_id
 * @returns {string}
 */
export const getFrameUrl = (frame_id) =>
  `${BASE}/image-query/frame/${frame_id}`;

/**
 * List all captured frames for the current session.
 * @returns {Promise<Array<{ frame_id: string, frame_num: number, time_sec: number, telemetry: object, gsd_cm_px: number }>>}
 */
export const listFrames = (video_id) =>
  fetch(
    `${BASE}/image-query/frames?video_id=${encodeURIComponent(video_id)}`,
  ).then((r) => {
    if (!r.ok) throw new Error(`List frames failed: ${r.status}`);
    return r.json();
  });

/**
 * Query a captured frame with optional 4-point polygon markers.
 * @param {string} frame_id
 * @param {Array<[number, number]>} points - Up to 4 [x, y] pairs in original image coords
 * @param {string} question - Natural-language question
 * @returns {Promise<{ answer: string, annotated_b64: string, telemetry: object }>}
 */
export const queryFrame = (frame_id, points, question) =>
  fetch(`${BASE}/image-query/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ frame_id, points, question, use_llm: false }),
  }).then((r) => {
    if (!r.ok) throw new Error(`Query failed: ${r.status}`);
    return r.json();
  });
