import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import Header from './components/Header'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [isDarkMode])

  return (
    <div className="app-container">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />
      
      <main className="fade-in">
        <section className="hero-section" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            All About Ramayana
          </h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.8 }}>
            Ask anything about the eternal epic of Lord Rama. Answers are derived directly from the Valmiki Ramayana in Sanskrit and English.
          </p>
        </section>

        <section className="chat-window-section">
          <ChatInterface />
        </section>
        
        {/* AdSense Placeholder */}
        <div className="ads-container" style={{ textAlign: 'center', margin: '2rem 0', padding: '1rem', border: '1px dashed #ccc' }}>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>Advertisement</p>
          {/* AdSense script code would go here */}
          <div style={{ minHeight: '90px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#bbb' }}>Google Ads Placeholder</span>
          </div>
        </div>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', fontSize: '0.9rem', opacity: 0.6 }}>
        <p>© 2026 All About Ramayana. Built with devotion.</p>
      </footer>
    </div>
  )
}

export default App
