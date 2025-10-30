import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS PODEŠAVANJE – dozvoljava samo tvoj Netlify sajt
app.use(
  cors({
    origin: ["https://zonebot-ultra.netlify.app"], // zameni ako tvoj Netlify link ima drugo ime
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.json({ limit: "2mb" }));

// ✅ Test ruta (da proveriš da li server radi)
app.get("/", (req, res) => {
  res.send("ZoneBot Ultra API is up ✅");
});

// ✅ Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
    res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Pokretanje servera
const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(`✅ ZoneBot Ultra API running on port ${PORT}`)
);
