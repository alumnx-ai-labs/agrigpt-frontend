import "./MessageBubble.css";

export default function MessageBubble({ message }) {
  const { role, type, content, caption, ts, sources } = message;
  const isUser = role === "user";

  const timeStr =
    ts instanceof Date
      ? ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";

  const hasSources = !isUser && Array.isArray(sources) && sources.length > 0;

  return (
    <div
      className={`bubble-wrap ${isUser ? "bubble-wrap--user" : "bubble-wrap--ai"}`}
    >
      {!isUser && <div className="bubble-avatar">🌾</div>}

      <div className={`bubble ${isUser ? "bubble--user" : "bubble--ai"}`}>
        {type === "image" && (
          <div className="bubble__image-wrap">
            <img src={content} alt="Uploaded crop" className="bubble__image" />
            {caption && <p className="bubble__caption">{caption}</p>}
          </div>
        )}

        {type === "text" && <p className="bubble__text">{content}</p>}

        {hasSources && (
          <div className="bubble__sources">
            <span className="bubble__sources-label">Sources</span>
            <ul className="bubble__sources-list">
              {sources.map((src, i) => {
                const label =
                  typeof src === "string"
                    ? src
                    : src.title || src.name || src.url || JSON.stringify(src);
                const url =
                  typeof src === "object" ? src.url || src.link || null : null;
                return (
                  <li key={i} className="bubble__source-item">
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {label}
                      </a>
                    ) : (
                      <span>{label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="bubble__meta">
          <span className="bubble__time">{timeStr}</span>
          {isUser && <span className="bubble__tick">✓✓</span>}
        </div>
      </div>
    </div>
  );
}
