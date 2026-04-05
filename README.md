# All About Ramayana

[![Live Demo](https://img.shields.io/badge/Live-Firebase_Hosting-orange?logo=firebase)](https://all-about-ramayana.web.app)
[![AI Engine](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js_22-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**All About Ramayana** is a production-grade AI research platform providing accurate, context-aware insights into the Valmiki Ramayana, Tulsidas's Ramcharitmanas, and the broader tradition of the sacred epic. The platform was built to address a gap in reliable, structured information about the Ramayana — offering a trusted alternative to unverified community posts and forum answers.

**Live at:** [https://all-about-ramayana.web.app](https://all-about-ramayana.web.app)

---

## Table of Contents

1. [Motivation](#motivation)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Security Model](#security-model)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Setup and Installation](#setup-and-installation)
8. [Deployment](#deployment)
9. [Knowledge Refinement Pipeline](#knowledge-refinement-pipeline)
10. [Contributing](#contributing)
11. [License and Accuracy Disclaimer](#license-and-accuracy-disclaimer)

---

## Motivation

The idea for this project came from a simple question: *how tall was Kumbhakarna?* A web search returned no authoritative answer — only forum threads and unverified blog posts. Ancient scriptures like the Valmiki Ramayana contain precise descriptions of characters, events, timelines, and philosophical teachings, but that information is rarely surfaced in an accessible, structured way.

This platform was built to serve as a trusted compendium — backed by primary textual sources and continuously refined through real user queries.

---

## Features

### Script Mirroring

The AI automatically detects the user's input script and responds in kind.

| User Input | Response Language |
|---|---|
| Roman (Hinglish) — "Ram kaun the?" | Roman script |
| Devanagari — "राम कौन थे?" | Devanagari script |
| English — "Who was Lord Rama?" | English |

### Topical Guardrails

The system is strictly scoped to the Ramayana. Queries about unrelated topics (news, technology, general knowledge) trigger a boundary response. This prevents misuse of the AI as a general-purpose assistant.

### Model Redundancy and High Availability

The backend implements a prioritized model rotation strategy:

```
gemini-2.0-flash  ->  gemini-2.5-flash  ->  gemini-1.5-flash  ->  gemini-1.5-pro
```

If any model returns a quota error or is unavailable, the system automatically falls back to the next candidate without interrupting the user session.

### Continuous Knowledge Refinement

Anonymized user queries are logged to Firestore and analyzed in 10-day cycles. The `divine_train.js` script identifies knowledge gaps and updates `supplemental_knowledge.js`, enabling the AI's contextual accuracy to improve over time without model retraining.

### Multi-Language Support

The AI is capable of responding to queries in English, Hindi (Devanagari), and Hinglish (transliterated Hindi), covering the primary audience demographics for Ramayana scholarship.

---

## Architecture

```
Browser (React + Vite)
        |
        | HTTPS (Firebase SDK onCall)
        v
Firebase Cloud Function — askRamayana (Node.js 22)
        |                       |
        | App Check Token        | Secret Manager
        | Verification           | GEMINI_API_KEY
        v                       v
  Request Allowed?        Google Gemini API
        |
        v
  Firestore (user_queries — anonymous logging)
```

### Frontend

- **Framework**: React 18 (Vite 5)
- **Styling**: Vanilla CSS with a custom Royal design system (Playfair Display, Inter typography)
- **Key Libraries**: `react-markdown`, `firebase` SDK v12, `framer-motion`
- **Security**: Client-side input sanitization (XSS stripping, prompt injection patterns, 1000-character limit)

### Backend

- **Runtime**: Firebase Cloud Functions, Node.js 22 (2nd Generation)
- **AI SDK**: `@google/genai` v1.48+
- **Secrets**: Gemini API key stored in Google Cloud Secret Manager — never in environment variables or source code
- **App Check Enforcement**: `enforceAppCheck: true` — all requests must carry a valid reCAPTCHA v3 token issued by the browser

### Database

- **Service**: Cloud Firestore
- **Usage**: Write-only from the client (logging anonymous query text + timestamp)
- **Rules**: Field-level validation via Firestore Security Rules — enforces schema, character limits, timestamp integrity, and denies all reads and deletions from the client

---

## Security Model

The platform implements a layered defence-in-depth strategy.

| Layer | Mechanism | Protection |
|---|---|---|
| Client input | `sanitizeQuery()` in `ChatInterface.jsx` | XSS, prompt injection, query length abuse |
| Rate limiting | 5-second client-side cooldown | Prevents UI-level spam |
| API key protection | Firebase Secret Manager | Key is never exposed in source or environment |
| Request verification | Firebase App Check (reCAPTCHA v3) | Blocks unauthenticated scripts from calling the Cloud Function |
| Database integrity | Firestore Security Rules (field validation) | Prevents document spam, schema abuse, and timestamp spoofing |
| Model fallback | Priority rotation in `functions/index.js` | Maintains availability during quota exhaustion |

For full setup instructions for App Check, refer to [SECURITY_HARDENING_GUIDE.md](./SECURITY_HARDENING_GUIDE.md).

---

## Project Structure

```
all-about-ramayana/
├── functions/                  # Firebase Cloud Functions (backend)
│   ├── index.js                # askRamayana — AI proxy endpoint
│   └── package.json
├── scripts/
│   └── divine_train.js         # Knowledge refinement pipeline (runs via npm run train)
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx   # Primary chat UI, input sanitization, rate limiting
│   │   ├── PrivacyModal.jsx    # Privacy and Data Ethics disclosure
│   │   └── ...
│   ├── data/
│   │   └── supplemental_knowledge.js  # Auto-generated contextual lore
│   ├── lib/
│   │   ├── firebase.js         # Firebase init, App Check, Firestore logging
│   │   └── gemini.js           # Frontend Gemini client (proxied via Cloud Function)
│   └── styles/
│       └── index.css           # Royal design system tokens and component styles
├── firestore.rules             # Field-validated Firestore Security Rules
├── firebase.json               # Hosting and Functions configuration
├── SECURITY_HARDENING_GUIDE.md # Step-by-step App Check / reCAPTCHA setup
├── index.html                  # SEO meta tags, font imports, AdSense
└── package.json
```

---

## Environment Variables

Create a `.env` file in the project root. None of these values are secrets — they are all public client-side identifiers. The actual Gemini API key is stored in Google Cloud Secret Manager and is referenced only from within the Cloud Function.

```env
# Firebase App Check (reCAPTCHA v3 — Site Key only, never the Secret Key)
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_v3_site_key

# Google AdSense (optional — for monetization)
VITE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
VITE_ADSENSE_LEFT_SLOT_ID=xxxxxxxxxx
VITE_ADSENSE_RIGHT_SLOT_ID=xxxxxxxxxx
```

To set the Gemini API key securely in Firebase Secret Manager:

```bash
npx firebase-tools functions:secrets:set GEMINI_API_KEY
```

---

## Setup and Installation

### Prerequisites

- Node.js v22 or higher
- Firebase CLI: `npm install -g firebase-tools`
- A Google AI Studio API key: [https://aistudio.google.com](https://aistudio.google.com)
- A Firebase project with Firestore and Cloud Functions enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Devam759/All-About-Ramayana.git
cd All-About-Ramayana

# 2. Install frontend dependencies
npm install

# 3. Install Cloud Functions dependencies
cd functions && npm install && cd ..

# 4. Configure environment variables
cp .env.example .env
# Edit .env and fill in your values

# 5. Store the Gemini API key in Secret Manager
npx firebase-tools functions:secrets:set GEMINI_API_KEY

# 6. Start the local development server
npm run dev
```

---

## Deployment

A single command builds the frontend and deploys both Firebase Hosting and Cloud Functions:

```bash
npm run deploy
```

This runs `vite build` followed by `firebase deploy`, which publishes:
- The compiled React app to Firebase Hosting
- The `askRamayana` Cloud Function to `us-central1`
- Updated Firestore Security Rules

---

## Knowledge Refinement Pipeline

The `divine_train.js` script implements a continuous improvement loop:

1. Connects to Firestore using a Firebase Admin Service Account.
2. Fetches all anonymized query logs from the `user_queries` collection.
3. Calls the Gemini API to identify recurring topics and knowledge gaps.
4. Synthesizes a structured knowledge supplement and writes it to `src/data/supplemental_knowledge.js`.
5. This file is bundled into the next frontend deployment, improving contextual accuracy.

To run a training cycle manually:

```bash
npm run train
```

For automated execution, configure `FIREBASE_SERVICE_ACCOUNT` as a GitHub Actions secret and add a scheduled workflow trigger.

---

## Contributing

Contributions are welcome. If you identify an inaccuracy in a Ramayana-related answer, or wish to add support for an additional regional version of the epic (Kamba Ramayana, Adhyatma Ramayana, etc.), please open an issue or submit a pull request.

---

## License and Accuracy Disclaimer

This project is released under the MIT License.

The responses generated by this platform are based on the Valmiki Ramayana, Ramcharitmanas, and a curated supplemental knowledge base. While the system is designed to prioritize textual accuracy, AI-generated responses may contain interpretive variations. Users are encouraged to cross-reference answers with primary Sanskrit sources or qualified scholarly commentary for theological or academic purposes.

> "Where Rama goes, there is no fear." — Valmiki Ramayana

---

*Built by Devam, with attention to cultural authenticity, and production-grade engineering.*
