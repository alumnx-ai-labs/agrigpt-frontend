import { useEffect, useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import MessageBubble from '../MessageBubble/MessageBubble'
import MessageInput from '../MessageInput/MessageInput'
import Header from '../Header/Header'
import Spinner from '../Spinner/Spinner'
import { useChat } from '../../hooks/useChat'
import './ChatWindow.css'

/**
 * ChatWindow – full chat interface: header + message list + input bar
 * @param {function} onMobileBack - callback to show sidebar on mobile
 */
export default function ChatWindow({ onMobileBack }) {
  const { t } = useLanguage()
  const { messages, isLoading, error, sendText, sendImage, clearError } = useChat()
  const bottomRef = useRef(null)

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="chat-window">
      {/* ── Header ── */}
      <Header onMobileBack={onMobileBack} />

      {/* ── Message feed ── */}
      <div className="chat-window__feed">
        {/* Date separator */}
        <div className="date-divider">
          <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Welcome card (shown when no messages) */}
        {messages.length === 0 && (
          <div className="welcome-card">
            <h2 className="welcome-card__title">{t.welcomeTitle}</h2>
            <p className="welcome-card__body">{t.welcomeBody}</p>
            <ul className="welcome-card__list">
              <li>{t.feature1}</li>
              <li>{t.feature2}</li>
              <li>{t.feature3}</li>
            </ul>
            <p className="welcome-card__cta">{t.welcomeCta}</p>
          </div>
        )}

        {/* Messages */}
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Loading indicator */}
        {isLoading && <Spinner label={t.loading} />}

        {/* Error toast */}
        {error && (
          <div className="error-toast" role="alert">
            <span className="error-toast__icon">⚠️</span>
            <span className="error-toast__msg">{error}</span>
            <button className="error-toast__close" onClick={clearError}>✕</button>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <MessageInput
        onSendText={sendText}
        onSendImage={sendImage}
        disabled={isLoading}
      />
    </div>
  )
}
