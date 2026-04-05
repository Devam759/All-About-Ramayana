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
        color: 'var(--primary)' 
      }}>
        All About Ramayana
      </div>
      
      <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <a href="#about" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 500 }}>ABOUT</a>
        <a href="#resources" style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.9rem', fontWeight: 500 }}>RESOURCES</a>
        
        <button 
          onClick={toggleDarkMode}
          className="dark-mode-toggle"
          style={{ 
            background: 'none', 
            border: '1px solid #ccc', 
            borderRadius: '50px', 
            padding: '4px 12px', 
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: 'inherit'
          }}
        >
          {isDarkMode ? '🌙 DARK' : '☀️ LIGHT'}
        </button>
      </nav>
    </header>
  )
}

export default Header
