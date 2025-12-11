import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Sprout, 
  Landmark, 
  LogOut, 
  User, 
  PanelLeftClose, 
  PanelLeftOpen 
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const Sidebar = ({ 
  isOpen = true, 
  toggleSidebar, 
  width, 
  isMobile, 
  isMobileMenuOpen, 
  closeMobileMenu,
  activeContext 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (e) {
      console.warn('Sign out error', e);
    }
  };

  const isActive = (pathKey) => {
    if (activeContext === pathKey) return true;
    return location.pathname.toLowerCase().includes(pathKey.toLowerCase());
  };

  const getSidebarWidth = () => {
    if (isMobile) return undefined;
    if (!isOpen) return '80px';
    return width ? `${width}px` : '260px';
  };

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 bg-[#F9FAFB] shadow-xl transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
    : `relative bg-[#F9FAFB] border-r border-gray-200 h-screen flex flex-col flex-shrink-0 font-sans transition-none ease-linear z-20 overflow-hidden`;

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={closeMobileMenu}></div>
      )}

      <aside className={sidebarClasses} style={{ width: getSidebarWidth() }}>
        
        {/* 🔥 FIX IS HERE: Only force min-width if OPEN. If closed, let it shrink to 80px. */}
        <div className={`w-full h-full flex flex-col ${isOpen ? 'min-w-[240px]' : 'w-full'}`}>
          
          {/* Top Section */}
          <div className="p-4 flex flex-col gap-4">
            <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} mb-2`}>
              {isOpen && (
                <div className="flex items-center gap-2 animate-in fade-in duration-200">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-lg">🌾</div>
                  <span className="font-bold text-gray-700 tracking-tight">AgriGPT</span>
                </div>
              )}
              
              <button 
                onClick={toggleSidebar}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                title={isOpen ? "Close Sidebar" : "Open Sidebar"}
              >
                {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
              </button>
            </div>

            <button 
              onClick={() => { navigate('/consultant'); if (isMobile) closeMobileMenu(); }}
              className={`flex items-center justify-center gap-2 rounded-xl shadow-sm transition-all duration-200 group active:scale-95 ${isOpen ? 'px-4 py-3 w-full' : 'p-3 w-10 h-10 mx-auto'} ${location.pathname === '/consultant' ? 'bg-black text-white ring-2 ring-gray-300' : 'bg-black text-white hover:bg-gray-800'}`}
              title="New Chat"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isOpen && <span className="text-sm font-medium whitespace-nowrap">New Chat</span>}
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-hide">
            {isOpen && <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 animate-in fade-in">Recent Chats</h3>}

            <div className="space-y-1">
              {/* Govt Schemes */}
              <button
                onClick={() => { navigate('/recents/schemes'); if (isMobile) closeMobileMenu(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 group ${
                  isActive('schemes') 
                    ? 'bg-green-100 text-green-800 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${!isOpen && 'justify-center'}`}
                title="Govt Schemes"
              >
                <Landmark className={`w-5 h-5 flex-shrink-0 ${isActive('schemes') ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {isOpen && <span className="truncate">Govt Schemes</span>}
              </button>

              {/* Citrus Protection */}
              <button
                onClick={() => { navigate('/recents/citrus'); if (isMobile) closeMobileMenu(); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 group ${
                  isActive('citrus') 
                    ? 'bg-orange-100 text-orange-800 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${!isOpen && 'justify-center'}`}
                title="Citrus Protection"
              >
                <Sprout className={`w-5 h-5 flex-shrink-0 ${isActive('citrus') ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                {isOpen && <span className="truncate">Citrus Protection</span>}
              </button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 bg-[#F9FAFB]">
            <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center flex-col gap-4'}`}>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 cursor-default">
                  {user?.email ? user.email[0].toUpperCase() : <User className="w-4 h-4" />}
                </div>
                {isOpen && (
                  <div className="flex-col flex overflow-hidden animate-in fade-in">
                    <span className="text-xs font-semibold text-gray-700 truncate w-24">{user?.displayName || 'Farmer'}</span>
                    <span className="text-[10px] text-gray-400 truncate w-24">{user?.email}</span>
                  </div>
                )}
              </div>
              <button onClick={handleSignOut} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all" title="Sign Out">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;