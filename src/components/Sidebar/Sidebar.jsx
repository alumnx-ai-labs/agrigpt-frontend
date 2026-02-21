import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './Sidebar.css'

/** Data for the fixed sidebar chat list */
const CHAT_LIST = [
  { id: 'farm-assistant', emoji: '🌾', bg: '#2d5a2d', name: 'Farm Assistant', sub: 'AI Crop Advisor', status: 'online' },
  { id: 'weather-bot',    emoji: '🌤️',  bg: '#1565c0', name: 'weatherBot',   sub: 'Today: Sunny 28°C',  status: 'online', badge: 2 },
  { id: 'market-prices',  emoji: '📊',  bg: '#4a148c', name: 'marketPrices', sub: 'Wheat ₹2,150/qtl', status: 'away' },
  { id: 'soil-lab',       emoji: '🧪',  bg: '#e65100', name: 'soilLab',      sub: 'Report ready!',     status: 'online', badge: 1 },
  { id: 'kisan-helpline', emoji: '📞',  bg: '#880e4f', name: 'kisanHelpline',sub: 'available',         status: 'online' },
]

export default function Sidebar({ activeId, onSelect, isOpen, onClose }) {
  const { t } = useLanguage()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">🌾</div>
          <span className="sidebar-title">{t('appName')}</span>
          <div className="sidebar-icons">
            <button className="sidebar-icon-btn" title="Search">
              <SearchIcon />
            </button>
            <button className="sidebar-icon-btn" title="Menu">
              <DotsIcon />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <div className="search-input-wrap">
            <SearchIcon size={14} />
            <input type="text" placeholder={t('searchChat')} />
          </div>
        </div>

        {/* Chat list */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Chats</div>
          {CHAT_LIST.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${activeId === chat.id ? 'active' : ''}`}
              onClick={() => { onSelect(chat.id); onClose(); }}
            >
              <div className="chat-avatar" style={{ background: chat.bg }}>
                {chat.emoji}
                <span className={`chat-avatar-status ${chat.status === 'online' ? 'status-online' : 'status-away'}`} />
              </div>
              <div className="chat-item-info">
                <div className="chat-item-name">{t(chat.name) || chat.name}</div>
                <div className="chat-item-sub">{t(chat.sub) || chat.sub}</div>
              </div>
              {chat.badge && (
                <div className="chat-item-meta">
                  <span className="badge">{chat.badge}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-avatar">🧑‍🌾</div>
          <div className="sidebar-footer-info">
            <div className="sidebar-footer-name">{t('myFarm')}</div>
            <div className="sidebar-footer-sub">{t('khariSeason')}</div>
          </div>
          <SettingsIcon className="sidebar-footer-gear" />
        </div>
      </aside>
    </>
  )
}

/* ─── Inline SVG icons ─── */
function SearchIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  )
}
function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
    </svg>
  )
}
function SettingsIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}
