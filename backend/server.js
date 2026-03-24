require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GROQ_API_KEY;

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`, // ✅ FIXED
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("GROQ ERROR:", err.response?.data || err.message);
    res.json({ reply: "Error from AI" });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});