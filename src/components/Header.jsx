import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Header({ isDarkMode, toggleDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  // Common Nav Links
  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Privacy', path: '/privacy' },
  ];

  return (
    <header className="site-header">
      <Link to="/" className="logo-link" onClick={closeMenu}>
        <h1 className="logo">ALL ABOUT RAMAYANA</h1>
      </Link>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        {navLinks.map(link => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.name}
          </Link>
        ))}
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

      {/* Mobile Hamburger Toggle */}
      <button 
        className={`hamburger-btn ${isMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'show' : ''}`} onClick={closeMenu}>
        <div className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-drawer-header">
            <h2 className="drawer-title">Navigation</h2>
            <button className="drawer-close" onClick={closeMenu}>&times;</button>
          </div>
          
          <div className="mobile-drawer-top-actions">
            <p className="drawer-label">Divine Theme</p>
            <button 
              onClick={toggleDarkMode}
              className={`theme-toggle-premium ${isDarkMode ? 'dark' : 'light'}`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ margin: '0 auto' }}
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
          </div>

          <nav className="mobile-nav-list" style={{ marginTop: '2rem' }}>
            <Link to="/" className="mobile-nav-link" onClick={closeMenu}>Divine Guide</Link>
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
