import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { askRamayana } from '../lib/gemini'
import { logQuery } from '../lib/firebase'
import PrivacyModal from './PrivacyModal'

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const [lastMessageTime, setLastMessageTime] = useState(0)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const messagesEndRef = useRef(null)
  
  const hasStarted = messages.length > 0

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages, isTyping])

  const sanitizeQuery = (rawInput) => {
    // 1. Trim and length limit (1000 characters to prevent resource exhaustion)
    let clean = rawInput.trim().slice(0, 1000);
    
    // 2. Critical: Strip any potential HTML tags to prevent XSS if rendered raw
    clean = clean.replace(/<[^>]*>?/gm, '');

    // 3. Prompt Injection Defense
    // Redact patterns that attempt to hijack the model's system instructions
    const injectionPatterns = [
      /ignore (all )?previous instructions/gi,
      /you are now (a|an)/gi,
      /system (prompt|instructions):/gi,
      /instead of your (usual|regular)/gi,
      /forget (everything|all)/gi,
      /new rule:/gi
    ];

    injectionPatterns.forEach(pattern => {
      clean = clean.replace(pattern, '[REDACTED]');
    });

    return clean;
  };

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    // Simple Rate Limiting: 5-second cooldown
    const now = Date.now()
    if (now - lastMessageTime < 5000) {
      setError("Divine wisdom requires patience. Please wait a few seconds before asking again.")
      return
    }

    // Sanitize input before processing
    const sanitizedInput = sanitizeQuery(input);
    if (!sanitizedInput) {
      setError("Please provide a valid query.")
      return
    }

    const userMessage = { id: Date.now(), text: sanitizedInput, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setError(null)
    setLastMessageTime(now)

    try {
      // Log the query to Firestore for model improvement (Async)
      logQuery(sanitizedInput);
      
      // Send the last 10 messages for context
      const history = messages.slice(-10)
      const responseText = await askRamayana(sanitizedInput, history)
      const aiResponse = { 
        id: Date.now() + 1, 
        text: responseText, 
        sender: 'ai'
      }
      setMessages(prev => [...prev, aiResponse])
    } catch (err) {
      console.error(err)
      setError(err.message || "The divine connection was interrupted.")
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I am having trouble connecting to the divine wisdom. Please ensure your API key is correctly set in the .env file.",
        sender: 'ai',
        isError: true
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="chat-window">
      {/* Hero Section (Landing State) */}
      <section className={`hero-premium ${hasStarted ? 'minified' : 'fade-in'}`}>
        <p className="hero-subtitle">

          Ask anything about the eternal epic of Lord Rama. 
          Derived from the original Valmiki Ramayana.
        </p>
      </section>

      {/* Message List (Scrollable Area) */}
      <div className="message-list">
        {!hasStarted && (
          <div className="empty-chat-placeholder" />
        )}

        
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {/* Inject an ad unit in the flow every 4 messages for monetization */}
            {index > 0 && index % 4 === 0 && window.adsbygoogle && (
              <div className="ad-placeholder" style={{ padding: '2rem', textAlign: 'center', opacity: 0.3, border: '1px dashed var(--secondary)', borderRadius: '12px', margin: '1rem 0' }}>
                <p style={{ fontSize: '0.7rem' }}>ADVERTISEMENT</p>
                <p style={{ fontWeight: '600' }}>Divine Wisdom Sponsored Content</p>
              </div>
            )}

            
            <div className={`message ${msg.sender} fade-in ${msg.isError ? 'error-message' : ''}`}>
              <div className="text-content">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </React.Fragment>
        ))}

        {isTyping && (
          <div className="message ai fade-in typing-indicator">
            <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input Area (ChatGPT Style Pill) */}
      <div className="chat-bottom-container">
        <form onSubmit={handleSend} className="input-area">
          <div className="chat-input-pill">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              autoFocus
            />
            <button 
              type="submit" 
              className="btn-divine" 
              disabled={isTyping || !input.trim()}
              title="Send Message"
            >
              {isTyping ? (
                <div className="typing-indicator" style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                  <span className="dot" style={{ width: '4px', height: '4px', margin: '0' }}>.</span>
                  <span className="dot" style={{ width: '4px', height: '4px', margin: '0' }}>.</span>
                </div>
              ) : (
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </div>
        </form>

        <p className="privacy-note">
          By chatting, you agree to help us refine the Divine Guide. Review our <button className="privacy-link" onClick={() => setShowPrivacy(true)}>Privacy & Data Conduct</button>.
        </p>
      </div>

      <PrivacyModal 
        isOpen={showPrivacy} 
        onClose={() => setShowPrivacy(false)} 
      />

      {!hasStarted && (
        <div className="empty-footer-placeholder" />
      )}

    </div>
  )
}

export default ChatInterface
