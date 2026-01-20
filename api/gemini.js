export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, imageBase64, mimeType, systemInstruction, responseMimeType, generationConfig } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY in server env" });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
      apiKey;

    const parts = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64
        }
      });
    }
    parts.push({ text: prompt });

    const bodyObj = {
      contents: [{ parts }]
    };

    if (systemInstruction) {
      bodyObj.systemInstruction = systemInstruction;
    }

    if (responseMimeType || generationConfig) {
      bodyObj.generationConfig = {
        responseMimeType: responseMimeType || "text/plain",
        ...generationConfig
      };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyObj),
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
