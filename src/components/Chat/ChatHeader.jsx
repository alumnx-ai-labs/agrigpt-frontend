import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './ChatHeader.css'

export default function ChatHeader({ onMenuClick, topK, onTopKChange }) {
  const { t, lang, setLang, languages } = useLanguage()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef])

  const handleTopKChange = (e) => {
    const value = parseInt(e.target.value) || 5
    onTopKChange(value)
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
        <div className="chat-header-actions" ref={menuRef}>
          <button className="chat-header-btn" title="More" onClick={() => setShowMenu(!showMenu)}>
            <DotsVerticalIcon />
          </button>

          {showMenu && (
            <div className="header-dropdown-menu">
              <div className="dropdown-item">
                <label>Top K:</label>
                <input
                  type="number"
                  value={topK}
                  onChange={handleTopKChange}
                  min="1"
                  max="5"
                  className="dropdown-input topk-input"
                />
              </div>
            </div>
          )}
        </div>
      </header>
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
function NewChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <line x1="9" y1="10" x2="15" y2="10"></line>
      <line x1="12" y1="7" x2="12" y2="13"></line>
    </svg>
  )
}
