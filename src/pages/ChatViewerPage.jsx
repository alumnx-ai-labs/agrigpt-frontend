import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, User, Sparkles, Camera, X, Plus, Download } from 'lucide-react';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.alumnx.com/api/agrigpt';

const ChatViewerPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Chat Data
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [pageTitle, setPageTitle] = useState('Conversation');
  const [chatCategory, setChatCategory] = useState(null); 
  
  // Image Upload State
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- 1. Fetch Chat & Detect Category ---
  useEffect(() => {
    const fetchChat = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      try {
        const response = await fetch(`${BACKEND_URL}/chats?email=${user.email}`);
        if (response.ok) {
          const allChats = await response.json();
          const foundChat = allChats.find(c => c.chatId === chatId);
          
          if (foundChat) {
            setMessages(foundChat.messages || []);
            
            if (foundChat.messages?.length > 0) {
              const firstMsg = foundChat.messages[0].message;
              setPageTitle(firstMsg); // Store full title here
              
              // Detect Context
              const allContent = foundChat.messages.map(m => m.message).join(' ').toLowerCase();
              if (allContent.includes('scheme') || allContent.includes('subsidy') || allContent.includes('fund') || allContent.includes('kisan')) {
                setChatCategory('schemes');
              } else {
                setChatCategory('citrus');
              }
            }
          }
        }
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchChat();
  }, [chatId]);

  // --- 2. Handle Image Selection ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --- 3. Handle Reply ---
  const handleReply = async () => {
    if (!query.trim() && !selectedImage) return; 
    const user = auth.currentUser;
    
    // UI Optimistic Update
    const userMsg = { 
      messageSource: 'user', 
      message: query, 
      image: imagePreview, 
      timestamp: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setImagePreview(null);
    setSelectedImage(null);
    setIsSending(true);

    try {
      await fetch(`${BACKEND_URL}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, messageSource: 'user', message: userMsg.message, chatId: chatId })
      });

      let endpoint = '/ask-consultant';
      if (selectedImage) endpoint = '/ask-with-image';
      else if (chatCategory === 'schemes') endpoint = '/query-government-schemes';

      const payload = selectedImage ? { query: userMsg.message, image: userMsg.image } : { query: userMsg.message };

      const aiResponse = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const aiData = await aiResponse.json();
      const aiText = aiData.answer || aiData.response || "Processing...";

      await fetch(`${BACKEND_URL}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, messageSource: 'system', message: aiText, chatId: chatId })
      });

      setMessages(prev => [...prev, { messageSource: 'system', message: aiText, timestamp: new Date().toISOString() }]);

    } catch (error) {
      alert("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  // Download Chat
  const handleDownloadChat = () => {
    if (messages.length === 0) return;
    const chatText = messages.map(msg => `[${msg.messageSource === 'user' ? 'User' : 'AgriGPT'}]: ${msg.message}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgriGPT-Chat.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleNewChat = () => {
    const forcedContext = chatCategory === 'schemes' ? 'Government Schemes' : 'Citrus Crop';
    navigate('/consultant', { state: { forcedContext } });
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isSending]);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} width={260} activeContext={chatCategory} />
      
      <main className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        
        {/* --- HEADER --- */}
        <header className="px-4 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
          
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0" title="Back">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Centered Title with Tooltip */}
          <div className="flex-1 mx-4 text-center min-w-0">
            {/* 🔥 TIP: The 'title' attribute shows the full text on hover! */}
            <h1 
              className="text-xl font-bold text-gray-800 truncate leading-tight cursor-default"
              title={pageTitle} 
            >
              {pageTitle}
            </h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button onClick={handleDownloadChat} className="p-2 text-gray-400 hover:text-green-600 rounded-full transition-all" title="Download">
              <Download className="w-5 h-5" />
            </button>
            <button onClick={handleNewChat} className="p-2 bg-black text-white hover:bg-gray-800 rounded-full shadow-sm transition-all active:scale-95 flex-shrink-0" title="Start New Chat">
              <Plus className="w-5 h-5" />
            </button>
          </div>

        </header>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 md:px-20 py-6 bg-gray-50/30">
          {isLoading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div> : (
            <div className="max-w-3xl mx-auto space-y-6 pb-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.messageSource === 'user' ? 'justify-end' : 'justify-start gap-3'}`}>
                  {msg.messageSource === 'system' && <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200"><Sparkles className="w-4 h-4 text-green-600" /></div>}
                  
                  <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.messageSource === 'user' ? 'bg-white border border-gray-200 text-gray-800 rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                    {msg.image && <img src={msg.image} alt="User Upload" className="max-h-48 rounded-lg mb-2 object-cover border border-gray-100" />}
                    <p className="whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  
                  {msg.messageSource === 'user' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-4 h-4 text-gray-500" /></div>}
                </div>
              ))}
              {isSending && <div className="text-center text-xs text-gray-400 animate-pulse">AgriGPT is typing...</div>}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-50 shrink-0">
          <div className="max-w-3xl mx-auto relative">
            
            {imagePreview && (
              <div className="absolute -top-16 left-0 bg-white p-2 rounded-lg shadow border flex items-center gap-2">
                <img src={imagePreview} className="w-10 h-10 rounded object-cover" alt="Preview" />
                <button onClick={() => {setImagePreview(null); setSelectedImage(null);}}><X className="w-4 h-4"/></button>
              </div>
            )}

            <div className="flex-1 bg-white border-2 border-green-500 rounded-3xl flex items-center px-2 transition-all shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-green-200/50">
                
                {chatCategory === 'citrus' && (
                  <>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <button onClick={() => fileInputRef.current.click()} className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors" title="Add Photo">
                      <Camera className="w-5 h-5"/>
                    </button>
                  </>
                )}

                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleReply()} placeholder={chatCategory === 'schemes' ? "Ask follow-up..." : "Ask or upload photo..."} className="flex-1 bg-transparent border-none focus:ring-0 py-3.5 px-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none" />
                
                <button onClick={handleReply} disabled={isSending || (!query.trim() && !selectedImage)} className={`p-2 rounded-full transition-all duration-200 m-1 ${query.trim() || selectedImage ? 'bg-green-600 text-white shadow-md hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  <Send className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatViewerPage;