import React, { useState } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useLanguage } from '../../context/LanguageContext'
import './ChatWindow.css'

export default function ChatWindow({ onMenuClick, userName, chat }) {
  const { messages, isLoading, error, sendText, sendImage, clearError, topK, setTopK, phoneNumber, setPhoneNumber, query, setQuery, startNewChat } = chat

  return (
    <div className="chat-window">
      <ChatHeader
        onMenuClick={onMenuClick}
        topK={topK}
        onTopKChange={setTopK}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={setPhoneNumber}
        onNewChat={startNewChat}
      />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        error={error}
        onClearError={clearError}
        userName={userName}
      />
      <MessageInput
        onSendText={sendText}
        onSendImage={sendImage}
        isLoading={isLoading}
        query={query}
        onQueryChange={setQuery}
      />
    </div>
  )
}
