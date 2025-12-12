import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageSquare, Calendar, ChevronRight, Search, Loader2, Plus, Trash2 } from 'lucide-react';
import { auth } from '../services/firebase';
import Sidebar from '../components/Sidebar';

// ✅ REAL BACKEND CONNECTION
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.alumnx.com/api/agrigpt';

const RecentChats = () => {
  const { category } = useParams(); // 'citrus' or 'schemes'
  const navigate = useNavigate();
  
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAllChats();
  }, [category]);

  const loadAllChats = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (!user) { setIsLoading(false); return; }

    // 1. Get Local Storage (Backup)
    let localChats = [];
    try {
      const stored = localStorage.getItem('agrigpt_chats');
      if (stored) localChats = JSON.parse(stored).filter(c => c.userId === user.uid);
    } catch (e) { console.warn("Local storage parse error", e); }

    // 2. Get Backend Chats
    let apiChats = [];
    try {
      const response = await fetch(`${BACKEND_URL}/chats?email=${user.email}`);
      if (response.ok) {
        const rawData = await response.json();
        
        apiChats = rawData.map(chat => {
          const firstMsg = chat.messages?.[0]?.message || "New Conversation";
          
          // 🔥 Smart Context Detection
          const allContent = chat.messages ? chat.messages.map(m => m.message).join(' ').toLowerCase() : "";
          const isScheme = 
            allContent.includes('scheme') || 
            allContent.includes('subsidy') || 
            allContent.includes('fund') || 
            allContent.includes('loan') || 
            allContent.includes('kisan') ||
            allContent.includes('eligibility');

          const guessedType = isScheme ? 'schemes' : 'citrus';

          return {
            id: chat.chatId,
            chatId: chat.chatId,
            userId: user.uid,
            title: firstMsg.slice(0, 60) + (firstMsg.length > 60 ? "..." : ""),
            type: guessedType, 
            messages: chat.messages,
            updatedAt: new Date().toISOString()
          };
        });
      }
    } catch (error) { console.warn("Backend fetch failed:", error); }

    // 3. Merge & Filter
    const allChats = [...localChats, ...apiChats];
    const uniqueMap = new Map();
    allChats.forEach(c => uniqueMap.set(c.chatId || c.id, c));
    
    // Filter deleted (Local Blacklist)
    const deletedIds = JSON.parse(localStorage.getItem('agrigpt_deleted_ids') || '[]');
    const visibleChats = Array.from(uniqueMap.values()).filter(c => !deletedIds.includes(c.chatId));

    const filtered = visibleChats
      .filter(c => category === 'citrus' ? c.type === 'citrus' : c.type === 'schemes')
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    setChats(filtered);
    setIsLoading(false);
  };

  const handleChatClick = (chat) => {
    navigate(`/chat/${chat.chatId}`);
  };

  // 🔥 UPDATED: Force the context when starting a new chat from this page
  const startNewChat = () => {
    const forcedContext = category === 'citrus' ? 'Citrus Crop' : 'Government Schemes';
    navigate('/consultant', { state: { forcedContext } });
  };

  const handleDelete = (e, chatId) => {
    e.stopPropagation(); 
    if (!window.confirm("Delete this chat?")) return;
    setChats(prev => prev.filter(c => c.chatId !== chatId));
    const deletedIds = JSON.parse(localStorage.getItem('agrigpt_deleted_ids') || '[]');
    if (!deletedIds.includes(chatId)) {
      deletedIds.push(chatId);
      localStorage.setItem('agrigpt_deleted_ids', JSON.stringify(deletedIds));
    }
  };

  const filteredChats = chats.filter(chat => (chat.title || "").toLowerCase().includes(searchTerm.toLowerCase()));

  const sidebarContext = category === 'citrus' ? 'citrus' : 'schemes';

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} width={260} activeContext={sidebarContext} />
      
      <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
                {category === 'citrus' ? '🍋 Citrus Crop' : '🏛️ Government Schemes'} History
              </h1>
            </div>
            <div className="flex items-center gap-3">
                <span className="bg-white border border-gray-200 text-gray-600 text-xs px-3 py-2 rounded-lg font-medium shadow-sm">{chats.length} Total</span>
                <button onClick={startNewChat} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md active:scale-95"><Plus className="w-4 h-4" /> New Chat</button>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search..." className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-green-500/20 outline-none transition-all shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20 text-gray-400"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No history found.</p>
              <button onClick={startNewChat} className="text-white bg-green-600 px-6 py-2 rounded-lg">Start New</button>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredChats.map((chat, idx) => (
                <div key={idx} onClick={() => handleChatClick(chat)} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-md cursor-pointer transition-all group flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-start gap-4 overflow-hidden">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${category === 'citrus' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}><MessageSquare className="w-5 h-5" /></div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 group-hover:text-green-700 truncate pr-4 text-sm md:text-base">{chat.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={(e) => handleDelete(e, chat.chatId)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-500 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecentChats;