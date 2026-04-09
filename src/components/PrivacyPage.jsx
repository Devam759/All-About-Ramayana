import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  useEffect(() => {
    document.title = "Privacy Policy & Data Ethics - All About Ramayana";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="document-page fade-in">
      <div className="document-container royal-card">
        <header className="document-header">
          <Link to="/" className="back-link">← Return to Divine Guide</Link>
          <h2 className="document-title">Privacy Policy & Data Ethics</h2>
          <p className="document-subtitle">Committed to transparency and user trust.</p>
        </header>

        <div className="document-body">
          <section className="document-section">
            <h3 className="section-heading">Introduction</h3>
            <p>
              This Privacy Policy describes how <strong>All About Ramayana</strong> (the "Service") collects, uses, and protects your information. We prioritize data minimization and the ethical use of artificial intelligence in a scholarly context.
            </p>
          </section>

          <section className="document-section">
            <h3 className="section-heading">Data Collection</h3>
            <p>
              We operate on a principle of strict data minimization. We do not collect personally identifiable information (PII) such as names, addresses, or phone numbers.
            </p>
            <ul className="professional-list">
              <li><strong>Anonymous Queries:</strong> We log the text of your queries and timestamps to identify knowledge gaps and refine our AI's accuracy.</li>
              <li><strong>Cookies:</strong> This site uses cookies and similar technologies (including <strong>Google AdSense</strong>) to serve advertisements and analyze traffic.</li>
              <li><strong>AdSense:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
            </ul>
          </section>

          <section className="document-section">
            <h3 className="section-heading">Information Security</h3>
            <p>
              We implement robust security measures, including Firebase App Check, SSL encryption, and Secret Management, to ensure that interaction with our AI backend is secure and metadata remains protected.
            </p>
          </section>

          <section className="document-section">
            <h3 className="section-heading">Third-Party Services</h3>
            <p>
              This service is powered by Google Gemini AI. By using this platform, you also agree to the <a href="https://ai.google.dev/terms" target="_blank" rel="noopener noreferrer">Google AI Terms of Service</a>.
            </p>
          </section>

          <section className="document-section">
            <h3 className="section-heading">Contact Us</h3>
            <p>
              For data removal requests or legal inquiries, please contact:
            </p>
            <p className="contact-info">
              <strong>Email:</strong> <a href="mailto:devamgupta.business@gmail.com">devamgupta.business@gmail.com</a>
            </p>
          </section>
        </div>

        <footer className="document-footer">
          <p>Last Updated: April 09, 2026</p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPage;
