import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  useEffect(() => {
    document.title = "About the Project - All About Ramayana AI";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="document-page fade-in">
      <div className="document-container royal-card">
        <header className="document-header">
          <Link to="/" className="back-link">← Return to Divine Guide</Link>
          <h2 className="document-title">Project Motivation & Vision</h2>
          <p className="document-subtitle">Bridging Ancient Wisdom with Modern Artificial Intelligence.</p>
        </header>

        <div className="document-body">
          <section className="document-section">
            <h3 className="section-heading">The Scholarly Gap</h3>
            <p>
              The <strong>All About Ramayana</strong> initiative was born from a fundamental challenge in digital research: the difficulty of retrieving authoritative, textually-backed data regarding the sacred epics. While the internet is vast, scholarly information from the Valmiki Ramayana and Tulsidas's Ramcharitmanas is often buried beneath unverified forum discussions.
            </p>
            <p>
              This platform serves as a production-grade research gateway, providing a trusted alternative to unstructured community knowledge.
            </p>
          </section>

          <section className="document-section">
            <h3 className="section-heading">Our Methodology</h3>
            <p>
              We utilize high-fidelity linguistic models (Google Gemini) tuned specifically for scriptural accuracy. The AI is governed by strict topical guardrails, ensuring that it operates as a specialized knowledge agent dedicated exclusively to the Ramayana tradition.
            </p>
            <ul className="professional-list">
              <li><strong>Scriptural Integrity:</strong> Responses prioritize the Valmiki tradition while acknowledging regional variations (Kamba, Adhyatma, etc.).</li>
              <li><strong>Linguistic Resonance:</strong> Support for English, Hindi, and transliterated Hinglish.</li>
              <li><strong>Continuous Refinement:</strong> A 10-day analytical cycle where anonymized queries are reviewed to address knowledge gaps.</li>
            </ul>
          </section>

          <section className="document-section">
            <h3 className="section-heading">The Developer</h3>
            <p>
              This project is architected and maintained by <strong>Devam Gupta</strong>, with a focus on combining cultural authenticity with state-of-the-art web engineering. The goal is to ensure that the timeless teachings of Lord Rama are preserved and accessible for the digital age.
            </p>
            <div className="contact-card">
               <p>For scholarly inquiries or technical collaborations:</p>
               <a href="mailto:devamgupta.business@gmail.com" className="btn-royal-solid">Contact Administration</a>
            </div>
          </section>
        </div>

        <footer className="document-footer">
          <p>"Where Rama goes, there is no fear." — Valmiki Ramayana</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
