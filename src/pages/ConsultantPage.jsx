import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Camera, X, Sparkles, ChevronDown, Menu, Loader2, PanelLeftOpen } from 'lucide-react';
import { auth } from '../services/firebase'; 
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.alumnx.com/api/agrigpt';

const ConsultantPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Layout State
  const [sidebarWidth, setSidebarWidth] = useState(260); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Chat State
  const [isContextOpen, setIsContextOpen] = useState(false);
  const [selectedContext, setSelectedContext] = useState('Citrus Crop'); // Default
  const [currentChatId, setCurrentChatId] = useState(null); 
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-Clear Image on Context Change
  useEffect(() => {
    setSelectedImage(null);
    setImagePreview(null);
  }, [selectedContext]);

  // Mouse Drag Logic
  const startResizing = useCallback((e) => { e.preventDefault(); setIsResizing(true); }, []);
  const stopResizing = useCallback(() => { setIsResizing(false); }, []);
  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth < 150) { setIsSidebarOpen(false); setIsResizing(false); }
      else if (newWidth > 450) { setSidebarWidth(450); }
      else { setSidebarWidth(newWidth); if (!isSidebarOpen) setIsSidebarOpen(true); }
    }
  }, [isResizing, isSidebarOpen]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 🔥 LOAD CHAT & FORCE CONTEXT ---
  useEffect(() => {
    // If coming from RecentChats via "New Chat", force the context
    if (location.state?.forcedContext) {
      setSelectedContext(location.state.forcedContext);
      setMessages([]);
      setCurrentChatId(null);
    } 
    // If loading an existing chat history
    else if (location.state?.existingChat) {
      const chat = location.state.existingChat;
      setMessages(chat.messages || []);
      setCurrentChatId(chat.chatId);
      
      // Auto-detect context
      if (chat.messages?.length > 0) {
        const first = chat.messages[0].message.toLowerCase();
        if (first.includes('scheme') || first.includes('subsidy') || first.includes('fund')) {
          setSelectedContext('Government Schemes');
        } else {
          setSelectedContext('Citrus Crop');
        }
      }
    } else {
      // Default Fresh Start
      setMessages([]);
      setCurrentChatId(null);
    }
  }, [location.state]);

  // --- 🔥 SUBMIT LOGIC: CORRECT ENDPOINTS ---
  const handleSubmit = async (textOverride = null) => {
    const textToSend = textOverride || query;
    if (!textToSend.trim() && !selectedImage) return;
    if (!user?.email) return alert("Please log in.");

    const tempUserMsg = { messageSource: 'user', message: textToSend, image: imagePreview, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, tempUserMsg]);
    setQuery('');
    setImagePreview(null);
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // 1. Save User Msg
      const saveUserRes = await fetch(`${BACKEND_URL}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, messageSource: 'user', message: textToSend, chatId: currentChatId })
      });
      if (!saveUserRes.ok) throw new Error("Save failed");
      const saveData = await saveUserRes.json();
      const activeChatId = saveData.chatId || currentChatId;
      if (!currentChatId) setCurrentChatId(activeChatId);

      // 2. Select Endpoint
      let endpoint = '/ask-consultant'; // Default
      
      // 🔥 Logic: Schemes vs Citrus vs Image
      if (selectedContext === 'Government Schemes') {
        endpoint = '/query-government-schemes';
      }
      else if (selectedImage) {
        endpoint = '/ask-with-image'; 
      }

      console.log("Using Endpoint:", endpoint); // Debugging

      const payload = selectedImage ? { query: textToSend, image: imagePreview } : { query: textToSend };
      const aiRes = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!aiRes.ok) throw new Error("AI Service failed");
      const aiData = await aiRes.json();
      const aiAnswer = aiData.answer || aiData.response || "Message processed.";

      // 3. Save AI Msg
      await fetch(`${BACKEND_URL}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, messageSource: 'system', message: aiAnswer, chatId: activeChatId })
      });

      setMessages(prev => [...prev, { messageSource: 'system', message: aiAnswer, timestamp: new Date().toISOString() }]);

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const startNewChat = () => {
    setMessages([]); setQuery(''); setCurrentChatId(null); 
    // Keeps current selectedContext but clears chat
  };

  const suggestions = selectedContext === 'Citrus Crop' 
    ? ["Identify this yellowing leaf disease", "Best fertilizer for lemon trees?", "How to treat citrus canker?"] 
    : ["Am I eligible for PM Kisan?", "Subsidies for drip irrigation?", "How to apply for crop insurance?"];

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const activeContext = selectedContext === 'Government Schemes' ? 'schemes' : 'citrus';

  return (
    <div className="flex h-screen bg-white overflow-hidden select-none">
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        width={sidebarWidth} 
        isMobile={isMobile}
        isMobileMenuOpen={isMobileMenuOpen}
        closeMobileMenu={() => setIsMobileMenuOpen(false)}
        activeContext={activeContext}
      />

      {!isMobile && isSidebarOpen && (
        <div className={`w-1 hover:w-1.5 cursor-col-resize z-30 transition-all flex items-center justify-center group ${isResizing ? 'bg-green-500 w-1.5' : 'bg-transparent hover:bg-gray-200'}`} onMouseDown={startResizing}>
          <div className={`h-8 w-1 rounded-full ${isResizing ? 'bg-white' : 'bg-gray-300 opacity-0 group-hover:opacity-100'}`} />
        </div>
      )}

      <main className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        
        <header className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && !isMobile && <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-500"><PanelLeftOpen className="w-5 h-5" /></button>}
            {isMobile && <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-600"><Menu className="w-6 h-6" /></button>}
            <div className="relative">
              <button onClick={() => setIsContextOpen(!isContextOpen)} className="flex items-center gap-2 font-semibold text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-transparent focus:border-green-200 text-sm md:text-base">
                {selectedContext} <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isContextOpen ? 'rotate-180' : ''}`} />
              </button>
              {isContextOpen && (
                <>
                  <div className="fixed inset-0 z-10 cursor-default" onClick={() => setIsContextOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                    <button onClick={() => { setSelectedContext('Government Schemes'); startNewChat(); setIsContextOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm flex items-center gap-3 ${selectedContext === 'Government Schemes' ? 'bg-green-50 text-green-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>🏛️ Government Schemes</button>
                    <button onClick={() => { setSelectedContext('Citrus Crop'); startNewChat(); setIsContextOpen(false); }} className={`w-full text-left px-4 py-3 rounded-lg text-sm flex items-center gap-3 ${selectedContext === 'Citrus Crop' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>🍋 Citrus Crop Protection</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto pb-10">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${selectedContext === 'Citrus Crop' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                 <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{selectedContext === 'Citrus Crop' ? 'Citrus Expert' : 'Scheme Advisor'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-8">
                {suggestions.map((text, idx) => (
                  <button key={idx} onClick={() => handleSubmit(text)} className="text-sm text-left p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50/30 transition-all text-gray-600">{text}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className="animate-in fade-in slide-in-from-bottom-2">
                  <div className={`flex ${msg.messageSource === 'user' ? 'justify-end' : 'gap-4'}`}>
                    {msg.messageSource === 'system' && <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-lg hidden sm:flex">🤖</div>}
                    <div className={`${msg.messageSource === 'user' ? 'bg-gray-100 max-w-[90%]' : 'flex-1'} px-4 py-3 sm:px-5 sm:py-3 rounded-2xl ${msg.messageSource === 'user' ? 'rounded-tr-sm' : ''}`}>
                      {msg.image && <img src={msg.image} className="max-h-64 rounded-lg mb-3 object-cover shadow-sm border border-gray-200" alt="User upload" />}
                      <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-center text-gray-400 text-sm animate-pulse flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> AI is thinking...</div>}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-white/90 backdrop-blur border-t border-gray-50 shrink-0">
          <div className="max-w-3xl mx-auto relative">
            {imagePreview && (
              <div className="absolute -top-16 left-0 bg-white p-2 rounded-lg shadow border flex items-center gap-2">
                <img src={imagePreview} className="w-10 h-10 rounded object-cover" alt="Preview" />
                <button onClick={() => {setImagePreview(null); setSelectedImage(null);}}><X className="w-4 h-4"/></button>
              </div>
            )}
            
            <div className="bg-white border-2 border-green-500 rounded-3xl flex items-end p-2 transition-all shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-green-200/50">
               {selectedContext === 'Citrus Crop' && (
                 <>
                   <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                   <button onClick={() => fileInputRef.current.click()} className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"><Camera className="w-5 h-5"/></button>
                 </>
               )}
               <textarea name="chatQuery" id="chatInput" value={query} onChange={e => setQuery(e.target.value)} onKeyPress={handleKeyPress} placeholder={`Message AgriGPT (${selectedContext})...`} className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2.5 px-3 text-sm text-gray-800 placeholder:text-gray-400" rows={1} />
               <button onClick={() => handleSubmit()} disabled={isLoading || (!query.trim() && !selectedImage)} className={`p-2.5 rounded-full transition-all duration-200 ${query.trim() || selectedImage ? 'bg-green-600 text-white shadow-md hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}><Send className="w-4 h-4" /></button>
            </div>
            
            <p className="text-center text-[10px] text-gray-300 mt-2 hidden sm:block">AI can make mistakes. Verify important info.</p>
          </div>
        </div>

      </main>
      
      {expandedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setExpandedImage(null)}>
          <img src={expandedImage} className="max-h-[90vh] rounded-lg" alt="Full" />
        </div>
      )}
    </div>
  );
};

export default ConsultantPage;