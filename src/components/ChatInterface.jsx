import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { askRamayana } from '../lib/gemini'
import { logQuery } from '../lib/firebase'

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  
  const hasStarted = messages.length > 0

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages, isTyping])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setError(null)

    try {
      // Log the query to Firestore for model improvement (Async)
      logQuery(input);
      
      // Send the last 10 messages for context
      const history = messages.slice(-10)
      const responseText = await askRamayana(input, history)
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
        <h1 className="hero-title">All About Ramayana</h1>
        <p className="hero-subtitle">
          Ask anything about the eternal epic of Lord Rama. 
          Derived from the original Valmiki Ramayana.
        </p>
      </section>

      {/* Message List (Scrollable Area) */}
      <div className="message-list">
        {!hasStarted && (
          <div style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.5, fontSize: '0.9rem' }}>
            Try asking: "Who is Lord Rama?" or "Ram ne Ravan ko kyun mara?"
          </div>
        )}
        
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {/* Inject an ad unit in the flow every 4 messages for monetization */}
            {index > 0 && index % 4 === 0 && (
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
      <form onSubmit={handleSend} className="input-area">
        <div className="chat-input-pill">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Ask anything (Hindi, English, Hinglish)..."
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

      {!hasStarted && (
        <div style={{ position: 'absolute', bottom: '1rem', width: '100%', textAlign: 'center', fontSize: '0.8rem', opacity: 0.4 }}>
          "Speak, and the wisdom of the ancients shall be revealed."
        </div>
      )}
    </div>
  )
}

export default ChatInterface
