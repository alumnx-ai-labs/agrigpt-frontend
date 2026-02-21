import { useState, useCallback } from 'react'
import { sendTextQuery, sendImageQuery } from '../services/api'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [topK, setTopK] = useState(5)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [query, setQuery] = useState('')

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
      const response = await sendTextQuery(phoneNumber, query)
      // Response is now an object with type and content
      appendMessage('assistant', response.content, null, response.type)
      setQuery('')
    } catch (err) {
      setError(err.message || 'Failed to get response')
    } finally {
      setIsLoading(false)
    }
  }, [phoneNumber, query, appendMessage])

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
      const response = await sendImageQuery(file, phoneNumber, query, topK)
      // Response is now an object with type and content
      appendMessage('assistant', response.content, null, response.type)
      setQuery('')
    } catch (err) {
      setError(err.message || 'Failed to analyze image')
    } finally {
      setIsLoading(false)
    }
  }, [topK, phoneNumber, query, appendMessage])

  const clearError = useCallback(() => setError(null), [])
  return { messages, isLoading, error, sendText, sendImage, clearError, topK, setTopK, phoneNumber, setPhoneNumber, query, setQuery }
}
