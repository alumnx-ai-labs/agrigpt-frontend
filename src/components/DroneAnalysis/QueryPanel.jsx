/**
 * QueryPanel.jsx
 *
 * Multi-turn query interface with scrollable conversation history.
 *
 * Features:
 *  - Multiple questions on the same frame + markers
 *  - Each answer displayed with structured formatting (area / plants / recommendations)
 *  - Auto-scroll to latest answer
 *  - Annotated image shown inline, togglable
 *  - Clear conversation button
 *  - Voice input with speech service integration (multilingual support)
 */

import React, { useState, useRef, useEffect } from "react";
import { queryFrame, speechToText } from "../../services/droneApi";
import { useLanguage } from "../../context/LanguageContext";

export default function QueryPanel({ frame, markers }) {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]); // [{id, question, answer, annotatedImg, loading, error}]
  const [isAsking, setIsAsking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { lang } = useLanguage();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const canAsk =
    frame &&
    markers.length >= 3 &&
    (typeof question === "string"
      ? question.trim()
      : question?.english || question?.native) &&
    !isAsking;

  /* Auto-scroll to latest entry */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  /* Reset conversation when frame changes */
  useEffect(() => {
    setConversation([]);
    setQuestion("");
  }, [frame?.frame_id]);

  const hint = !frame
    ? "Select a captured frame first"
    : markers.length < 3
      ? `Place ${3 - markers.length} more marker${3 - markers.length !== 1 ? "s" : ""} to define the region`
      : null;

  /**
   * Toggle voice recording using MediaRecorder API
   * Records audio and sends to speech service for transcription + translation
   */
  const toggleListening = async () => {
    // Stop recording if already listening
    if (isListening && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      return;
    }

    // Check for MediaRecorder support
    if (!window.MediaRecorder) {
      alert("Voice recording is not supported in this browser.");
      return;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine supported MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/ogg")
          ? "audio/ogg"
          : "audio/wav";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());

        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        // Send to speech service
        try {
          const result = await speechToText(audioBlob, lang);

          // Use english_text for processing, native_text for display
          const nativeText = result.native_text || result.transcript || "";
          const englishText = result.english_text || result.transcript || "";

          // Display native text in input, but we'll send english to backend
          setQuestion(
            englishText && englishText !== nativeText
              ? { native: nativeText, english: englishText }
              : nativeText,
          );
        } catch (err) {
          console.error("Speech-to-text error:", err);
          alert("Failed to transcribe audio. Please try again.");
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Microphone access denied. Please enable microphone permissions.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canAsk) return;

    // Handle question - might be string or object with native/english versions
    let q =
      typeof question === "string"
        ? question.trim()
        : question.english || question.native;
    const nativeQ = typeof question === "object" ? question.native : q;
    const displayQ = nativeQ || q;

    const id = Date.now();
    setQuestion("");
    setIsAsking(true);

    /* Add a loading entry immediately */
    setConversation((prev) => [
      ...prev,
      {
        id,
        question: displayQ,
        answer: null,
        annotatedImg: null,
        loading: true,
        error: null,
      },
    ]);

    try {
      const points = markers.map((m) => [m.x, m.y]);
      // Send English question to backend, along with language
      const result = await queryFrame(frame.frame_id, points, q, lang);
      setConversation((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                answer: result.answer ?? null,
                annotatedImg: result.annotated_b64 ?? null,
                loading: false,
              }
            : entry,
        ),
      );
    } catch (err) {
      setConversation((prev) =>
        prev.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                loading: false,
                error: "Query failed: " + err.message,
              }
            : entry,
        ),
      );
    } finally {
      setIsAsking(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="query-panel">
      {/* ── Input bar ─────────────────────────────────────────── */}
      <form className="query-panel__form" onSubmit={handleSubmit}>
        <button
          type="button"
          className={`query-panel__mic-btn${isListening ? " query-panel__mic-btn--listening" : ""}`}
          onClick={toggleListening}
          title={isListening ? "Stop listening" : "Speak your question"}
          disabled={isAsking || !frame || markers.length < 3}
        >
          <MicIcon />
        </button>
        <input
          ref={inputRef}
          className="query-panel__input"
          type="text"
          placeholder={
            isListening
              ? "Listening…"
              : hint
                ? hint
                : "Ask anything — area, plant count, fertilizer, manure…"
          }
          value={
            typeof question === "string" ? question : question?.native || ""
          }
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isAsking || !frame || markers.length < 3}
        />
        <button className="query-panel__btn" type="submit" disabled={!canAsk}>
          {isAsking ? <Spinner /> : "Ask"}
        </button>
        {conversation.length > 0 && (
          <button
            type="button"
            className="query-panel__clear-btn"
            onClick={() => setConversation([])}
            title="Clear conversation"
          >
            Clear
          </button>
        )}
      </form>

      {/* ── Hint when not ready ───────────────────────────────── */}
      {hint && conversation.length === 0 && (
        <p className="query-panel__hint">{hint}</p>
      )}

      {/* ── Language indicator for non-English ────────────────── */}
      {lang !== "en" && (
        <p className="query-panel__lang-hint">
          🌐 Voice input in {lang === "hi" ? "Hindi" : "Telugu"} will be
          translated automatically
        </p>
      )}

      {/* ── Conversation ─────────────────────────────────────── */}
      {conversation.length > 0 && (
        <div className="query-conversation">
          {conversation.map((entry) => (
            <ConversationEntry key={entry.id} entry={entry} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

/* ── Single Q + A entry ──────────────────────────────────────── */
function ConversationEntry({ entry }) {
  const [imgExpanded, setImgExpanded] = useState(false);

  return (
    <div className="conv-entry">
      {/* Question bubble */}
      <div className="conv-entry__question">
        <span className="conv-entry__q-icon">Q</span>
        <span className="conv-entry__q-text">{entry.question}</span>
      </div>

      {/* Answer */}
      {entry.loading && (
        <div className="conv-entry__answer conv-entry__answer--loading">
          <Spinner />
          <span>Analysing…</span>
        </div>
      )}

      {entry.error && (
        <div className="conv-entry__answer conv-entry__answer--error">
          {entry.error}
        </div>
      )}

      {entry.answer && (
        <div className="conv-entry__answer">
          <StructuredAnswer text={entry.answer} />

          {entry.annotatedImg && (
            <div className="conv-entry__img-wrap">
              <button
                className="conv-entry__img-toggle"
                onClick={() => setImgExpanded((v) => !v)}
              >
                {imgExpanded
                  ? "Hide annotated image ▲"
                  : "Show annotated image ▼"}
              </button>
              {imgExpanded && (
                <img
                  className="conv-entry__img"
                  src={`data:image/jpeg;base64,${entry.annotatedImg}`}
                  alt="Annotated frame"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Parse answer string into structured sections ──────────── */
function StructuredAnswer({ text }) {
  if (!text) return null;

  /* Try to detect structured key:value lines */
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  /* Group lines into sections by detecting section headers */
  const sections = [];
  let currentSection = null;

  const SECTION_PATTERNS = [
    { re: /area|region|size|sq/i, icon: "📐", label: "Area" },
    { re: /plant|tree|crop|mango|count/i, icon: "🌱", label: "Plant Count" },
    { re: /fertilizer|urea|dap|npk/i, icon: "🧪", label: "Fertilizer" },
    { re: /manure|compost|organic/i, icon: "🪣", label: "Manure" },
    { re: /gsd|altitude|camera|sensor/i, icon: "📡", label: "Telemetry" },
  ];

  for (const line of lines) {
    const match = SECTION_PATTERNS.find((p) => p.re.test(line));
    if (match && !currentSection) {
      currentSection = { ...match, lines: [line] };
    } else if (currentSection) {
      currentSection.lines.push(line);
      if (line === "" || lines.indexOf(line) === lines.length - 1) {
        sections.push(currentSection);
        currentSection = null;
      }
    } else {
      sections.push({ icon: "ℹ️", label: null, lines: [line] });
    }
  }
  if (currentSection) sections.push(currentSection);

  /* If no structure detected, just render as plain text */
  if (sections.length === 0) {
    return <p className="answer-plain">{text}</p>;
  }

  /* Render as cards */
  return (
    <div className="answer-cards">
      {sections.map((sec, i) => (
        <div key={i} className="answer-card">
          {sec.label && (
            <div className="answer-card__header">
              <span className="answer-card__icon">{sec.icon}</span>
              <span className="answer-card__label">{sec.label}</span>
            </div>
          )}
          <div className="answer-card__body">
            {sec.lines.map((l, j) => (
              <AnswerLine key={j} text={l} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Bold the value in "Key: value" lines */
function AnswerLine({ text }) {
  const colonIdx = text.indexOf(":");
  if (colonIdx > 0 && colonIdx < 40) {
    const key = text.slice(0, colonIdx + 1);
    const val = text.slice(colonIdx + 1);
    return (
      <p className="answer-line">
        <span className="answer-line__key">{key}</span>
        <span className="answer-line__val">{val}</span>
      </p>
    );
  }
  return <p className="answer-line">{text}</p>;
}

function Spinner() {
  return <span className="qp-spinner" />;
}

function MicIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}
