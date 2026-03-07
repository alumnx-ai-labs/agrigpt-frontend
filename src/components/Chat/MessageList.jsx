import React, { useEffect, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
import SearchResults from "../SearchResults/SearchResults";
import "./MessageList.css";

/** Format a Date or timestamp string as HH:MM */
function formatTime(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Welcome message shown when no messages yet */
function WelcomeCard({ userName }) {
  const { t } = useLanguage();
  return (
    <div className="welcome-card">
      <h3>
        {userName
          ? `Hello ${userName} How can I help you Today`
          : t("welcomeTitle")}
      </h3>
      <p>{t("welcomeBody")}</p>
      <ul>
        <li>
          <span>💬</span> {t("feat1")}
        </li>
        <li>
          <span>📷</span> {t("feat2")}
        </li>
        <li>
          <span>🌱</span> {t("feat3")}
        </li>
      </ul>
      <p className="cta">{t("cta")}</p>
      <div className="welcome-time">{formatTime(new Date())}</div>
    </div>
  );
}

/** Single message bubble */
function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isSearchResults = message.messageType === "search_results";
  const hasSources =
    !isUser && Array.isArray(message.sources) && message.sources.length > 0;

  return (
    <div className={`message-row ${message.role}`}>
      <div className={`bubble ${isSearchResults ? "bubble--wide" : ""}`}>
        {message.imageUrl && (
          <img
            className="bubble-image"
            src={message.imageUrl}
            alt="uploaded crop"
          />
        )}

        {isSearchResults ? (
          <SearchResults results={message.content} />
        ) : (
          <div className="bubble-text">{message.content}</div>
        )}

        {hasSources && (
          <div className="bubble-sources">
            <span className="bubble-sources__label">Sources</span>
            <ul className="bubble-sources__list">
              {message.sources.map((src, i) => {
                const label =
                  typeof src === "string"
                    ? src
                    : src.title || src.name || src.url || JSON.stringify(src);
                const url =
                  typeof src === "object" ? src.url || src.link || null : null;
                return (
                  <li key={i} className="bubble-sources__item">
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

        <div className="bubble-meta">
          {formatTime(message.timestamp)}
          {isUser && <span className="bubble-tick">✓✓</span>}
        </div>
      </div>
    </div>
  );
}

/** Animated typing indicator */
function TypingIndicator() {
  return (
    <div className="message-row assistant">
      <div className="typing-bubble">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

/** Error display with retry option */
function ErrorBanner({ message, onRetry, onDismiss }) {
  const { t } = useLanguage();
  return (
    <div className="error-banner">
      <span>⚠️ {message}</span>
      {onRetry && <button onClick={onRetry}>{t("errorRetry")}</button>}
    </div>
  );
}

export default function MessageList({
  messages,
  isLoading,
  error,
  onClearError,
  userName,
}) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {/* Date separator */}
      <div className="date-separator">
        <span>
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>
      </div>

      {/* Welcome card or messages */}
      {messages.length === 0 ? (
        <WelcomeCard userName={userName} />
      ) : (
        messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
      )}

      {/* Loading indicator */}
      {isLoading && <TypingIndicator />}

      {/* Error */}
      {error && <ErrorBanner message={error} onDismiss={onClearError} />}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
