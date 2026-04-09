import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already acknowledged
    const hasConsented = localStorage.getItem('ramayana_cookie_consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ramayana_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-consent-banner fade-in">
      <div className="cookie-content">
        <p>
          This website uses cookies and similar technologies (including Google AdSense) to enhance 
          your experience and analyze site traffic as part of our scholarly research. By continuing, 
          you consent to our use of these technologies.
        </p>
        <div className="cookie-actions">
          <button onClick={handleAccept} className="btn-cookie-accept">Accept & Continue</button>
          <a href="/?policy=privacy" className="cookie-policy-link" onClick={(e) => {
             e.preventDefault();
             window.dispatchEvent(new CustomEvent('open-privacy-modal'));
          }}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
