import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Backend is not responding');
  }
};

// Clear knowledge base
export const clearKnowledgeBase = async () => {
  try {
    const response = await api.delete('/clear-knowledge-base');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to clear knowledge base'
    );
  }
};

// ========================================
// CLIP Image Search APIs
// ========================================

// Search images by text query (text-to-image)
export const searchImagesByText = async (query, topK = 5) => {
  try {
    const response = await api.post('/hybrid-image-query', {
      query,
      top_k: topK
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to search images by text'
    );
  }
};

// Search similar images by uploading an image (image-to-image)
export const searchImagesByImage = async (file, topK = 5) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post(`/query-by-image?top_k=${topK}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to search images by image'
    );
  }
};

// Query with image and text (multimodal Q&A)
export const queryWithImageAndText = async (file, query) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('query', query);

  try {
    const response = await api.post('/ask-with-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to query with image'
    );
  }
};

// ========================================
// Government Schemes APIs
// ========================================

// Query government schemes (text RAG)
export const queryGovernmentSchemes = async (query, chatHistory = []) => {
  try {
    const response = await api.post('/query-government-schemes', {
      query,
      chat_history: chatHistory
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to query government schemes'
    );
  }
};

// Query citrus crop consultant (text RAG)
export const askCropConsultant = async (query, chatHistory = []) => {
  try {
    const response = await api.post('/ask-consultant', {
      query,
      chat_history: chatHistory
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.detail || 'Failed to get consultant response'
    );
  }
};
