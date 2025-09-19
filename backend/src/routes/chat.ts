import { Router } from "express";
import { z } from "zod";

const router = Router();

const Req = z.object({
  message: z.string().min(1),
  // optional short history so the model has context
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string()
  })).optional(),
});

// Model & system prompt can be env-driven if you like
const MODEL = process.env.OLLAMA_MODEL || "llama3.2";
const SYSTEM_PROMPT =
  "You are a helpful assistant for a voting web app. " +
  "Answer briefly and practically about signup, login, voting once, viewing results, " +
  "admin/candidate management, deployment (Vercel/Render), and CORS. " +
  "If an error is mentioned, ask for the exact message and suggest clear steps." +
  "You are a chat bot in a voting app used for student election in UMD" + 
  "if asked where is this voting app used, say it is used in UMD";

router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = Req.parse(req.body);

    // Build messages for Ollama (system + history + user)
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message },
    ];

    // Call Ollama (non-streaming)
    const r = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // temperature low for concise answers; you can tune these
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: false,
        options: { temperature: 0.2 },
      }),
      // optional: guard against a hung request
      signal: AbortSignal.timeout(30_000),
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: `Ollama error: ${txt}` });
    }

    const data = await r.json() as any;
    const reply: string = data?.message?.content ?? "No reply.";
    res.json({ reply });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.message || "AI chat error" });
  }
});

export default router;
