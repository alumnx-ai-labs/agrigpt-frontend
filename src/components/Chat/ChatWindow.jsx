import React, { useState } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { useChat } from '../../hooks/useChat'
import { useLanguage } from '../../context/LanguageContext'
import './ChatWindow.css'

export default function ChatWindow({ onMenuClick }) {
  const { messages, isLoading, error, sendText, sendImage, clearError, topK, setTopK, phoneNumber, setPhoneNumber, query, setQuery } = useChat()

  return (
    <div className="chat-window">
      <ChatHeader
        onMenuClick={onMenuClick}
        topK={topK}
        onTopKChange={setTopK}
        phoneNumber={phoneNumber}
        onPhoneNumberChange={setPhoneNumber}
      />
      <MessageList
        messages={messages}
        isLoading={isLoading}
        error={error}
        onClearError={clearError}
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
