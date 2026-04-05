import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase"; // We need the initialized app

const functions = getFunctions(app);

/**
 * Calls the secure backend proxy to interact with the Divine Wisdom.
 * This keeps the API Key hidden and allows for robust rate limiting.
 */
export async function askRamayana(userQuery, history = []) {
  try {
    const askRamayanaFn = httpsCallable(functions, 'askRamayana');
    
    const result = await askRamayanaFn({
      userQuery: userQuery,
      history: history
    });

    if (result.data && result.data.text) {
      return result.data.text;
    }
    
    throw new Error("The divine message was lost in transmission.");
  } catch (error) {
    console.error("Divine API Error (Proxy):", error);
    
    // Handle specific HttpsErrors if needed
    if (error.code === 'resource-exhausted') {
      throw new Error("All Divine models are currently busy due to high traffic. Please try again in a few moments.");
    }
    
    throw error;
  }
}

