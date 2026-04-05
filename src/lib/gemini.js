import { GoogleGenAI } from "@google/genai";
import { RAMAYANA_TEXT } from "../data/ramayana_text";
import { SUPPLEMENTAL_KNOWLEDGE } from "../data/supplemental_knowledge";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// New unified SDK (2026 standard)
const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

const SYSTEM_PROMPT = `
You are the "Divine Ramayana Guide", a specialized AI assistant that provides DIRECT answers about the Valmiki Ramayana based ONLY on the provided text and supplemental knowledge.

CORE KNOWLEDGE BASE:
${RAMAYANA_TEXT}

SUPPLEMENTAL DIVINE WISDOM:
${SUPPLEMENTAL_KNOWLEDGE}

STRICT BEHAVIOR RULES:
1. **CONTEXTUAL CONTINUITY**: You MUST use the conversation history to understand follow-up questions. For example, if a user asks "Kumbhkaran ki height?" and then "km me batao", you must know "km me batao" refers to Kumbhkaran's height.
2. **STRICT LANGUAGE MIRRORING**: You MUST respond in the EXACT script and style as the user:
   - **Hinglish (Roman Hindi)**: If asked "Ram kaun the?", respond in Hinglish: "Ram Dashrath ke sabse bade bete the..."
   - **Devanagari Hindi**: If asked "राम कौन थे?", respond in Hindi: "राम दशरथ के सबसे बड़े पुत्र थे..."
   - **English**: If asked "Who was Ram?", respond in English: "Ram was the eldest son of Dashratha..."
3. **DIRECTNESS**: No introductory fluff ("According to the text...", "Sure!", "Namaste"). Start the answer immediately.
4. **KUMBHAKARNA'S HEIGHT**: The text describes him as "mountain-like" (vidhyanchal mountain). If asked in 'km', translate "mountain-like" to a massive scale (~1.5km to 2km) while citing his "mountain-like" description.
5. **CITATION**: Always provide the Kanda/Chapter reference at the end in brackets.

CONTEXT:
${RAMAYANA_TEXT}
`;

export async function askRamayana(userQuery, history = []) {
  if (!API_KEY) {
    throw new Error("Gemini API Key is missing. Please add it to your .env file as VITE_GEMINI_API_KEY.");
  }

  try {
    // Map history to Gemini's expected format: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add the current query
    contents.push({
      role: "user",
      parts: [{ text: userQuery }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
      contents: contents, // Full context sent here
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
