import React, { useEffect, useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import SearchResults from '../SearchResults/SearchResults'
import './MessageList.css'

/** Format a Date as HH:MM */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** Welcome message shown when no messages yet */
function WelcomeCard() {
  const { t } = useLanguage()
  return (
    <div className="welcome-card">
      <h3>{t('welcomeTitle')}</h3>
      <p>{t('welcomeBody')}</p>
      <ul>
        <li><span>💬</span> {t('feat1')}</li>
        <li><span>📷</span> {t('feat2')}</li>
        <li><span>🌱</span> {t('feat3')}</li>
      </ul>
      <p className="cta">{t('cta')}</p>
      <div className="welcome-time">{formatTime(new Date())}</div>
    </div>
  )
}

/** Single message bubble */
function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const isSearchResults = message.messageType === 'search_results'
  
  return (
    <div className={`message-row ${message.role}`}>
      <div className={`bubble ${isSearchResults ? 'bubble--wide' : ''}`}>
        {message.imageUrl && (
          <img className="bubble-image" src={message.imageUrl} alt="uploaded crop" />
        )}
        
        {/* Render search results */}
        {isSearchResults ? (
          <SearchResults results={message.content} />
        ) : (
          <div className="bubble-text">{message.content}</div>
        )}
        
        <div className="bubble-meta">
          {formatTime(message.timestamp)}
          {isUser && <span className="bubble-tick">✓✓</span>}
        </div>
      </div>
    </div>
  )
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
  )
}

/** Error display with retry option */
function ErrorBanner({ message, onRetry, onDismiss }) {
  const { t } = useLanguage()
  return (
    <div className="error-banner">
      <span>⚠️ {message}</span>
      {onRetry && (
        <button onClick={onRetry}>{t('errorRetry')}</button>
      )}
    </div>
  )
}

export default function MessageList({ messages, isLoading, error, onClearError }) {
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="message-list">
      {/* Date separator */}
      <div className="date-separator">
        <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </div>

      {/* Welcome card or messages */}
      {messages.length === 0 ? (
        <WelcomeCard />
      ) : (
        messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
      )}

      {/* Loading indicator */}
      {isLoading && <TypingIndicator />}

      {/* Error */}
      {error && <ErrorBanner message={error} onDismiss={onClearError} />}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  )
}
