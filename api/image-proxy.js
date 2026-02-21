export const config = {
    api: {
        responseLimit: '8mb',
    },
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, content-type')
    res.setHeader('Access-Control-Max-Age', '86400')

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
        const targetUrl = req.query.url;

        if (!targetUrl) {
            return res.status(400).json({ error: 'URL parameter is required' })
        }

        // Optional: validation to only allow fetching from specific backend
        if (!targetUrl.startsWith('http://13.200.178.118')) {
            return res.status(403).json({ error: 'URL domain not permitted' })
        }

        console.log('[Image Proxy] Fetching:', targetUrl)

        // We use dynamic import for node-fetch or global fetch if available
        const fetchFn = globalThis.fetch || (await import('node-fetch')).default;

        const response = await fetchFn(targetUrl, {
            method: 'GET',
        })

        if (!response.ok) {
            console.error(`[Image Proxy] Failed to fetch image: ${response.status} ${response.statusText}`);
            return res.status(response.status).json({ error: 'Failed to fetch image from backend' });
        }

        // Set content-type header from backend response
        const contentType = response.headers.get('content-type');
        if (contentType) {
            res.setHeader('Content-Type', contentType);
        }

        // Set caching headers mapped to Vercel's edge cache (1 day)
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

        // Convert response to buffer and send
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return res.status(200).send(buffer);

    } catch (error) {
        console.error('[Image Proxy] Error:', error.message)
        return res.status(500).json({ error: 'Failed to proxy image request: ' + error.message })
    }
}
