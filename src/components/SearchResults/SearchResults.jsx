import SearchResultCard from '../SearchResultCard/SearchResultCard'
import './SearchResults.css'

/**
 * SearchResults - Container for displaying multiple search result cards
 */
export default function SearchResults({ results }) {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return null
  }

  return (
    <div className="search-results">
      <div className="search-results__header">
        <span className="search-results__icon">🔍</span>
        <span className="search-results__title">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="search-results__list">
        {results.map((result, index) => (
          <SearchResultCard 
            key={result.image_id || index} 
            result={result} 
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
