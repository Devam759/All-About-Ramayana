import React from 'react'

function Header({ isDarkMode, toggleDarkMode }) {
  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.5rem 2rem', 
      background: 'transparent' 
    }}>
      <div className="logo" style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        fontFamily: 'Playfair Display', 
        color: 'var(--primary)',
        letterSpacing: '1px'
      }}>
        All About Ramayana
      </div>
      
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <a href="#about" className="header-nav-link" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 600 }}>ABOUT</a>
        <a href="#resources" className="header-nav-link" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 600 }}>RESOURCES</a>
        
        <button 
          onClick={toggleDarkMode}
          className={`theme-toggle-premium ${isDarkMode ? 'dark' : 'light'}`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className="toggle-icon-container">
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="moon-icon">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sun-icon">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/>
              </svg>
            )}
          </div>
        </button>
      </nav>
    </header>
  )
}

export default Header
