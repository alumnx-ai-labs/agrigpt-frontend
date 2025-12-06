import React, { useState, useRef, useEffect } from 'react';

const ConsultantPage = () => {
  const [selectedOption, setSelectedOption] = useState('Government Schemes');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const options = ['Government Schemes', 'Citrus Crop'];

  // Backend URL - Using your Render deployment
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://0.0.0.0:8000';

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
    <div className="page-container flex items-center justify-center p-6">
      <div className="content-card w-full max-w-4xl flex flex-col" style={{ height: 'calc(100vh - 3rem)', maxHeight: '900px' }}>
        {/* Header */}
        <div className="p-6 border-b border-[rgba(55,53,47,0.09)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="empty-state-icon" style={{ width: '2.5rem', height: '2.5rem', marginBottom: 0 }}>
              🌾
            </div>
            <div>
              <h1 className="text-xl font-semibold text-notion-default tracking-tight">AgriGPT</h1>
              <p className="text-sm text-notion-secondary">AI Agricultural Consultant</p>
            </div>
          </div>

          {/* Topic Selector */}
          <div className="max-w-xs">
            <label className="block text-xs font-medium text-notion-secondary mb-1.5 uppercase tracking-wide">
              Select Topic
            </label>
            <select
              className="select-notion"
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

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-notion-bg-gray">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="empty-state-icon">💬</div>
              <h3 className="text-lg font-semibold text-notion-default mb-1">
                Ask me anything about {selectedOption}
              </h3>
              <p className="text-notion-secondary text-sm max-w-sm">
                Start a conversation by typing your question below
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((msg, index) => (
                <div key={index}>
                  {msg.type === 'user' && (
                    <div className="flex justify-end">
                      <div className="message-user">
                        <p className="text-sm text-notion-default whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  )}

                  {msg.type === 'assistant' && (
                    <div className="message-assistant">
                      <p className="text-sm text-notion-default whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-notion-tertiary">📎 Sources:</span>
                          {msg.sources.map((source, idx) => (
                            <span key={idx} className="source-tag">{source}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {msg.type === 'error' && (
                    <div className="message-error">
                      <p className="text-sm">⚠️ {msg.message}</p>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-notion-secondary">
                  <div className="spinner-notion"></div>
                  <span className="text-sm">Thinking...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[rgba(55,53,47,0.09)] bg-white">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                className="input-notion resize-none py-2.5"
                placeholder="Ask your question... (Press Enter to send)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                rows={2}
                style={{ minHeight: '44px' }}
              />
            </div>
            <button
              className="btn-notion btn-notion-primary h-10 px-5"
              onClick={handleSubmit}
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <span className="spinner-notion border-white border-t-transparent" style={{ width: '16px', height: '16px' }}></span>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantPage;