import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './Sidebar.css'

export default function Sidebar({ activeId, onSelect, isOpen, onClose, chatHistory = [], onNewChat, onDeleteChat, onLogout, userName, onSettingsClick }) {
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
          <div className="sidebar-section-label">Older Chats</div>

          <button
            className="sidebar-new-chat-btn"
            onClick={() => { if (onNewChat) onNewChat(); onClose(); }}
          >
            <NewChatIcon /> New Chat
          </button>

          <div className="chat-history-list">
            {chatHistory.length === 0 ? (
              <div className="no-chats-msg">No older chats</div>
            ) : (
              chatHistory.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item ${activeId === chat.id ? 'active' : ''}`}
                  onClick={() => { onSelect(chat.id); onClose(); }}
                >
                  <div className="chat-avatar" style={{ background: '#2d5a2d' }}>
                    💬
                  </div>
                  <div className="chat-item-info">
                    <div className="chat-item-name">{chat.title}</div>
                    <div className="chat-item-sub">{new Date(chat.timestamp).toLocaleDateString()}</div>
                  </div>
                  <button
                    className="sidebar-icon-btn chat-delete-btn"
                    title="Delete Chat"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteChat) onDeleteChat(chat.id);
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sidebar-footer" onClick={() => { if (onSettingsClick) onSettingsClick(); onClose(); }}>
          <div className="sidebar-footer-avatar">🧑‍🌾</div>
          <div className="sidebar-footer-info">
            <div className="sidebar-footer-name">{userName || t('myFarm')}</div>
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
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  )
}
function SettingsIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
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

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  )
}
