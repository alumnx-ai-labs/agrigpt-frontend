import API_CONFIG from '../config/api.config.js'

const BASE_URL = API_CONFIG.BASE_URL
const IMAGE_BASE_URL = API_CONFIG.IMAGE_BASE_URL

function extractResponse(data) {
  if (typeof data === 'string') return { type: 'text', content: data }

  // Image search results - return structured data
  if (data.results && Array.isArray(data.results)) {
    // Check if it's image search results (has image_id or similarity_score)
    const hasImageFields = data.results.some(r =>
      r.image_id || r.similarity_score !== undefined || r.image_url
    )

    if (hasImageFields) {
      const processedResults = data.results.map(result => {
        if (result.image_url && import.meta.env.PROD && result.image_url.startsWith('http://13.200.178.118')) {
          return {
            ...result,
            image_url: `/api/image-proxy?url=${encodeURIComponent(result.image_url)}`
          }
        }
        return result
      })
      return { type: 'search_results', content: processedResults }
    }

    // Other array results - format as text
    const text = data.results.map((r, i) =>
      `${i + 1}. ${r.disease || r.name || JSON.stringify(r)}`
    ).join('\n\n')
    return { type: 'text', content: text }
  }

  // Extract text from common response fields
  if (data.response) return { type: 'text', content: data.response }
  if (data.message) return { type: 'text', content: data.message }
  if (data.answer) return { type: 'text', content: data.answer }
  if (data.result) return { type: 'text', content: data.result }

  // Fallback to JSON string
  return { type: 'text', content: JSON.stringify(data, null, 2) }
}

export async function sendTextQuery(phoneNumber, query, chatId, language) {
  try {
    // Format phone number to start with country code (e.g. 91)
    const formattedPhone = phoneNumber.length === 10 ? `91${phoneNumber}` : phoneNumber

    const response = await fetch(`${BASE_URL}${API_CONFIG.ENDPOINTS.WHATSAPP}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: formattedPhone,
        phone_number: formattedPhone,
        message: query,
        query: query,
        chatId,
        language
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(errorText || `Request failed with status ${response.status}`)
    }

    const data = await response.json()
    return extractResponse(data)
  } catch (error) {
    console.error('Text query error:', error)
    throw new Error(`Failed to send query: ${error.message}`)
  }
}

export async function sendImageQuery(imageFile, phoneNumber, query, topK = 5, chatId, language) {
  const formData = new FormData()
  formData.append('file', imageFile)
  formData.append('phone_number', phoneNumber)
  formData.append('query', query)
  if (chatId) formData.append('chatId', chatId)
  if (language) formData.append('language', language)

  // In production, use Vercel serverless proxy to avoid HTTPS/HTTP mixed content
  // In development, call backend directly
  const imageUrl = API_CONFIG.IMAGE_PROXY
    ? `${API_CONFIG.IMAGE_PROXY}?top_k=${topK}`
    : `${IMAGE_BASE_URL}${API_CONFIG.ENDPOINTS.IMAGE_UPLOAD}?top_k=${topK}`

  console.log('[Image Upload] Sending to:', imageUrl)
  console.log('[Image Upload] Environment:', import.meta.env.PROD ? 'production' : 'development')
  console.log('[Image Upload] File:', imageFile.name, imageFile.type, imageFile.size, 'bytes')

  try {
    const response = await fetch(imageUrl, {
      method: 'POST',
      mode: 'cors',
      body: formData,
    })

    console.log('[Image Upload] Response status:', response.status, response.statusText)
    console.log('[Image Upload] Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      console.error('[Image Upload] Error response:', errorText)
      throw new Error(errorText || `Upload failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log('[Image Upload] Success response:', data)
    return extractResponse(data)
  } catch (error) {
    console.error('[Image Upload] Exception caught:', error)
    console.error('[Image Upload] Error stack:', error.stack)

    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to image server. Please check if the backend is accessible and CORS is properly configured.')
    }

    if (error.message.includes('NOT_FOUND') || error.message.includes('404')) {
      throw new Error('Image upload endpoint not found. The proxy route may not be configured correctly.')
    }

    throw new Error(`Failed to upload image: ${error.message}`)
  }
}
