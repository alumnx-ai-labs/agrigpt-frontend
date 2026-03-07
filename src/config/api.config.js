/**
 * API Configuration
 *
 * Production (Vercel): all /api/* routes proxied by vercel.json:
 *   /api/agent/*   → VITE_AGENT_URL   (AgriGPT agent — chat)
 *   /api/fastapi/* → VITE_FASTAPI_URL (Original FastAPI — image upload)
 *   /api/cv/*      → VITE_CV_URL      (Computer Vision — drone analysis)
 *   /api/speech/*  → VITE_SPEECH_URL  (Speech service)
 *
 * Development: set VITE_*_URL vars in .env to your local servers.
 */

const isProd = import.meta.env.PROD;

export const API_CONFIG = {
  // FastAPI backend — handles all chat (calls agent internally, returns sources)
  BASE_URL: isProd
    ? "/api/fastapi"
    : import.meta.env.VITE_FASTAPI_URL || "http://localhost:8000",

  // Original FastAPI backend — handles image upload (/query-image-upload)
  IMAGE_BASE_URL: isProd
    ? "/api/fastapi"
    : import.meta.env.VITE_FASTAPI_URL || "http://localhost:8001",

  // Computer Vision backend — handles drone video, frame capture, analysis
  DRONE_BASE_URL: isProd
    ? "/api/cv"
    : import.meta.env.VITE_CV_URL || "http://localhost:8000",

  // Speech service
  SPEECH_BASE_URL: isProd
    ? "/api/speech"
    : import.meta.env.VITE_SPEECH_URL || "http://localhost:8002",

  // API endpoints
  ENDPOINTS: {
    WHATSAPP: "/whatsapp",
    IMAGE_UPLOAD: "/query-image-upload",
    VIDEO_QUERY: "/image-query",
  },

  IMAGE_PROXY: null,

  TIMEOUT: 30000,

  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2,
  },

  LANGUAGES: {
    ENGLISH: "en",
    HINDI: "hi",
    TELUGU: "te",
  },

  STORAGE_KEYS: {
    PHONE_NUMBER: "agrigpt_phone_number",
    USER_PREFERENCES: "agrigpt_user_preferences",
    CHAT_HISTORY: "agrigpt_chat_history",
  },

  PHONE: {
    COUNTRY_CODE: "91",
    LENGTH: 12,
  },

  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    COMPRESSION_QUALITY: 0.9,
  },
};

export default API_CONFIG;
