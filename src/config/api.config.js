/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  // Base URL for the AgriGPT backend
  BASE_URL: 'https://newapi.alumnx.com/agrigpt/fastapi',
  
  // Image upload base URL
  // In production, use Vercel serverless proxy to avoid HTTPS/HTTP mixed content issues
  // In development, call the HTTP backend directly
  IMAGE_BASE_URL: import.meta.env.PROD ? '' : 'http://13.200.178.118:8008',
  
  // API endpoints
  ENDPOINTS: {
    WHATSAPP: '/whatsapp',
    IMAGE_UPLOAD: '/query-image-upload',
  },
  
  // Production uses Vercel proxy to handle HTTP backend
  IMAGE_PROXY: import.meta.env.PROD ? '/api/image-upload' : null,
  
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
    ENGLISH: 'en',
    HINDI: 'hi',
    TELUGU: 'te',
  },
  
  // LocalStorage keys
  STORAGE_KEYS: {
    PHONE_NUMBER: 'agrigpt_phone_number',
    USER_PREFERENCES: 'agrigpt_user_preferences',
    CHAT_HISTORY: 'agrigpt_chat_history',
  },
  
  // Phone number generation config
  PHONE: {
    COUNTRY_CODE: '91',
    LENGTH: 12,
  },
  
  // Image upload settings
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024,
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    COMPRESSION_QUALITY: 0.9,
  },
}

export default API_CONFIG
