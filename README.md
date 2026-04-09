# All About Ramayana

[![Live Demo](https://img.shields.io/badge/Live-Firebase_Hosting-orange?logo=firebase)](https://all-about-ramayana.web.app)
[![AI Engine](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js_22-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**All About Ramayana** is a professional-grade AI research platform designed to provide accurate, context-aware insights into the Valmiki Ramayana, Tulsidas's Ramcharitmanas, and the broader historical and philosophical tradition of the sacred epic. This platform was developed to serve as a reliable, scholarly resource, offering a verified alternative to unstructured community knowledge.

**Production URL:** [https://all-about-ramayana.web.app](https://all-about-ramayana.web.app)

---

## Table of Contents

1. [Project Motivation](#project-motivation)
2. [Key Features](#key-features)
3. [System Architecture](#system-architecture)
4. [Security Architecture](#security-architecture)
5. [Directory Structure](#directory-structure)
6. [Configuration and Environment Variables](#configuration-and-environment-variables)
7. [Installation and Local Setup](#installation-and-local-setup)
8. [Deployment Workflow](#deployment-workflow)
9. [Automated Knowledge Refinement](#automated-knowledge-refinement)
10. [Contribution Guidelines](#contribution-guidelines)
11. [Legal and Academic Disclaimer](#legal-and-academic-disclaimer)

---

## Project Motivation

The genesis of this project stems from the challenges associated with retrieving authoritative data regarding the Ramayana. General-purpose search engines frequently return unverified forum discussions or blog posts rather than primary textual evidence. Ancient texts, specifically the Valmiki Ramayana, contain precise descriptions of characters, complex timelines, and deep philosophical structures that are often lost in casual digital discourse.

This platform functions as a scholarly compendium, synthesized from primary textual sources and subject to continuous refinement based on analytical data logging.

---

## Key Features

### Intelligent Script Mirroring

The system maintains linguistic resonance by detecting the user's input script and responding accordingly.

| Language / Script | User Input Example | Response Script |
|---|---|---|
| Romanized Hindi (Hinglish) | "Ram kaun the?" | Romanized Hindi |
| Devanagari Hindi | "राम कौन थे?" | Devanagari Hindi |
| English | "Who was Lord Rama?" | English |

### Strict Topical Guardrails

To maintain the integrity of the research platform, the system is strictly limited to the subject of the Ramayana. Queries regarding irrelevant domains—such as modern technology, news, or general secular knowledge—are gracefully declined. This ensures the AI operates as a specialized knowledge agent rather than a general-purpose chat interface.

### High Availability and Model Redundancy

The backend utilizes a sophisticated model rotation strategy to ensure consistent service availability:

```text
gemini-2.0-flash  ->  gemini-2.5-flash  ->  gemini-1.5-flash  ->  gemini-1.5-pro
```

If a given model encounters quota exhaustion or temporary latency, the system automatically migrates the request to a secondary candidate in the preference list.

### Continuous Content Optimization

User queries are logged anonymously to Cloud Firestore and reviewed in 10-day analytical cycles. The `divine_train.js` utility identifies knowledge gaps and updates the `supplemental_knowledge.js` data layer, improving contextual accuracy without requiring full model retraining.

---

## System Architecture

```text
Browser (React + Vite)
        |
        | Secure HTTPS (Firebase SDK onCall)
        v
Firebase Cloud Function — askRamayana (Node.js 22)
        |                       |
        | App Check Token        | Secret Manager
        | Verification           | GEMINI_API_KEY
        v                       v
   Request Validated?      Google Gemini API
        |
        v
Cloud Firestore (Anonymous Query Logging)
```

### Frontend Implementation

- **Library**: React 18 (Vite 5)
- **Styling**: Vanilla CSS Design System (Utilizing Playfair Display and Inter Typography)
- **Security**: Client-side XSS stripping, prompt injection detection, and a 1,000-character input ceiling.

### Backend and AI Integration

- **Runtime Environment**: Firebase Cloud Functions (Node.js 22, 2nd Gen)
- **SDK**: `@google/genai` v1.48+
- **Secrets Management**: API Credentials are secured via Google Cloud Secret Manager (never exposed in source code).
- **Enforcement**: Mandatory Firebase App Check verification for all incoming requests.

---

## Security Architecture

The platform employs a defense-in-depth model to ensure both data integrity and service stability.

| Layer | Mechanism | Protection Objective |
|---|---|---|
| Input Layer | `sanitizeQuery()` utility | XSS mitigation, Injection defense |
| Frequency Layer | 5-second backend rate limiter | Anti-spam, Quota preservation |
| Authentication | Firebase Secret Manager | Credential isolation |
| Verification | Firebase App Check (reCAPTCHA v3) | Bot exclusion, API locking |
| Data Layer | Server-side Timestamping | Audit logging integrity |

For detailed security configuration instructions, please consult the [SECURITY_HARDENING_GUIDE.md](./SECURITY_HARDENING_GUIDE.md).

---

## Directory Structure

```text
all-about-ramayana/
├── functions/                  # Cloud Functions (Backend Logic)
│   ├── index.js                # AI Gateway and Security Middleware
│   └── package.json
├── scripts/
│   └── divine_train.js         # Knowledge refinement utility
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx   # Core UI and Input Sanitization
│   │   ├── PrivacyModal.jsx    # Data Ethics disclosure
│   │   └── ...
│   ├── lib/
│   │   ├── firebase.js         # Firebase and App Check initialization
│   │   └── gemini.js           # Frontend SDK for Function interaction
│   └── styles/
│       └── index.css           # Global tokens and design system
├── firestore.rules             # Field-validated database security
├── firebase.json               # Infrastructure configuration
├── index.html                  # SEO, Font imports, and Meta structure
└── package.json
```

---

## Configuration and Environment Variables

A `.env` file must be provisioned in the root directory. These values are public client-side identifiers. The Gemini API secret is managed exclusively through the Firebase Secret Manager.

```env
# Infrastructure Identifiers
VITE_FIREBASE_PROJECT_ID=all-about-ramayana
VITE_RECAPTCHA_SITE_KEY=your_site_key

# Optional Monetization
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

To configure the API secret:

```bash
npx firebase-tools functions:secrets:set GEMINI_API_KEY
```

---

## Installation and Local Setup

### Prerequisites

- Node.js v22 or higher
- Firebase CLI (`npm install -g firebase-tools`)
- Google AI Studio API credentials

### Local Initialization

```bash
# 1. Repository Acquisition
git clone https://github.com/Devam759/All-About-Ramayana.git
cd All-About-Ramayana

# 2. Dependency Management
npm install
cd functions && npm install && cd ..

# 3. Secret Configuration
npx firebase-tools functions:secrets:set GEMINI_API_KEY

# 4. Local Development Environment
npm run dev
```

---

## Deployment Workflow

The following command executes the build pipeline and deploys infrastructure updates:

```bash
npm run deploy
```

This updates:
1. Production Frontend (Firebase Hosting)
2. AI Gateway Function (Cloud Functions Gen 2)
3. Security Rules (Firewall and Database)

---

## Automated Knowledge Refinement

The `divine_train.js` script facilitates a continuous improvement cycle:
1. Aggregates anonymized query logs from Firestore.
2. Utilizes Gemini to identify recurring themes and scholarly inaccuracies.
3. Synthesizes updated context for `supplemental_knowledge.js`.
4. Deploys updated knowledge within the build pipeline.

---

## Contribution Guidelines

Contributions from the scholarly community and developers are welcome. If you identify a theological or historical inaccuracy, or wish to contribute data regarding regional variations of the epic, please submit a detailed Issue or Pull Request.

---

## Legal and Academic Disclaimer

Distributed under the MIT License.

The outputs generated by this platform are derived from the Valmiki Ramayana, the Ramcharitmanas, and a curated knowledge base. While significant effort has been made to ensure textual fidelity, AI-generated content should be treated as an interpretive aid. Users are advised to verify critical data points against primary Sanskrit sources or through consultation with qualified academic commentators.

"Where Rama goes, there is no fear." — Valmiki Ramayana

---

*Authored with strict adherence to cultural authenticity and engineering best practices.*
