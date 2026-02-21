import React, { useState } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Sidebar from './components/Sidebar/Sidebar'
import ChatWindow from './components/Chat/ChatWindow'
import './styles/App.css'

export default function App() {
  const [activeChat, setActiveChat] = useState('farm-assistant')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <LanguageProvider>
      <div className="app-layout">
        <Sidebar
          activeId={activeChat}
          onSelect={setActiveChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ChatWindow onMenuClick={() => setSidebarOpen(true)} />
      </div>
    </LanguageProvider>
  )
}
