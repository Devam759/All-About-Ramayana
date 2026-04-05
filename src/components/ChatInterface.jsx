import React, { useState, useRef, useEffect } from 'react'
import { askRamayana } from '../lib/gemini'

function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am your divine guide to the Valmiki Ramayana. How can I help you discover the epic of Lord Rama today?", sender: 'ai' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    const userMessage = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setError(null)

    try {
      const responseText = await askRamayana(input)
      
      // Basic extraction of source from AI response if it follows the citation rule
      // (Gemini is instructed to provide Kanda/Chapter)
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
    <div className="chat-window-container" style={{ maxWidth: '800px', margin: '1rem auto', padding: '0 1rem' }}>
      <div className="glass-panel chat-window" style={{ display: 'flex', flexDirection: 'column', height: '650px', position: 'relative' }}>
        
        {/* Ad Placeholder (Top) */}
        <div className="ad-placeholder" style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--accent-color)', opacity: 0.5, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          ADVERTISEMENT: SUPPORTING THE MISSION
        </div>

        <div className="message-list" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender} fade-in ${msg.isError ? 'error-message' : ''}`}>
              <div className="text-content" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="message ai fade-in typing-indicator">
              <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="input-area" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Ask anything (Hindi, English, Hinglish)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            autoFocus
          />
          <button type="submit" className="btn-divine" disabled={isTyping || !input.trim()}>
            {isTyping ? "..." : "Send"}
          </button>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', opacity: 0.6, color: 'var(--text-secondary)' }}>
        "Speak, and the wisdom of the ancients shall be revealed."
      </div>
    </div>
  )
}

export default ChatInterface
