/**
 * Vercel Serverless Function to proxy image upload requests
 * This avoids HTTPS/HTTP mixed content issues when calling the HTTP backend
 * from an HTTPS deployed frontend
 */

import fetch from 'node-fetch'

export const config = {
  api: {
    bodyParser: false,
  },
}

const BACKEND_URL = 'http://13.200.178.118:8008/query-image-upload'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, content-type')
  res.setHeader('Access-Control-Max-Age', '86400')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('[Proxy] Handling OPTIONS preflight')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    console.error('[Proxy] Invalid method:', req.method)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const topK = req.query.top_k || '5'
    const backendUrl = `${BACKEND_URL}?top_k=${topK}`

    console.log('[Proxy] Proxying request to:', backendUrl)
    console.log('[Proxy] Query params:', req.query)
    console.log('[Proxy] Content-Type:', req.headers['content-type'])

    // Read the request body
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    console.log('[Proxy] Request body size:', buffer.length, 'bytes')

    // Forward to backend with original content-type
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'content-type': req.headers['content-type'],
      },
      body: buffer,
    })

    console.log('[Proxy] Backend response status:', response.status)

    // Get response text first
    const responseText = await response.text()
    console.log('[Proxy] Backend response:', responseText.substring(0, 500))

    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('[Proxy] Failed to parse JSON response:', e.message)
      // Return the text response wrapped in an object
      data = { response: responseText }
    }

    return res.status(response.status).json(data)
  } catch (error) {
    console.error('[Proxy] Error:', error.message)
    console.error('[Proxy] Stack:', error.stack)

    // Check if it's a network error
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
      return res.status(503).json({
        error: 'Backend server is not reachable. Please check if http://13.200.178.118:8008 is running and accessible.',
        details: error.message
      })
    }

    return res.status(500).json({
      error: 'Proxy error: ' + error.message,
      details: error.stack
    })
  }
}
