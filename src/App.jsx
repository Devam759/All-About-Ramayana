import { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import Header from './components/Header'
import AdRail from './components/AdRail'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage first, then fall back to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })

  // Toggle dark mode and save to localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // Listen for system theme changes
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if the user hasn't set a manual preference 
      // (Simplified: if no choice made in this session, match the latest preference)
      setIsDarkMode(e.matches);
    };

    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [])

  return (
    <div className="app-container">
      <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />
      
      <div className="main-content-layout">
        {/* Left Side Ad Rail (Desktop Only) */}
        <AdRail side="left" />

        <main className="fade-in">
          <ChatInterface />
        </main>

        {/* Right Side Ad Rail (Desktop Only) */}
        <AdRail side="right" />
      </div>
    </div>
  )
}

export default App
