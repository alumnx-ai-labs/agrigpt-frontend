import { useState } from 'react'
import './SearchResultCard.css'

/**
 * SearchResultCard - Displays a single image search result in a clean card format
 */
export default function SearchResultCard({ result, index }) {
  const [showFullText, setShowFullText] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Extract fields from result
  const {
    image_id,
    image_url,
    similarity_score,
    page_number,
    surrounding_text,
    description,
  } = result

  // Format similarity score as percentage
  const scorePercent = similarity_score 
    ? (similarity_score * 100).toFixed(2) 
    : null

  // Determine if we should show the image
  const hasValidImage = image_url && 
    !image_url.includes('/images/None') && 
    !image_url.includes('null') &&
    !imageError

  // Get text content (surrounding_text or description)
  const textContent = surrounding_text || description || ''
  const shouldTruncate = textContent.length > 200
  const displayText = shouldTruncate && !showFullText
    ? textContent.substring(0, 200) + '...'
    : textContent

  return (
    <div className="search-result-card">
      {/* Card Header */}
      <div className="search-result-card__header">
        <span className="search-result-card__index">#{index + 1}</span>
        {scorePercent && (
          <div className="search-result-card__score">
            <span className="search-result-card__score-label">Match</span>
            <span className="search-result-card__score-value">{scorePercent}%</span>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {hasValidImage && (
        <div className="search-result-card__image-wrapper">
          <img
            src={image_url}
            alt={`Result ${index + 1}`}
            className="search-result-card__image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}

      {/* Metadata */}
      <div className="search-result-card__metadata">
        {image_id && (
          <div className="search-result-card__meta-item">
            <span className="search-result-card__meta-label">📄 ID:</span>
            <span className="search-result-card__meta-value">{image_id}</span>
          </div>
        )}
        {page_number && (
          <div className="search-result-card__meta-item">
            <span className="search-result-card__meta-label">📖 Page:</span>
            <span className="search-result-card__meta-value">{page_number}</span>
          </div>
        )}
      </div>

      {/* Description/Text Content */}
      {textContent && (
        <div className="search-result-card__description">
          <p className="search-result-card__text">{displayText}</p>
          {shouldTruncate && (
            <button
              className="search-result-card__toggle"
              onClick={() => setShowFullText(!showFullText)}
            >
              {showFullText ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
