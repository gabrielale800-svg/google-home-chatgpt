import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint para Google Assistant
app.post("/webhook", async (req, res) => {
  try {
    const userMessage =
      req.body?.queryResult?.queryText || "No entendí tu mensaje.";

    // Llamada a OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // liviano y rápido
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No pude responder.";

    // Respuesta para Google Assistant
    return res.json({
      fulfillmentText: reply,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      fulfillmentText:
        "Hubo un error procesando tu consulta, intentá otra vez.",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor iniciado en puerto " + PORT));
