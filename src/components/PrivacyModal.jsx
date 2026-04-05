import React from 'react';

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content royal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close Modal">&times;</button>
        
        <div className="modal-header">
          <h2 className="modal-title">Privacy & Data Ethics</h2>
          <p className="modal-subtitle">Commitment to integrity, privacy, and cultural preservation.</p>
        </div>
        
        <div className="modal-body">
          <section className="modal-section">
            <h3 className="section-heading">Objective</h3>
            <p>
              The <strong>All About Ramayana</strong> project is a digital research initiative designed to make the nuances of the Valmiki Ramayana accessible through advanced linguistic models. Our primary goal is to provide accurate, context-aware insights while maintaining the highest standards of data ethics.
            </p>
          </section>

          <section className="modal-section">
            <h3 className="section-heading">Data Minimization Policy</h3>
            <p>
              We operate on a principle of <strong>strict data minimization</strong>. To refine the accuracy of our responses, we analyze anonymized query strings and timestamps. 
            </p>
            <ul className="policy-list">
              <li><strong>No Personal Identification:</strong> We do not collect names, email addresses, IP addresses, or device identifiers.</li>
              <li><strong>No Third-Party Tracking:</strong> Your interactions are not shared with advertising networks or external data brokers.</li>
              <li><strong>Secure Transmission:</strong> All queries are processed via encrypted backend proxies to prevent data interception.</li>
            </ul>
          </section>

          <section className="modal-section">
            <h3 className="section-heading">Continuous Refinement</h3>
            <p>
              To address complex theological queries, our system identifies knowledge gaps where the AI may lack specific textual evidence. These gaps are reviewed in 10-day cycles to update our <em>Supplemental Lore</em> repository, ensuring the platform evolves in wisdom and accuracy.
            </p>
          </section>

          <section className="modal-section">
            <h3 className="section-heading">Regulatory Compliance</h3>
            <p>
              As an interface backed by Google's Generative Language models, users are also subject to the 
              <a href="https://ai.google.dev/terms" target="_blank" rel="noopener noreferrer" className="external-link"> Google AI Terms of Service</a>. We encourage users to avoid inputting sensitive personal information into the research interface.
            </p>
          </section>

          <div className="modal-footer-professional">
            <p className="disclaimer-text">By continuing to use this platform, you acknowledge these terms of data conduct.</p>
            <button className="btn-royal-solid" onClick={onClose}>Acknowledge & Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
