/**
 * DIVINE TRAINING SCRIPT (Node.js)
 * Automatically synthesizes user queries into the knowledge base.
 */
import admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../src/data/supplemental_knowledge.js");

// 1. Initialize Firebase Admin
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  const saPath = path.join(__dirname, "../serviceAccountKey.json");
  if (fs.existsSync(saPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf8"));
  }
}

if (!serviceAccount) {
  console.error("❌ Error: FIREBASE_SERVICE_ACCOUNT or serviceAccountKey.json missing.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || "");

/**
 * Main Training Loop
 */
async function train() {
  console.log("🕊️ Starting Divine Training...");

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

    // 2. Synthesize with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
      You are the "Divine Archivist". 
      Below is a list of questions users recently asked my Ramayana AI bot.
      
      USER QUERIES:
      - ${queries}
      
      TASK:
      Identify important characters, locations, or events mentioned in these queries that might need more detail. 
      Synthesize a BRIEF, factual "Supplemental Lore" entry based ONLY on the Valmiki Ramayana (max 500 words).
      
      Format your response as a JAVASCRIPT STRING inside an export:
      export const SUPPLEMENTAL_KNOWLEDGE = \`[Your Lore Here]\`;
    `;

    const result = await model.generateContent(prompt);
    const content = result.response.text();

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
