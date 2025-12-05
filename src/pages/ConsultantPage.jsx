import React, { useState, useRef, useEffect } from 'react';
import './ConsultantPage.css';

const ConsultantPage = () => {
  const [selectedOption, setSelectedOption] = useState('Government Schemes');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const options = ['Government Schemes', 'Citrus Crop'];

  // Backend URL - Using your Render deployment
  const BACKEND_URL = 'https://agrigpt-backend-rag.onrender.com';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSubmit = async () => {
    if (!query.trim()) {
      alert('Please enter a query');
      return;
    }

    // Add user message to chat
    const userMessage = {
      type: 'user',
      message: query,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMessage]);

    setIsLoading(true);
    const currentQuery = query;
    setQuery(''); // Clear input immediately
    
    try {
      // Determine endpoint based on selected option
      const endpoint = selectedOption === 'Citrus Crop' 
        ? '/ask-consultant' 
        : '/query-government-schemes';
      
      console.log('Sending request to:', `${BACKEND_URL}${endpoint}`);
      
      // Format chat history for API (only include previous messages, not the current one)
      const formattedHistory = chatHistory
        .filter(msg => msg.type === 'user' || msg.type === 'assistant')
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.message
        }));

      console.log('Request payload:', {
        query: currentQuery,
        chat_history: formattedHistory
      });

      const result = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentQuery,
          chat_history: formattedHistory
        }),
      });

      console.log('Response status:', result.status);

      if (!result.ok) {
        const errorText = await result.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${result.status} - ${errorText}`);
      }

      const data = await result.json();
      console.log('Response data:', data);
      
      // Add AI response to chat
      const aiMessage = {
        type: 'assistant',
        message: data.response || 'No response received',
        sources: data.sources || [],
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Full error:', error);
      const errorMessage = {
        type: 'error',
        message: `Error: ${error.message}. Please check the console for details.`,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setQuery('');
  };

  return (
    <div className="consultant-container">
      <div className="consultant-card">
        <h1 className="consultant-title">
          AgriGPT SME AI Consultant
        </h1>

        <div className="topic-selector-container">
          <div className="topic-selector-wrapper">
            <label className="topic-label">
              Select Topic
            </label>
            <select
              className="topic-select"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              disabled={isLoading}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="chat-container">
          

          <div className="chat-messages">
            {chatHistory.length === 0 ? (
              <div className="empty-chat">
                <div className="empty-chat-icon">💬</div>
                <p className="empty-chat-title">
                  Ask me anything about {selectedOption}
                </p>
                <p className="empty-chat-subtitle">
                  Start a conversation by typing your question below
                </p>
              </div>
            ) : (
              <>
                {chatHistory.map((msg, index) => (
                  <div key={index} className="message-wrapper">
                    {msg.type === 'user' && (
                      <div className="user-message-container">
                        <div className="user-message">
                          {msg.message}
                        </div>
                      </div>
                    )}
                    
                    {msg.type === 'assistant' && (
                      <div className="assistant-message-container">
                        <div className="assistant-message">
                          {msg.message}
                        </div>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="sources-container">
                            <div className="sources-title">
                              📚 Sources:
                            </div>
                            <div className="sources-list">
                              {msg.sources.map((source, idx) => (
                                <span key={idx} className="source-tag">
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {msg.type === 'error' && (
                      <div className="error-message">
                        ⚠️ {msg.message}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </>
            )}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                className="message-input"
                placeholder="Ask your question... (Press Enter to send, Shift+Enter for new line)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                rows={2}
              />
              <button
                className="send-button"
                onClick={handleSubmit}
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantPage;