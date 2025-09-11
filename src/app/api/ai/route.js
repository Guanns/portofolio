// src/app/api/ai/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge"; // cepat di Vercel Edge

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Model cepat & murah. Bisa ganti ke "gemini-1.5-pro" kalau mau lebih pintar.
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const system = (process.env.AI_SYSTEM_PROMPT || "You are a concise, helpful assistant.").trim();

    // gabung system + history (simple chat format)
    const historyText = messages
      .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = `${system}\n\n${historyText}\nAssistant:`;

    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || "Sorry, I can’t reply right now.";

    return new Response(JSON.stringify({ reply: text }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || "Server error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}