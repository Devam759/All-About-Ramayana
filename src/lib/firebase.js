import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Firebase config — all values are public client identifiers intentionally.
// They are moved to .env so they can vary per environment and stay out of source.
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "all-about-ramayana",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:211195518591:web:43f0f3a8834c1e62bca94a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "all-about-ramayana.firebasestorage.app",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "all-about-ramayana.firebaseapp.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "211195518591"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firebase App Check — verifies only YOUR website can call the Cloud Function.
// On localhost (dev), we use a debug token so reCAPTCHA (which requires a
// registered domain) doesn't block local development.
// In production builds, reCAPTCHA v3 is used automatically.
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const IS_DEV = import.meta.env.DEV; // Vite sets this to true during `npm run dev`

if (IS_DEV) {
  // Activate debug mode — Firebase will print a debug token to the console.
  // Copy that token and add it to Firebase Console → App Check → Apps → Debug Tokens.
  // Do NOT set this in production.
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  console.log("[AppCheck] Running in DEBUG mode (localhost). Check console for debug token.");
}

if (RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true,
  });
  if (!IS_DEV) {
    console.log("[AppCheck] Production mode — reCAPTCHA verification active.");
  }
} else {
  console.warn("[AppCheck] VITE_RECAPTCHA_SITE_KEY not set. App Check skipped.");
}


/**
 * Logs a user query to Firestore for model improvement analysis.
 * @param {string} query - The user's input text.
 * @param {string} language - Detected or inferred language.
 */
export const logQuery = async (query, language = 'unknown') => {
  if (!query || query.trim() === '') return;
  
  // Truncate query to 1000 characters for storage safety
  const safeQuery = query.trim().slice(0, 1000);
  
  try {
    await addDoc(collection(db, "user_queries"), {
      text: safeQuery,
      language: language,
      timestamp: serverTimestamp(),
      platform: 'web'
    });
  } catch (error) {
    console.warn("Failed to log query to Firestore:", error.message);
  }
};

export { app, db };
