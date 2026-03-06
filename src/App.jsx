import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import ChatWindow from "./components/Chat/ChatWindow";
import Login from "./components/Login/Login";
import SettingsModal from "./components/Preferences/SettingsModal";
import DroneAnalysis from "./components/DroneAnalysis/DroneAnalysis";
import "./styles/App.css";

import { useChat } from "./hooks/useChat";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activePage, setActivePage] = useState("chat"); // 'chat' | 'drone'
  const [phoneNumber, setPhoneNumber] = useState(
    () => localStorage.getItem("agrigpt_phone") || "",
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("agrigpt_username") || "",
  );

  // Pass phoneNumber to useChat
  const chatProps = useChat(phoneNumber);
  const {
    chatHistory,
    loadChat,
    startNewChat,
    deleteChat,
    messages,
    activeChatId,
  } = chatProps;

  const handleSelectChat = (id) => {
    loadChat(id);
  };

  const handleLogin = (phone) => {
    localStorage.setItem("agrigpt_phone", phone);
    setPhoneNumber(phone);
  };

  const handleLogout = () => {
    localStorage.removeItem("agrigpt_phone");
    setPhoneNumber("");
    setSettingsOpen(false);
  };

  const handleSaveName = (name) => {
    localStorage.setItem("agrigpt_username", name);
    setUserName(name);
  };

  if (!phoneNumber) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      {activePage !== "drone" && (
        <Sidebar
          activeId={activeChatId}
          onSelect={handleSelectChat}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          chatHistory={chatHistory}
          onNewChat={startNewChat}
          onDeleteChat={deleteChat}
          onLogout={handleLogout}
          userName={userName}
          onSettingsClick={() => setSettingsOpen(true)}
        />
      )}

      <div className="app-main-wrapper">
        <div className="page-tabs">
          <button
            className={`page-tab${activePage === "chat" ? " page-tab--active" : ""}`}
            onClick={() => setActivePage("chat")}
          >
            Chat
          </button>
          <button
            className={`page-tab${activePage === "drone" ? " page-tab--active" : ""}`}
            onClick={() => setActivePage("drone")}
          >
            Drone Analysis
          </button>
        </div>

        {activePage === "chat" ? (
          <ChatWindow
            onMenuClick={() => setSidebarOpen(true)}
            userName={userName}
            chat={chatProps}
          />
        ) : (
          <DroneAnalysis />
        )}
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveName}
        initialName={userName}
        onLogout={handleLogout}
      />
    </div>
  );
}
