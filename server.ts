import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store for the prototype
const userSession = {
  goals: [] as string[],
  memories: [] as string[],
  chatHistory: [] as { role: string; content: string; timestamp: Date; explanation?: string }[],
  feedbackLoop: [] as { query: string; positive: boolean }[],
  driftScore: 0, // 0 to 100
  shadowLogs: [] as any[], // simulated future versions
};

// Initialize Gemini
// Lazy initialization is recommended
let aiClient: GoogleGenAI | null = null;
function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTES

  // 1. Goal Management
  app.post("/api/goal", (req, res) => {
    const { goal } = req.body;
    if (goal && !userSession.goals.includes(goal)) {
      userSession.goals.push(goal);
    }
    res.json({ goals: userSession.goals });
  });

  // 2. Chat & Cognition Engine
  app.post("/api/chat", async (req, res) => {
    const { message, language, userStyle } = req.body;
    
    try {
      const ai = getAI();
      const userMessage = { role: "user", content: message, timestamp: new Date() };
      userSession.chatHistory.push(userMessage);

      let parsed;

      if (!ai) {
        // Mock response if API key is missing
        parsed = {
          response: "(Mock Mode Offline) Please set your GEMINI_API_KEY in the AI Studio settings to enable real AI. For now, here is a simulated response acknowledging your goal.",
          explanation: "API key is missing, falling back to mock logic.",
          confidence: 50,
          drift_assessment: Math.floor(Math.random() * 20),
          extracted_memory: "User wants to test the system but needs an API key."
        };
      } else {
        const context = `
You are Cogniflow, a Self-Improving AI Agent.
IMPORTANT: You MUST reply in the following language: ${language || 'English'}.
System Persona / User Style: ${userStyle || 'standard'}. Adapt your response style, complexity, and vocabulary to match this persona.
If 'student', keep it simple, educational, and easy to understand.
If 'developer', provide technical details, code if needed, and be precise.
If 'researcher', be highly analytical, provide deeper context, and maintain academic rigor.
If 'executive', be concise, action-oriented, and provide high-level summaries.

User's Current Goals: ${userSession.goals.join(", ") || "None set"}
WARNING: If the user's latest message drifts or distracts from the stated goals, YOU MUST REMIND THEM about their goal by responding with exactly this phrase near the end of your response: "You've moved away from your goal. Want to refocus?" and politely steer the conversation back. Give a high drift_assessment score (e.g., 70-100) if they are completely off-topic.
If the user indicates they want to re-align or re-focus (e.g. "Yes, Re-align Me"), acknowledge it and provide an actionable step towards their goal.

User's Memories/Preferences: ${userSession.memories.join(", ") || "None"}
Past Feedback: ${userSession.feedbackLoop.length} items collected.

Analyze the user's message relative to their goals. 
Also provide an 'explanation' field (Explainable AI) that briefly explains *why* you are giving this response based on the goals and memory.
Crucially, apply the "Self-Awareness" feature: Analyze the user's raw input data, figure out how it could be improved or reframed, and generate an "improved_input" version. Your actual "response" MUST use this improved_input to give a better answer rather than just repeating the input.
Return JSON ONLY in this exact format:
{
  "response": "Your reply to the user here.",
  "improved_input": "The 'Self-Awareness' improved version of the user's raw input.",
  "explanation": "Explanation of your reasoning.",
  "confidence": "Your confidence score from 0-100 indicating how certain you are of this action.",
  "drift_assessment": "How much this deviates from their goals (0-100 integer)",
  "extracted_memory": "Any new preference or fact learned about the user (or empty string if none)"
}
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: [
            { role: 'user', parts: [{ text: context + "\n\nUser Message: " + message }] }
          ],
          config: {
            responseMimeType: "application/json"
          }
        });

        const text = response.text || "{}";
        parsed = JSON.parse(text);
      }

      // Self-Improvement & Memory update
      if (parsed.extracted_memory) {
        userSession.memories.push(parsed.extracted_memory);
      }
      
      // Generate mock shadow logs based on this query
      userSession.shadowLogs.unshift({
        query: message,
        winner: "Analytical Deep-Dive",
        confidence: parsed.confidence || Math.floor(Math.random() * 20) + 80
      });
      // Keep only recent 10 shadow logs
      if (userSession.shadowLogs.length > 10) userSession.shadowLogs.pop();
      
      // Update drift (simple moving average for prototype)
      const currentDrift = typeof parsed.drift_assessment === 'number' ? parsed.drift_assessment : parseInt(parsed.drift_assessment) || 0;
      userSession.driftScore = Math.round((userSession.driftScore + currentDrift) / 2);

      const aiMessage = {
        role: "agent",
        content: parsed.response,
        explanation: parsed.explanation,
        improved_input: parsed.improved_input,
        confidence: parsed.confidence || Math.floor(Math.random() * 15 + 85),
        timestamp: new Date()
      };
      userSession.chatHistory.push(aiMessage);

      res.json({
        reply: aiMessage.content,
        explanation: aiMessage.explanation,
        driftScore: userSession.driftScore,
        newMemory: parsed.extracted_memory
      });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Drift Detection
  app.get("/api/drift-detection", (req, res) => {
    // Return mock historical data plus current for visual graph
    const history = userSession.chatHistory.map((_, i) => ({
      step: i,
      drift: Math.random() * 20 + (i > 0 ? userSession.driftScore : 10) // Mocking historical variance for graph
    }));
    res.json({ currentScore: userSession.driftScore, history });
  });

  // 4. Memory
  app.get("/api/memory", (req, res) => {
    res.json({
      longTerm: userSession.memories,
      shortTerm: userSession.chatHistory.map(m => m.content)
    });
  });

  // 5. Feedback Loop
  app.post("/api/feedback", async (req, res) => {
    const { messageIndex, positive, reason } = req.body;
    
    if (messageIndex !== undefined && messageIndex >= 0 && messageIndex < userSession.chatHistory.length) {
      const msg = userSession.chatHistory[messageIndex] as any;
      msg.feedback = { positive, reason };
      
      // If negative feedback, we store why it failed and rewrite the prompt
      if (!positive && reason) {
        let originalPrompt = "Unknown";
        if (messageIndex > 0) {
          originalPrompt = userSession.chatHistory[messageIndex - 1].content;
        }

        const ai = getAI();
        if (ai) {
          try {
            const context = `The AI failed to answer properly to the original prompt: "${originalPrompt}". The failure reason provided is: "${reason}". Please rewrite the original user prompt so the AI will give a better, correct answer next time. Provide ONLY the rewritten prompt string, nothing else.`;
            const response = await ai.models.generateContent({
              model: "gemini-3.1-pro-preview",
              contents: [{ role: 'user', parts: [{ text: context }] }]
            });
            msg.feedback.rewritten_prompt = (response.text || "").replace(/^"|"$/g, "").trim();
          } catch (err) {
            msg.feedback.rewritten_prompt = `(Failed to rewrite) Try adding more context about: ${reason}`;
          }
        } else {
          msg.feedback.rewritten_prompt = `[Simulation] Please rewrite prompt focusing on: ${reason}`;
        }
      }
    } else if (req.body.query !== undefined) {
      // fallback for old feedback format
      userSession.feedbackLoop.push({ query: req.body.query, positive: req.body.positive });
    }
    
    res.json({ status: "optimized" });
  });

  app.get("/api/state", (req, res) => {
    res.json(userSession);
  });

  app.post("/api/reset", (req, res) => {
    userSession.goals = [];
    userSession.memories = [];
    userSession.chatHistory = [];
    userSession.feedbackLoop = [];
    userSession.driftScore = 0;
    userSession.shadowLogs = [];
    res.json({ status: "reset" });
  });


  // VITE MIDDLEWARE SETUP
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
