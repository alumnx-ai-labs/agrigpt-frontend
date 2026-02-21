import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './ChatHeader.css'

export default function ChatHeader({ onMenuClick, topK, onTopKChange, phoneNumber, onPhoneNumberChange }) {
  const { t, lang, setLang, languages } = useLanguage()

  const handleTopKChange = (e) => {
    const value = parseInt(e.target.value) || 5
    onTopKChange(value)
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '')
    onPhoneNumberChange(value)
  }

  const LANG_LABELS = { en: 'EN', hi: 'हि', te: 'తె' }

  return (
    <>
      <header className="chat-header">
        {/* Mobile hamburger */}
        <button className="chat-header-menu-btn" onClick={onMenuClick} title="Menu">
          <HamburgerIcon />
        </button>

        {/* Avatar */}
        <div className="chat-header-avatar">
          🌾
          <span className="chat-header-online" />
        </div>

        {/* Info */}
        <div className="chat-header-info">
          <div className="chat-header-name">Farm Assistant</div>
          <div className="chat-header-status">{t('online')}</div>
        </div>

        {/* Language toggle */}
        <div className="lang-toggle">
          {languages.map(l => (
            <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
              {LANG_LABELS[l] || l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Action icons */}
        <div className="chat-header-actions">
          <button className="chat-header-btn" title="Video Call"><VideoIcon /></button>
          <button className="chat-header-btn" title="Call"><PhoneIcon /></button>
          <button className="chat-header-btn" title="More"><DotsVerticalIcon /></button>
        </div>
      </header>

      {/* API info bar (desktop only) */}
      <div className="api-bar">
        <span>📱 Phone:</span>
        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Phone number"
          className="phone-input"
          maxLength="15"
        />
        <span>🔢 Top K:</span>
        <input
          type="number"
          value={topK}
          onChange={handleTopKChange}
          min="1"
          max="20"
          className="topk-input" />
      </div>
    </>
  )
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}
function VideoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z" />
    </svg>
  )
}
function DotsVerticalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
    </svg>
  )
}
