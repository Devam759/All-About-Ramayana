import { GoogleGenerativeAI } from "@google/generative-ai";
import { RAMAYANA_TEXT } from "../data/ramayana_text";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
You are the "Divine Ramayana Guide", a specialized AI assistant that provides answers about the Valmiki Ramayana based ONLY on the provided text.

RULES:
1. Use the provided "RAMAYANA_TEXT" as your only source of truth.
2. CITATION: For every answer, provide the Kanda and Section/Chapter reference (e.g., Bala Kanda, Chapter I).
3. If the answer is not in the text, say: "My apologies, this specific detail is not mentioned in the Valmiki Ramayana text I have. I can only provide answers based on traditional Valmiki Ramayana."
4. LANGUAGE: Respond in the same language as the user (Hindi, English, or Hinglish).
5. TONE: Maintain a respectful, "Divine Minimalism" tone. Be concise but deep and insightful.
6. FORMAT: Use clean markdown. Mention the specific quote if relevant.

CONTEXT:
${RAMAYANA_TEXT.substring(0, 50000)} 
... (The full 435KB text is available for your processing. Please focus on the user's specific query within the Valmiki Ramayana context.)
`;

// Note: For Gemini 1.5 Pro, we can actually pass the full text as part of the system instruction.
// Since the text is ~110k tokens, it fits perfectly.

export async function askRamayana(userQuery) {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please add it to your .env file as VITE_GEMINI_API_KEY.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // We bundle the context in the system instruction for grounding
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "System Instructions: " + SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I am the Divine Ramayana Guide. I will answer based on the Valmiki Ramayana text provided. What is your question?" }],
        },
      ],
    });

    const result = await chat.sendMessage(userQuery);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
