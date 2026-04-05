/**
 * DIVINE TRAINING SCRIPT (Node.js)
 * Automatically synthesizes user queries into the knowledge base.
 */
import admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../src/data/supplemental_knowledge.js");

// 1. Initialize Firebase Admin
let serviceAccount;
const saPath = path.join(__dirname, "../serviceAccountKey.json");
const altSaPath = fs.readdirSync(path.join(__dirname, "..")).find(f => f.startsWith("all-about-ramayana-firebase-adminsdk"));

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else if (fs.existsSync(saPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf8"));
} else if (altSaPath) {
  serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, "..", altSaPath), "utf8"));
}

if (!serviceAccount) {
  console.error("❌ Error: FIREBASE_SERVICE_ACCOUNT or serviceAccountKey.json missing.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

// 2. LOAD GEMINI API KEY (Node.js doesn't auto-load .env)
const envPath = path.join(__dirname, "../.env");
let GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
if (!GEMINI_API_KEY && fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    const lines = envContent.split("\n");
    for (const line of lines) {
        if (line.trim().startsWith("VITE_GEMINI_API_KEY=")) {
            GEMINI_API_KEY = line.split("=")[1].trim().replace(/^["']|["']$/g, "");
            break;
        }
    }
}

if (!GEMINI_API_KEY) {
  console.error("❌ Error: VITE_GEMINI_API_KEY missing in .env or environment.");
  process.exit(1);
}

const genAI = new GoogleGenAI({
  apiKey: GEMINI_API_KEY
});

/**
 * Main Training Loop
 */
async function train() {
  console.log(`🕊️ Starting Divine Training for Project: ${serviceAccount.project_id}...`);

  try {
    // 1. Fetch recent queries (last 10 days)
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    const snapshot = await db.collection("user_queries")
      .where("timestamp", ">=", tenDaysAgo)
      .limit(100)
      .get();

    if (snapshot.empty) {
      console.log("📭 No new queries to analyze. Knowledge remains pure.");
      return;
    }

    const queries = snapshot.docs.map(doc => doc.data().text).join("\n- ");
    console.log(`🔍 Analyzing ${snapshot.size} user queries...`);

    // 2. Synthesize with Gemini (2026 Unified Syntax)
    const prompt = `
      You are the "Divine Archivist". 
      Below is a list of questions users recently asked my Ramayana AI bot.
      
      USER QUERIES:
      - ${queries}
      
      TASK:
      Identify important characters, locations, or events mentioned in these queries that might need more detail. 
      Synthesize a BRIEF, factual "Supplemental Lore" entry based ONLY on the Valmiki Ramayana (max 500 words).
      
      Format your response as a JAVASCRIPT EXPORT:
      export const SUPPLEMENTAL_KNOWLEDGE = \`[Your Lore Here]\`;
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const content = result.text;

    // 3. Update the data file
    fs.writeFileSync(OUTPUT_PATH, content, "utf8");
    console.log("📜 Divine Knowledge Updated. supplemental_knowledge.js has been refined.");

  } catch (error) {
    console.error("💥 Training Failed:", error.message);
  } finally {
    process.exit(0);
  }
}

train();
