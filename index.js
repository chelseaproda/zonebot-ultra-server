import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "2mb" }));

app.get("/", (req, res) => res.send("ZoneBot Ultra API is up ✅"));

// Text chat
app.post("/api/chat", async (req, res) => {
  const message = (req.body && req.body.message) ? String(req.body.message) : "";
  if (!process.env.OPENAI_API_KEY) {
    return res.status(400).json({ error: "Missing OPENAI_API_KEY on server" });
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        max_tokens: 800,
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: "OpenAI error", details: data });
    }
    const reply = data?.choices?.[0]?.message?.content ?? "(no reply)";
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// Image generation
app.post("/api/image", async (req, res) => {
  const prompt = (req.body && req.body.prompt) ? String(req.body.prompt) : "";
  if (!process.env.OPENAI_API_KEY) {
    return res.status(400).json({ error: "Missing OPENAI_API_KEY on server" });
  }
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024"
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ error: "OpenAI error", details: data });
    }
    const url = data?.data?.[0]?.url ?? null;
    res.json({ image: url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ ZoneBot Ultra API running on http://localhost:${PORT}`));
