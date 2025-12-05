// import React, { useState, useRef, useEffect } from 'react';
// import { FiSend } from 'react-icons/fi';
// import MessageBubble from './MessageBubble';
// import Button from './Button';
// import './ChatInterface.css';

// const ChatInterface = ({ messages, onSendMessage, isLoading }) => {
//     const [input, setInput] = useState('');
//     const messagesEndRef = useRef(null);
//     const inputRef = useRef(null);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (input.trim() && !isLoading) {
//             onSendMessage(input);
//             setInput('');
//             inputRef.current?.focus();
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             handleSubmit(e);
//         }
//     };

//     return (
//         <div className="chat-interface">
//             <div className="chat-header">
//                 <h1 className="chat-title">RAG Chatbot</h1>
//                 <p className="chat-subtitle">
//                     Ask questions about your uploaded documents
//                 </p>
//             </div>

//             <div className="chat-messages">
//                 {messages.length === 0 ? (
//                     <div className="empty-state">
//                         <div className="empty-icon">💬</div>
//                         <h3 className="empty-title">Start a conversation</h3>
//                         <p className="empty-text">
//                             Upload a PDF document in the sidebar, then ask questions about its content
//                         </p>
//                     </div>
//                 ) : (
//                     <>
//                         {messages.map((msg, index) => (
//                             <MessageBubble
//                                 key={index}
//                                 message={msg.content}
//                                 role={msg.role}
//                                 sources={msg.sources}
//                             />
//                         ))}
//                         {isLoading && (
//                             <div className="loading-indicator">
//                                 <div className="typing-dots">
//                                     <span></span>
//                                     <span></span>
//                                     <span></span>
//                                 </div>
//                                 <span className="loading-text">Thinking...</span>
//                             </div>
//                         )}
//                         <div ref={messagesEndRef} />
//                     </>
//                 )}
//             </div>

//             <div className="chat-input-container">
//                 <form onSubmit={handleSubmit} className="chat-input-form">
//                     <textarea
//                         ref={inputRef}
//                         className="chat-input"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Ask a question about your documents..."
//                         rows={1}
//                         disabled={isLoading}
//                     />
//                     <Button
//                         type="submit"
//                         variant="primary"
//                         icon={<FiSend />}
//                         disabled={!input.trim() || isLoading}
//                         size="medium"
//                     >
//                         Send
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ChatInterface;


import React, { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';
import MessageBubble from './MessageBubble';
import Button from './Button';
import './ChatInterface.css';

const ChatInterface = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleTopicChange = (e) => {
        setSelectedTopic(e.target.value);
        console.log('Selected topic:', e.target.value);
    };

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <div className="header-content">
                    <div>
                        <h1 className="chat-title">AGRIGPT SME AI CONSULTANT</h1>
                        <p className="chat-subtitle">
                            Ask questions about your uploaded documents
                        </p>
                    </div>
                    <div className="topic-selector">
                        <label htmlFor="topic-select" className="topic-label">
                            Select an Option:
                        </label>
                        <select
                            id="topic-select"
                            value={selectedTopic}
                            onChange={handleTopicChange}
                            className="topic-dropdown"
                        >
                            <option value="citrus crop">Citrus Crop</option>
                            <option value="government schemes">Government Schemes</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">💬</div>
                        <h3 className="empty-title">Start a conversation</h3>
                        <p className="empty-text">
                            Upload a PDF document in the sidebar, then ask questions about its content
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <MessageBubble
                                key={index}
                                message={msg.content}
                                role={msg.role}
                                sources={msg.sources}
                            />
                        ))}
                        {isLoading && (
                            <div className="loading-indicator">
                                <div className="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <span className="loading-text">Thinking...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <div className="chat-input-container">
                <form onSubmit={handleSubmit} className="chat-input-form">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question about your documents..."
                        rows={1}
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        icon={<FiSend />}
                        disabled={!input.trim() || isLoading}
                        size="medium"
                    >
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;