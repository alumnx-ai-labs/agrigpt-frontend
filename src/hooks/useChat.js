import { useState, useCallback } from 'react'
import { sendTextQuery, sendImageQuery } from '../services/api'
import { useLanguage } from '../context/LanguageContext'

export function useChat(globalPhoneNumber = '') {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [topK, setTopK] = useState(5)
  const phoneNumber = globalPhoneNumber;
  const [query, setQuery] = useState('')
  const [chatId, setChatId] = useState(() => crypto.randomUUID())
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('agrigpt_chat_history')
    return saved ? JSON.parse(saved) : []
  })
  const { lang } = useLanguage()

  // Save current chat before starting a new one
  const startNewChat = useCallback(() => {
    if (messages.length > 0) {
      setChatHistory(prev => {
        const title = messages.find(m => m.role === 'user')?.content || 'New Chat'
        const newHistory = [{ id: chatId, title: title.substring(0, 30), messages, timestamp: Date.now() }, ...prev.filter(c => c.id !== chatId)]
        localStorage.setItem('agrigpt_chat_history', JSON.stringify(newHistory))
        return newHistory
      })
    }
    setMessages([])
    setChatId(crypto.randomUUID())
    setQuery('')
    setError(null)
  }, [messages, chatId])

  const loadChat = useCallback((id) => {
    const chat = chatHistory.find(c => c.id === id)
    if (chat) {
      setMessages(chat.messages)
      setChatId(chat.id)
      setQuery('')
      setError(null)
    }
  }, [chatHistory])

  const deleteChat = useCallback((id) => {
    setChatHistory(prev => {
      const newHistory = prev.filter(c => c.id !== id)
      localStorage.setItem('agrigpt_chat_history', JSON.stringify(newHistory))
      return newHistory
    })

    // If the currently open chat is deleted, clear the screen
    if (chatId === id) {
      setMessages([])
      setChatId(crypto.randomUUID())
      setQuery('')
      setError(null)
    }
  }, [chatId])

  const appendMessage = useCallback((role, content, imageUrl = null, messageType = 'text') => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        role,
        content,
        imageUrl,
        messageType,
        timestamp: new Date()
      },
    ])
  }, [])

  const sendText = useCallback(async () => {
    if (!phoneNumber.trim()) {
      setError('Phone number is required')
      return
    }
    if (!query.trim()) {
      setError('Query is required')
      return
    }
    setError(null)
    appendMessage('user', query, null, 'text')
    setIsLoading(true)
    try {
      const response = await sendTextQuery(phoneNumber, query, chatId, lang)
      // Response is now an object with type and content
      appendMessage('assistant', response.content, null, response.type)
      setQuery('')
    } catch (err) {
      setError(err.message || 'Failed to get response')
    } finally {
      setIsLoading(false)
    }
  }, [phoneNumber, query, appendMessage, chatId, lang])

  const sendImage = useCallback(async (file) => {
    if (!phoneNumber.trim()) {
      setError('Phone number is required')
      return
    }
    if (!query.trim()) {
      setError('Query is required')
      return
    }
    setError(null)
    const imageUrl = URL.createObjectURL(file)
    appendMessage('user', query, imageUrl, 'text')
    setIsLoading(true)
    try {
      const response = await sendImageQuery(file, phoneNumber, query, topK, chatId, lang)
      // Response is now an object with type and content
      appendMessage('assistant', response.content, null, response.type)
      setQuery('')
    } catch (err) {
      setError(err.message || 'Failed to analyze image')
    } finally {
      setIsLoading(false)
    }
  }, [topK, phoneNumber, query, appendMessage, chatId, lang])

  const clearError = useCallback(() => setError(null), [])
  return {
    messages, isLoading, error, sendText, sendImage, clearError,
    topK, setTopK, phoneNumber, query, setQuery,
    startNewChat, chatHistory, loadChat, deleteChat, activeChatId: chatId
  }
}
