import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  projectId: "all-about-ramayana",
  appId: "1:211195518591:web:43f0f3a8834c1e62bca94a",
  storageBucket: "all-about-ramayana.firebasestorage.app",
  apiKey: "AIzaSyBgUErfyDjuSvGD6_z9tTErQO9YNigoAmY",
  authDomain: "all-about-ramayana.firebaseapp.com",
  messagingSenderId: "211195518591"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Logs a user query to Firestore for model improvement analysis.
 * @param {string} query - The user's input text.
 * @param {string} language - Detected or inferred language.
 */
export const logQuery = async (query, language = 'unknown') => {
  if (!query || query.trim() === '') return;
  
  try {
    await addDoc(collection(db, "user_queries"), {
      text: query,
      language: language,
      timestamp: serverTimestamp(),
      platform: 'web'
    });
  } catch (error) {
    console.warn("Failed to log query to Firestore:", error.message);
  }
};

export { db };
