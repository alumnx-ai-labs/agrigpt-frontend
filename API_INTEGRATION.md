# AgriGPT API Integration Guide

## Overview

This document describes the integration between the FarmChat frontend and the AgriGPT backend API.

## Backend API

**Base URL:** `https://newapi.alumnx.com/agrigpt/agent`

**Documentation:** [https://newapi.alumnx.com/agrigpt/agent/docs](https://newapi.alumnx.com/agrigpt/agent/docs)

## Endpoints

### POST `/test/chat`

Main endpoint to handle incoming messages and interact with the AI agent.

**Request:**
```json
{
  "phoneNumber": "string",  // User identifier (auto-generated per session)
  "message": "string"        // User's query or message
}
```

**Response:**
```json
{
  "phoneNumber": "string",
  "message": "string"  // AI agent's response
}
```

## Frontend Implementation

### API Service (`src/services/api.js`)

The API service provides two main functions:

#### `sendTextQuery(query, lang)`

Sends a text-based farming query to the AI agent.

**Parameters:**
- `query` (string): The user's question
- `lang` (string, optional): Language code - `'en'` (default), `'hi'`, or `'te'`

**Returns:** Promise<string> - The AI's response

**Example:**
```javascript
import { sendTextQuery } from './services/api'

const response = await sendTextQuery('How do I prevent tomato blight?', 'en')
```

#### `sendImageQuery(imageFile, query, lang)`

Sends an image for crop diagnosis and analysis.

**Parameters:**
- `imageFile` (File): Image file to analyze
- `query` (string, optional): Additional question about the image
- `lang` (string, optional): Language code

**Returns:** Promise<string> - The AI's diagnosis and recommendations

**Example:**
```javascript
import { sendImageQuery } from './services/api'

const response = await sendImageQuery(
  imageFile, 
  'What disease does this plant have?',
  'en'
)
```

### Phone Number Management

The API requires a phone number to identify users. The frontend automatically generates and persists a unique phone number for each user session using localStorage.

**Format:** `91XXXXXXXXXX` (Indian phone number format)

**Storage Key:** `agrigpt_phone_number`

To reset the phone number (for testing):
```javascript
import { resetPhoneNumber } from './services/api'

resetPhoneNumber()  // Clear stored phone number
```

## Language Support

The application supports three languages:

- **English** (`en`) - Default
- **Hindi** (`hi`)
- **Telugu** (`te`)

Language preference is passed to the API by prefixing the message with `[Language: {lang}]` for non-English queries.

## Image Handling

For image queries, the frontend:

1. Converts the image to base64 format
2. Creates a structured message with image data
3. Sends it as a JSON-stringified message to the `/test/chat` endpoint
4. Falls back to FormData approach if the primary method fails

**Image Message Format:**
```json
{
  "type": "image",
  "language": "en",
  "query": "Analyze this crop image",
  "image": "data:image/jpeg;base64,...",
  "filename": "crop.jpg"
}
```

## Error Handling

All API functions throw errors with descriptive messages:

```javascript
try {
  const response = await sendTextQuery(query, lang)
  // Handle success
} catch (error) {
  // error.message contains the error description
  console.error('API Error:', error.message)
}
```

## Testing the Integration

1. **Start the development server:**
   ```powershell
   cd Farmer-web
   npm run dev
   ```

2. **Test text queries:**
   - Type a farming question in the chat input
   - Press Enter or click Send
   - Verify the AI response appears

3. **Test image queries:**
   - Click the camera 📷 or gallery 🖼 icon
   - Select or capture a crop image
   - Optionally add a text question
   - Send the image
   - Verify the AI provides image analysis

## Debugging

To inspect API calls:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "whatsapp"
4. Check request/response payloads

To view the current phone number:
```javascript
console.log(localStorage.getItem('agrigpt_phone_number'))
```

## Known Limitations

1. The API documentation shows the primary endpoint `/test/chat`
2. Image handling uses a custom format (base64 in message) that may require backend support
3. If image uploads fail, check if the backend has an undocumented `/query-image-upload` endpoint

## Future Improvements

- [ ] Add retry logic for failed requests
- [ ] Implement request/response caching
- [ ] Add typing indicators
- [ ] Support for voice messages
- [ ] Batch message sending
- [ ] WebSocket support for real-time responses
