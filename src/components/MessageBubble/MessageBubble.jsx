import './MessageBubble.css'

/**
 * MessageBubble – renders a single chat message (user or AI)
 * Supports text and image message types
 */
export default function MessageBubble({ message }) {
  const { role, type, content, caption, ts } = message
  const isUser = role === 'user'

  const timeStr = ts instanceof Date
    ? ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className={`bubble-wrap ${isUser ? 'bubble-wrap--user' : 'bubble-wrap--ai'}`}>
      {/* AI avatar */}
      {!isUser && (
        <div className="bubble-avatar">🌾</div>
      )}

      <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--ai'}`}>
        {/* Image message */}
        {type === 'image' && (
          <div className="bubble__image-wrap">
            <img
              src={content}
              alt="Uploaded crop"
              className="bubble__image"
            />
            {caption && (
              <p className="bubble__caption">{caption}</p>
            )}
          </div>
        )}

        {/* Text message */}
        {type === 'text' && (
          <p className="bubble__text">{content}</p>
        )}

        {/* Timestamp + tick */}
        <div className="bubble__meta">
          <span className="bubble__time">{timeStr}</span>
          {isUser && <span className="bubble__tick">✓✓</span>}
        </div>
      </div>
    </div>
  )
}
