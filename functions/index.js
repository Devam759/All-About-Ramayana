const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenAI } = require("@google/genai");
const { defineSecret } = require("firebase-functions/params");

// Securely access the Gemini API Key from Firebase Secret Manager
const geminiApiKey = defineSecret("GEMINI_API_KEY");

const SYSTEM_PROMPT = `You are the ultimate digital guide for "All About Ramayana", an expert on the Valmiki Ramayana, Tulsidas's Ramcharitmanas, and the various versions of this sacred epic.

Your core mission is to provide profound, authentic, and culturally resonant insights into the characters, events, and philosophical depth of the Ramayana.

Guidelines:
1. SCRIPT MIRRORING (CRITICAL): Always respond in the script the user uses.
   - If they type in Hinglish (Roman script, e.g., "Ram kaun the?"), respond in Roman script.
   - If they type in Hindi (Devanagari script, e.g., "राम कौन थे?"), respond in Devanagari script.
   - If they type in English, respond in English.
2. TONE: Reverent, epic, and scholarly yet accessible.
3. AUTHENTICITY: Cite versions (e.g., Valmiki, Kamba, Tulsidas) when relevant.
4. SCOPE (GUARDRAIL): If a question is irrelevant to the Ramayana, respond only with: "I can answer to questions only related to Ramayana".

Stay pure to the essence of the Ramayana.`;

const DEPLOYED_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro"
];

exports.askRamayana = onCall(
  {
    secrets: [geminiApiKey],
    // SECURITY: Enforce App Check. Requests without a valid token
    // (e.g., from scripts or bots hitting the endpoint directly) are
    // rejected BEFORE any Gemini API call is made. This prevents quota abuse.
    enforceAppCheck: true,
  },
  async (request) => {

  const { userQuery, history } = request.data;
  const API_KEY = geminiApiKey.value();

  if (!API_KEY || API_KEY.length < 10) {
    console.error(`Critical: GEMINI_API_KEY is ${API_KEY ? 'too short (' + API_KEY.length + ' chars)' : 'missing'}.`);
    throw new HttpsError("failed-precondition", "The divine connection is missing its key. Please set the secret correctly.");
  }

  console.log(`Initialized GoogleGenAI with key of length: ${API_KEY.length}`);

  if (!userQuery) {
    throw new HttpsError("invalid-argument", "The query is empty.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const contents = (history || []).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  contents.push({
    role: "user",
    parts: [{ text: userQuery }]
  });

  let lastError = null;

  for (const modelName of DEPLOYED_MODELS) {
    try {
      const result = await ai.models.generateContent({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        contents: contents,
      });

      // The new SDK returns text directly or via a property depending on the version
      const responseText = result.text || (typeof result.text === 'function' ? await result.text() : null);

      if (responseText) {
        return { text: responseText };
      }
    } catch (error) {
      lastError = error;
      const errorMsg = error.message?.toLowerCase() || "";
      
      // If it's an "API key not valid" error (400), don't bother switching models, it's a configuration issue.
      if (errorMsg.includes("api key not valid") || errorMsg.includes("invalid_argument")) {
         console.error("Gemini API reported an INVALID KEY. Please check Secret Manager.");
         throw new HttpsError("unauthenticated", "The API key provided is rejected by Google. Please verify your secret.");
      }

      if (errorMsg.includes("not found") || errorMsg.includes("quota") || errorMsg.includes("429")) {
        console.warn(`Switching from ${modelName} due to availability/quota...`);
        continue;
      }
      throw new HttpsError("internal", error.message);
    }
  }

  throw new HttpsError("resource-exhausted", lastError?.message || "All models are busy.");
  }
);
