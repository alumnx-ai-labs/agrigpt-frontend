import API_CONFIG from "../config/api.config.js";

const BASE_URL = API_CONFIG.BASE_URL;
const IMAGE_BASE_URL = API_CONFIG.IMAGE_BASE_URL;

function extractResponse(data) {
  if (typeof data === "string")
    return { type: "text", content: data, sources: [] };

  // Image search results
  if (data.results && Array.isArray(data.results)) {
    const hasImageFields = data.results.some(
      (r) => r.image_id || r.similarity_score !== undefined || r.image_url,
    );
    if (hasImageFields) {
      return {
        type: "search_results",
        content: data.results,
        sources: data.sources || [],
      };
    }
    const text = data.results
      .map((r, i) => `${i + 1}. ${r.disease || r.name || JSON.stringify(r)}`)
      .join("\n\n");
    return { type: "text", content: text, sources: data.sources || [] };
  }

  // Extract text + sources from agent response
  const sources =
    data.sources || data.references || data.source_documents || [];
  if (data.response) return { type: "text", content: data.response, sources };
  if (data.output) return { type: "text", content: data.output, sources };
  if (data.text) return { type: "text", content: data.text, sources };
  if (data.message) return { type: "text", content: data.message, sources };
  if (data.answer) return { type: "text", content: data.answer, sources };
  if (data.result) return { type: "text", content: data.result, sources };

  return { type: "text", content: JSON.stringify(data, null, 2), sources: [] };
}

export async function sendTextQuery(phoneNumber, query, chatId, language) {
  try {
    const formattedPhone =
      phoneNumber.length === 10 ? `91${phoneNumber}` : phoneNumber;

    const response = await fetch(
      `${BASE_URL}${API_CONFIG.ENDPOINTS.WHATSAPP}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          phone_number: formattedPhone,
          message: query,
          chatId,
          language,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        errorText || `Request failed with status ${response.status}`,
      );
    }

    const data = await response.json();
    return extractResponse(data);
  } catch (error) {
    console.error("Text query error:", error);
    throw new Error(`Failed to send query: ${error.message}`);
  }
}

export async function sendImageQuery(
  imageFile,
  phoneNumber,
  query,
  topK = 5,
  chatId,
  language,
) {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("phone_number", phoneNumber);
  formData.append("query", query);
  if (chatId) formData.append("chatId", chatId);
  if (language) formData.append("language", language);

  const imageUrl = `${IMAGE_BASE_URL}${API_CONFIG.ENDPOINTS.IMAGE_UPLOAD}?top_k=${topK}`;

  try {
    const response = await fetch(imageUrl, {
      method: "POST",
      mode: "cors",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        errorText || `Upload failed with status ${response.status}`,
      );
    }

    const data = await response.json();
    return extractResponse(data);
  } catch (error) {
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      throw new Error(
        "Cannot connect to image server. Check backend accessibility and CORS.",
      );
    }
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}
