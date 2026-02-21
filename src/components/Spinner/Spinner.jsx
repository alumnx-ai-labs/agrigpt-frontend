import './Spinner.css'

/**
 * Spinner – animated typing indicator shown while AI is responding
 */
export default function Spinner({ label = 'Analyzing...' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner-bubble">
        <div className="spinner-avatar">🌾</div>
        <div className="spinner-content">
          <div className="typing-dots">
            <span /><span /><span />
          </div>
          <span className="spinner-label">{label}</span>
        </div>
      </div>
    </div>
  )
}
