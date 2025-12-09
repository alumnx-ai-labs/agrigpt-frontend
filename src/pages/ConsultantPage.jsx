import React, { useState, useRef, useEffect } from 'react';

const ConsultantPage = () => {
  const [selectedOption, setSelectedOption] = useState('Government Schemes');
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const options = ['Government Schemes', 'Citrus Crop'];

  // Backend URL - Using your Render deployment
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!query.trim() && !selectedImage) {
      alert('Please enter a query or upload an image');
      return;
    }

    // Add user message to chat
    const userMessage = {
      type: 'user',
      message: query || 'Analyze this crop image',
      image: imagePreview,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMessage]);

    setIsLoading(true);
    const currentQuery = query || 'What disease does this crop have and how can I treat it?';
    setQuery('');

    try {
      let data;

      // Check if this is an image query (text-to-image search)
      const isImageSearchQuery = selectedOption === 'Citrus Crop' &&
        /\b(show|images?|pictures?|photos?|display|see|send|give|return|get|find|similar)\b/i.test(currentQuery);

      // Check if user wants to find similar images (image-to-image search)
      const isSimilarImageQuery = selectedImage &&
        /\b(similar|like this|find|match|search|same|compare)\b/i.test(currentQuery);

      if (selectedOption === 'Citrus Crop' && selectedImage && isSimilarImageQuery) {
        // Image-to-image search: find similar images in database
        const formData = new FormData();
        formData.append('file', selectedImage);

        console.log('Sending image-to-image search to:', `${BACKEND_URL}/query-by-image`);

        const result = await fetch(`${BACKEND_URL}/query-by-image?top_k=5`, {
          method: 'POST',
          body: formData,
        });

        if (!result.ok) {
          const errorText = await result.text();
          throw new Error(`HTTP error! status: ${result.status} - ${errorText}`);
        }

        data = await result.json();
        clearImage();

        // Format response with similar images
        const imageResults = data.results || [];
        const aiMessage = {
          type: 'assistant',
          message: imageResults.length > 0
            ? `Found ${imageResults.length} similar images in the database:`
            : 'No similar images found in the database.',
          images: imageResults.map(img => ({
            url: img.image_url.startsWith('/') ? `${BACKEND_URL}${img.image_url}` : img.image_url,
            source: img.source,
            page: img.page,
            score: img.score
          })),
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, aiMessage]);

      } else if (selectedOption === 'Citrus Crop' && selectedImage) {
        // Use image endpoint when image is uploaded (multimodal Q&A)
        const formData = new FormData();
        formData.append('file', selectedImage);
        formData.append('query', currentQuery);

        console.log('Sending image request to:', `${BACKEND_URL}/ask-with-image`);

        const result = await fetch(`${BACKEND_URL}/ask-with-image`, {
          method: 'POST',
          body: formData,
        });

        if (!result.ok) {
          const errorText = await result.text();
          throw new Error(`HTTP error! status: ${result.status} - ${errorText}`);
        }

        data = await result.json();
        clearImage();

        // Format response for image query
        const aiMessage = {
          type: 'assistant',
          message: data.answer || 'No response received',
          sources: data.matched_sources || [],
          confidence: data.confidence,
          // Include related images if available
          images: (data.related_images || []).map(url => ({
            url: url.startsWith('/') ? `${BACKEND_URL}${url}` : url,
            source: 'Related Image',
            page: 0,
            score: data.confidence || 0
          })),
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, aiMessage]);

      } else if (isImageSearchQuery) {
        // Use HYBRID query endpoint for "show me image" queries (text-to-image)
        console.log('Sending HYBRID image query to:', `${BACKEND_URL}/hybrid-image-query`);

        const result = await fetch(`${BACKEND_URL}/hybrid-image-query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: currentQuery,
            top_k: 5
          }),
        });

        if (!result.ok) {
          const errorText = await result.text();
          throw new Error(`HTTP error! status: ${result.status} - ${errorText}`);
        }

        data = await result.json();

        // Format response with images
        const imageResults = data.results || [];
        const aiMessage = {
          type: 'assistant',
          message: imageResults.length > 0
            ? `Here are ${imageResults.length} images matching your query:`
            : 'No matching images found in the database.',
          images: imageResults.map(img => ({
            url: img.image_url.startsWith('/') ? `${BACKEND_URL}${img.image_url}` : img.image_url,
            source: img.source,
            page: img.page,
            score: img.score
          })),
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, aiMessage]);

      } else {
        // Use text endpoint
        const endpoint = selectedOption === 'Citrus Crop'
          ? '/ask-consultant'
          : '/query-government-schemes';

        console.log('Sending request to:', `${BACKEND_URL}${endpoint}`);

        const formattedHistory = chatHistory
          .filter(msg => msg.type === 'user' || msg.type === 'assistant')
          .map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.message
          }));

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

        if (!result.ok) {
          const errorText = await result.text();
          throw new Error(`HTTP error! status: ${result.status} - ${errorText}`);
        }

        data = await result.json();

        const aiMessage = {
          type: 'assistant',
          message: data.response || 'No response received',
          sources: data.sources || [],
          timestamp: new Date().toISOString()
        };
        setChatHistory(prev => [...prev, aiMessage]);
      }

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
    clearImage();
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
                        {msg.image && (
                          <img src={msg.image} alt="Uploaded crop" className="max-w-xs rounded mb-2" />
                        )}
                        <p className="text-sm text-notion-default whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  )}

                  {msg.type === 'assistant' && (
                    <div className="message-assistant">
                      <p className="text-sm text-notion-default whitespace-pre-wrap leading-relaxed">{msg.message}</p>

                      {/* Display images from CLIP query */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {msg.images.map((img, idx) => (
                            <div key={idx} className="border border-[rgba(55,53,47,0.09)] rounded-lg overflow-hidden">
                              <img
                                src={img.url}
                                alt={`Disease image from ${img.source}`}
                                className="w-full h-32 object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                              <div className="p-2 bg-notion-bg-gray">
                                <p className="text-xs text-notion-secondary truncate">{img.source}</p>
                                <p className="text-xs text-notion-tertiary">Page {img.page} • {(img.score * 100).toFixed(0)}% match</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

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
               {/* Input Area */}
       <div className="p-4 border-t border-[rgba(55,53,47,0.09)] bg-white">
  <div className="flex items-center gap-3">
    <textarea
      className="input-notion flex-1 resize-none py-3"
      placeholder="Ask your question... (Press Enter to send)"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyPress={handleKeyPress}
      disabled={isLoading}
      rows={2}
      style={{ minHeight: '44px' }}
    />

    <button
      className="btn-notion btn-notion-primary px-5 py-2.5 rounded-md"
      onClick={handleSubmit}
      disabled={isLoading || !query.trim()}
      style={{ height: '44px' }}   // <-- Matches textarea height
    >
      {isLoading ? (
        <span
          className="spinner-notion border-white border-t-transparent"
          style={{ width: '16px', height: '16px' }}
        ></span>
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