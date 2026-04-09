const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenAI } = require("@google/genai");
const { defineSecret } = require("firebase-functions/params");

// Code version: 1.0.1 (Forces redeploy)
// Securely access the Gemini API Key from Firebase Secret Manager
const geminiApiKey = defineSecret("GEMINI_API_KEY");

const SYSTEM_PROMPT = `[ABSOLUTE GUARDRAIL]: You are exclusively a digital guide for the Ramayana. If the user asks about ANYTHING else (e.g., modern celebrities, sports, politics, movies, science), you MUST decline. Reply ONLY with: "I can answer to questions only related to Ramayana."

Your core mission is to provide profound, authentic, and culturally resonant insights into the Valmiki Ramayana and Tulsidas's Ramcharitmanas.

Guidelines:
1. SCRIPT MIRRORING (CRITICAL): Always respond in the script the user uses (Hinglish to Hinglish, Devanagari to Devanagari, English to English).
2. TONE: Reverent, epic, and scholarly yet accessible.
3. AUTHENTICITY: Cite versions when relevant.
4. STRICT SCOPE: Never break character. Stay pure to the essence of the Ramayana.`;

// Confirmed available models via the v1beta API (verified 2025-04).
// All four support generateContent. Ordered from most capable to lightest.
const DEPLOYED_MODELS = [
  "gemini-2.0-flash",       // Primary — most reliable free-tier model
  "gemini-2.5-flash",       // Secondary — latest, capable
  "gemini-2.5-flash-lite",  // Tertiary — lighter, separate quota
  "gemini-flash-latest",    // Final fallback — stable alias, always resolves
];

// Backend In-Memory Rate Limiter
// Maps an IP address to the timestamp of its last request
const ipRateLimits = new Map();

// Prompt Injection Defense Patterns
const INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/gi,
  /you are now (a|an)/gi,
  /system (prompt|instructions):/gi,
  /instead of your (usual|regular)/gi,
  /forget (everything|all)/gi,
  /new rule:/gi
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

  // 1. Rate Limiting (IP-based, 5 seconds)
  const clientIp = request.rawRequest?.ip || "unknown";
  if (clientIp !== "unknown") {
    const now = Date.now();
    const lastRequestTime = ipRateLimits.get(clientIp);
    if (lastRequestTime && now - lastRequestTime < 5000) {
      console.warn(`Rate limit triggered for IP: ${clientIp}`);
      throw new HttpsError("resource-exhausted", "Divine wisdom requires patience. Please wait a few seconds before asking again.");
    }
    ipRateLimits.set(clientIp, now);
    
    // Prevent memory leaks in the map
    if (ipRateLimits.size > 10000) ipRateLimits.clear();
  }

  // 2. Precondition Checks
  if (!API_KEY || API_KEY.length < 10) {
    console.error(`Critical: GEMINI_API_KEY is ${API_KEY ? 'too short (' + API_KEY.length + ' chars)' : 'missing'}.`);
    throw new HttpsError("failed-precondition", "The divine connection is missing its key. Please set the secret correctly.");
  }

  console.log(`Initialized GoogleGenAI with key of length: ${API_KEY.length}`);

  // 3. Input Validation & Sanitization
  if (!userQuery || typeof userQuery !== 'string' || userQuery.trim() === '') {
    throw new HttpsError("invalid-argument", "The query is empty or invalid.");
  }

  // Trim and enforce hard 1000 character limit
  let sanitizedQuery = userQuery.trim().slice(0, 1000);

  // Apply Prompt Injection Defense
  INJECTION_PATTERNS.forEach(pattern => {
    sanitizedQuery = sanitizedQuery.replace(pattern, '[REDACTED]');
  });

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // 4. Validate and Sanitize History
  const safeHistory = (Array.isArray(history) ? history : []).map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: typeof msg.text === 'string' ? msg.text.slice(0, 1000) : '' }]
  }));

  const contents = [...safeHistory];

  contents.push({
    role: "user",
    parts: [{ text: sanitizedQuery }]
  });

  let lastError = null;

  for (const modelName of DEPLOYED_MODELS) {
    try {
      // Use the standard getGenerativeModel pattern to ensure System Instructions are respected.
      const model = ai.getGenerativeModel({ 
        model: modelName,
        systemInstruction: SYSTEM_PROMPT 
      });

      const result = await model.generateContent({ contents });
      const response = await result.response;
      const responseText = response.text();

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

      if (errorMsg.includes("not found") || errorMsg.includes("quota") || errorMsg.includes("429") || errorMsg.includes("503") || errorMsg.includes("unavailable")) {
        console.warn(`Switching from ${modelName} due to availability/quota...`);
        continue;
      }
      
      // Error Obfuscation: Do not bubble up raw Gemini errors to the client
      console.error(`Internal LLM Error: ${error.message}`);
      throw new HttpsError("internal", "The divine connection encountered a temporary issue. Please try again.");
    }
  }

  throw new HttpsError("resource-exhausted", lastError?.message || "All models are busy.");
  }
);
