/**
 * API Configuration
 *
 * Production (Vercel): all /api/* routes are proxied by vercel.json rewrites:
 *   /api/agent/*  → https://newapi.alumnx.com/agrigpt/agent/*
 *   /api/cv/*     → https://newapi.alumnx.com/agrigpt/cv/*
 *   /api/speech/* → https://newapi.alumnx.com/agrigpt/speech/*
 *
 * Development: set VITE_BACKEND_URL in .env to your local FastAPI server.
 */

const BACKEND_URL = import.meta.env.PROD
  ? "/api/cv"
  : import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const API_CONFIG = {
  // Agent chat API
  // Production: proxied via /api/agent → https://newapi.alumnx.com/agrigpt/agent
  // Dev: set VITE_API_BASE_URL or falls back to localhost
  BASE_URL: import.meta.env.PROD
    ? "/api/agent"
    : import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",

  // Drone + image-query backend (CV service)
  DRONE_BASE_URL: BACKEND_URL,

  // Image upload — same backend
  IMAGE_BASE_URL: BACKEND_URL,

  // Speech API
  SPEECH_BASE_URL: import.meta.env.PROD
    ? "/api/speech"
    : import.meta.env.VITE_SPEECH_API_URL || "http://localhost:8001",

  // API endpoints
  ENDPOINTS: {
    WHATSAPP: "/test/chat",
    IMAGE_UPLOAD: "/query-image-upload",
    VIDEO_QUERY: "/image-query",
  },

  // No serverless proxy needed — backend is HTTPS and proxied via vercel.json
  IMAGE_PROXY: null,

  // Request timeout in milliseconds
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000,
    BACKOFF_MULTIPLIER: 2,
  },

  // Supported languages
  LANGUAGES: {
    ENGLISH: "en",
    HINDI: "hi",
    TELUGU: "te",
  },

  // LocalStorage keys
  STORAGE_KEYS: {
    PHONE_NUMBER: "agrigpt_phone_number",
    USER_PREFERENCES: "agrigpt_user_preferences",
    CHAT_HISTORY: "agrigpt_chat_history",
  },

  // Phone number generation config
  PHONE: {
    COUNTRY_CODE: "91",
    LENGTH: 12,
  },

  // Image upload settings
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    COMPRESSION_QUALITY: 0.9,
  },
};

export default API_CONFIG;
