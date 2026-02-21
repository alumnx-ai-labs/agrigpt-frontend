import { useLanguage } from '../../context/LanguageContext'
import './Header.css'

/**
 * Header – top bar of the chat window showing contact info and API indicator
 */
export default function Header({ onMobileBack }) {
  const { t } = useLanguage()

  return (
    <header className="chat-header">
      {/* Mobile back button */}
      <button className="chat-header__back" onClick={onMobileBack} aria-label="Back">
        ←
      </button>

      {/* Contact info */}
      <div className="chat-header__contact">
        <div className="chat-header__avatar">🌾</div>
        <div className="chat-header__info">
          <span className="chat-header__name">{t.farmAssistant}</span>
          <span className="chat-header__status">
            <span className="chat-header__dot" />
            {t.online}
          </span>
        </div>
      </div>

      {/* API badge */}
      <div className="chat-header__api">
        <div className="chat-header__api-badge">
          <span className="chat-header__api-icon">⚡</span>
          <span className="chat-header__api-label">{t.backendApi}:</span>
          <span className="chat-header__api-mode">{t.textAnalysis}</span>
        </div>
        <a
          href="https://newapi.alumnx.com/agrigpt/fastapi/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="chat-header__docs-link"
        >
          Docs ↗
        </a>
      </div>

      {/* Actions */}
      <div className="chat-header__actions">
        <button className="chat-header__action-btn" title="Video call">📹</button>
        <button className="chat-header__action-btn" title="Voice call">📞</button>
        <button className="chat-header__action-btn" title="More options">⋮</button>
      </div>
    </header>
  )
}
