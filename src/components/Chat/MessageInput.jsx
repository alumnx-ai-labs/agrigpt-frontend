import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './MessageInput.css'

export default function MessageInput({ onSendText, onSendImage, isLoading, query, onQueryChange }) {
  const { t } = useLanguage()
  const [pendingImage, setPendingImage] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  /** Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
    }
  }, [query])

  /** Handle send */
  const handleSend = useCallback(() => {
    const img = capturedImage || pendingImage
    if (img) {
      onSendImage(img.file)
      setPendingImage(null)
      setCapturedImage(null)
    } else if (query.trim()) {
      onSendText()
    }
    textareaRef.current?.focus()
  }, [capturedImage, pendingImage, query, onSendImage, onSendText])

  /** Send on Enter (not Shift+Enter) */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  /** File upload handler */
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPendingImage({ file, url: URL.createObjectURL(file) })
    e.target.value = ''
  }

  /** Open camera */
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream
      setShowCamera(true)
      // Wait for video element to mount
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      }, 100)
    } catch {
      alert('Camera access denied or unavailable.')
    }
  }

  /** Close camera and stop stream */
  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setShowCamera(false)
  }

  /** Capture frame from video */
  const captureFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
      setCapturedImage({ file, url: URL.createObjectURL(file) })
      closeCamera()
    }, 'image/jpeg', 0.9)
  }

  /** Use captured photo */
  const useCaptured = () => {
    // already stored in capturedImage – just send
    handleSend()
  }

  /** Retake */
  const retakeCaptured = () => {
    setCapturedImage(null)
    openCamera()
  }

  const activeImage = capturedImage || pendingImage
  const canSend = !isLoading && (query.trim() || activeImage)

  return (
    <div className="input-area">
      {/* Image preview */}
      {activeImage && !capturedImage && (
        <div className="image-preview-bar">
          <img className="image-preview-thumb" src={activeImage.url} alt="preview" />
          <span className="image-preview-name">{activeImage.file.name}</span>
          <button className="image-preview-remove" onClick={() => setPendingImage(null)} title="Remove">
            <CloseIcon />
          </button>
        </div>
      )}

      {/* Captured image actions */}
      {capturedImage && (
        <>
          <div className="image-preview-bar">
            <img className="image-preview-thumb" src={capturedImage.url} alt="captured" />
            <span className="image-preview-name">📷 Photo captured</span>
          </div>
          <div className="capture-bar">
            <button className="capture-btn retake" onClick={retakeCaptured}>📷 {t('retake')}</button>
            <button className="capture-btn use" onClick={() => { onSendImage(capturedImage.file); setCapturedImage(null) }}>
              ✓ {t('usePhoto')}
            </button>
          </div>
        </>
      )}

      {/* Main input row */}
      {!capturedImage && (
        <div className="input-row">
          {/* Camera button */}
          <button className="input-icon-btn" title={t('capturePhoto')} onClick={openCamera}>
            <CameraIcon />
          </button>

          {/* Query textarea */}
          <div className="input-box">
            <textarea
              ref={textareaRef}
              rows={1}
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('typeQuery')}
              disabled={isLoading}
            />
          </div>

          {/* File upload */}
          <button className="input-icon-btn" title={t('uploadPhoto')} onClick={() => fileInputRef.current?.click()}>
            <AttachIcon />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="file-input-hidden"
            onChange={handleFileChange}
          />

          {/* Send */}
          <button className="send-btn" onClick={handleSend} disabled={!canSend} title={t('send')}>
            <SendIcon />
          </button>
        </div>
      )}

      {/* Camera modal */}
      {showCamera && (
        <div className="camera-modal-overlay">
          <div className="camera-modal">
            <video ref={videoRef} autoPlay playsInline />
            <canvas ref={canvasRef} />
            <div className="camera-controls">
              <button className="camera-close-btn" onClick={closeCamera}><CloseIcon /></button>
              <button className="camera-capture-btn" onClick={captureFrame}>
                <div className="camera-capture-inner" />
              </button>
              <div style={{ width: 42 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Icons ─── */
function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}
function AttachIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  )
}
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
