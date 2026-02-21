import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './ChatList.css'

/* ─── Static sidebar contacts ──────────────────────────────────────────── */
const CONTACTS = [
  {
    id: 'farm-assistant',
    icon: '🌾',
    iconBg: '#2d6a4f',
    nameKey: 'farmAssistant',
    subtitleKey: 'tagline',
    badge: null,
    isActive: true,
  },
  {
    id: 'weather-bot',
    icon: '🌤',
    iconBg: '#e09f3e',
    nameKey: 'weatherBot',
    subtitleKey: 'weatherStatus',
    badge: 2,
    isActive: false,
  },
  {
    id: 'market-prices',
    icon: '📊',
    iconBg: '#4a90a4',
    nameKey: 'marketPrices',
    subtitleKey: 'wheatPrice',
    badge: null,
    isActive: false,
  },
  {
    id: 'soil-lab',
    icon: '🧪',
    iconBg: '#7b5e3a',
    nameKey: 'soilLab',
    subtitleKey: 'soilReport',
    badge: 1,
    isActive: false,
  },
  {
    id: 'kisan-helpline',
    icon: '📞',
    iconBg: '#d62828',
    nameKey: 'kisanHelpline',
    subtitleKey: 'helpline247',
    badge: null,
    isActive: false,
  },
]

const LANG_LABELS = { en: 'EN', hi: 'हिं', te: 'తె' }

export default function ChatList({ activeId, onSelect }) {
  const { t, lang, setLang, availableLangs } = useLanguage()
  const [search, setSearch] = useState('')

  const filtered = CONTACTS.filter(c =>
    t[c.nameKey]?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside className="chat-list">
      {/* ── Top bar ── */}
      <div className="chat-list__topbar">
        <div className="chat-list__brand">
          <span className="chat-list__brand-icon">🌱</span>
          <span className="chat-list__brand-name">{t.appName}</span>
        </div>

        {/* Language switcher */}
        <div className="lang-switcher">
          {availableLangs.map(l => (
            <button
              key={l}
              className={`lang-btn ${lang === l ? 'lang-btn--active' : ''}`}
              onClick={() => setLang(l)}
              title={l.toUpperCase()}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="chat-list__search">
        <span className="chat-list__search-icon">🔍</span>
        <input
          className="chat-list__search-input"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Contact list ── */}
      <div className="chat-list__section-label">CHATS</div>
      <ul className="chat-list__contacts" role="list">
        {filtered.map(contact => (
          <li
            key={contact.id}
            className={`contact-item ${activeId === contact.id ? 'contact-item--active' : ''}`}
            onClick={() => onSelect(contact.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onSelect(contact.id)}
          >
            <div
              className="contact-item__avatar"
              style={{ background: contact.iconBg }}
            >
              {contact.icon}
            </div>
            <div className="contact-item__info">
              <span className="contact-item__name">{t[contact.nameKey]}</span>
              <span className="contact-item__sub">{t[contact.subtitleKey]}</span>
            </div>
            {contact.badge && (
              <span className="contact-item__badge">{contact.badge}</span>
            )}
          </li>
        ))}
      </ul>

      {/* ── Footer profile ── */}
      <div className="chat-list__footer">
        <div className="chat-list__profile">
          <div className="chat-list__profile-avatar">👨‍🌾</div>
          <div className="chat-list__profile-info">
            <span className="chat-list__profile-name">{t.myFarm}</span>
            <span className="chat-list__profile-sub">{t.kharifSeason}</span>
          </div>
          <button className="chat-list__settings" title="Settings">⚙️</button>
        </div>
      </div>
    </aside>
  )
}
