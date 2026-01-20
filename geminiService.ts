
import { Language, LoanAdvisorResult } from "./types";

const getLangName = (lang: Language) => {
  const map: Record<string, string> = {
    en: 'English',
    hi: 'Hindi (Devanagari script)',
    mr: 'Marathi (Devanagari script)',
    pa: 'Punjabi (Gurmukhi script)',
    sa: 'Sanskrit (Devanagari script)'
  };
  return map[lang] || 'English';
};

/**
 * CROP DISEASE ANALYSIS
 */
export const analyzeCropDisease = async (
  imageBase64: string,
  location: string,
  soilType: string,
  language: Language = 'en'
) => {
  const targetLang = getLangName(language);
  const prompt = `Act as an expert Plant Pathologist. Analyze this crop image from ${location} with ${soilType} soil.
    Identify crop type and disease. MANDATORY: REPLY ENTIRELY IN ${targetLang}.
    STRICT RULE: Do not use Markdown in text fields. Use plain text only.
    Return JSON:
    {
      "cropName": string,
      "diseaseName": string,
      "confidence": number,
      "summary": string,
      "severity": "Low" | "Medium" | "High",
      "treatment": { "organic": string[], "chemical": string[] },
      "prevention": string[],
      "source": "gemini"
    }`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      imageBase64,
      mimeType: 'image/jpeg',
      responseMimeType: "application/json",
      generationConfig: { temperature: 0.1 }
    }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (text === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(text);
  }
  return JSON.parse(text);
};

/**
 * LIVESTOCK ANALYSIS
 */
export const analyzeLivestockDisease = async (
  imageBase64: string,
  animalType: string,
  language: Language = 'en'
) => {
  const targetLang = getLangName(language);
  const prompt = `Veterinary Expert. Analyze this ${animalType} health. MANDATORY: REPLY ENTIRELY IN ${targetLang}.
    STRICT RULE: Do not use Markdown in text fields. Use plain text only.
    Return JSON:
    {
      "conditionName": string,
      "confidence": string,
      "summary": string,
      "symptoms": string[],
      "treatment": string[],
      "prevention": string[],
      "vetAdvice": string
    }`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      imageBase64,
      mimeType: 'image/jpeg',
      responseMimeType: "application/json"
    }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (text === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(text);
  }
  return JSON.parse(text);
};

/**
 * CHATBOT ASSISTANT
 */
export const getGeminiChatResponse = async (message: string, mode: string, language: Language) => {
  const targetLang = getLangName(language);
  const systemInstruction = `Agriculture AI Assistant KissanSevaAI. Mode: ${mode}. MANDATORY: REPLY ONLY IN ${targetLang}. 
    STRICT RULES: DO NOT use Markdown formatting. No bold, no italics, no bullet stars, no hashtags. 
    Use simple numbering (1., 1.1) and colons for headings (Example: Topic:). Output plain text only.`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: message, systemInstruction }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (reply === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(reply);
  }
  return reply;
};

/**
 * MARKET RECOMMENDATIONS
 */
export const getMarketRecommendations = async (form: any, language: Language) => {
  const targetLang = getLangName(language);
  const prompt = `Market Strategist. Analyze farm: ${JSON.stringify(form)}. 
    MANDATORY: REPLY ENTIRELY IN ${targetLang}.
    STRICT RULES: DO NOT use Markdown formatting. No bold (**), no italics (*), no bullet stars (*), no # headings.
    Use plain text only. Use simple numbering like 1., 1.1 and colons for headings (Example: SWOT Analysis:).`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (reply === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(reply);
  }
  return reply;
};

/**
 * TRADER & BUYERS ADVISORY
 */
export const getTraderAdvisory = async (query: string, language: Language) => {
  const targetLang = getLangName(language);
  const prompt = `As a Trading Expert for Indian Farmers, respond to this query: "${query}". 
    Focus on market trends, reliable buyer practices, and price negotiation strategies. 
    MANDATORY: REPLY ENTIRELY IN ${targetLang}. Keep it actionable and concise.
    STRICT RULES: DO NOT use Markdown. No stars, no bolding, no hashes. Use plain text and simple numbering only.`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (reply === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(reply);
  }
  return reply;
};

/**
 * IOT DATA INTERPRETATION
 */
export const getIoTInsights = async (sensorData: any, language: Language) => {
  const targetLang = getLangName(language);
  const prompt = `Interpret these real-time farm sensor readings: ${JSON.stringify(sensorData)}.
    Provide 3 concise, actionable plain text points for the farmer.
    MANDATORY: REPLY ENTIRELY IN ${targetLang}.
    STRICT RULES: No Markdown, no bolding, no stars. Use simple numbering (1., 2., 3.).`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (reply === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(reply);
  }
  return reply;
};

/**
 * GOVERNMENT SCHEME RECOMMENDATIONS
 */
export const getSchemeRecommendations = async (form: any, language: Language) => {
  const targetLang = getLangName(language);
  const prompt = `Gov Schemes Expert. Recommend 3-5 schemes for: ${JSON.stringify(form)}. 
    MANDATORY: REPLY ENTIRELY IN ${targetLang}.
    STRICT RULES: DO NOT use Markdown. No stars, no bolding, no hashes. Use plain text and simple numbering only. Use colons for titles.`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (reply === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(reply);
  }
  return reply;
};

/**
 * CARBON CREDIT ESTIMATION
 */
export const estimateCarbonCredits = async (form: any, language: Language) => {
  const targetLang = getLangName(language);
  const prompt = `Carbon Credit Consultant. Estimate credits for: ${JSON.stringify(form)}. 
    MANDATORY: REPLY ENTIRELY IN ${targetLang}.
    STRICT RULES: DO NOT use Markdown formatting. No stars, no bolding, no hashes. Use plain text only. Use simple numbering.`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (reply === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(reply);
  }
  return reply;
};

/**
 * LOAN ADVISOR
 */
export const getLoanAdvice = async (form: any, language: Language): Promise<LoanAdvisorResult> => {
  const targetLang = getLangName(language);
  const prompt = `Indian Agri Loan Advisor. Analyze profile: ${JSON.stringify(form)}. 
    MANDATORY: ALL JSON VALUES IN ${targetLang}.
    STRICT RULE: Do not use Markdown in text strings.
    Return JSON matching schema for eligibilityLevel, recommendedLoan, amountRange, interest, documents, steps, and risk.`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      responseMimeType: "application/json"
    }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (text === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(text);
  }
  return JSON.parse(text) as LoanAdvisorResult;
};

/**
 * GENERIC VOICE FIELD EXTRACTION
 */
export const extractFieldsFromSpeech = async (text: string, fields: string[], language: Language) => {
  const targetLang = getLangName(language);
  const prompt = `You are a data extractor. Extract values for these keys [${fields.join(', ')}] from this spoken text: "${text}".
    Language context: ${targetLang}.
    Instructions:
    - If a value is missing, return null for that key.
    - If a value represents a soil type, normalize it to one of: 'Sandy', 'Loamy', 'Clay', 'Silty'.
    - Return a JSON object with strictly these keys: ${fields.join(', ')}.`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      responseMimeType: "application/json",
      generationConfig: { temperature: 0.1 }
    }),
  });

  if (!res.ok) {
    throw new Error("AI service is temporarily unavailable");
  }

  const data = await res.json();
  const textResponse = data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || data?.error?.message || "AI service is temporarily unavailable";
  if (textResponse === "AI service is temporarily unavailable" || data?.error) {
    throw new Error(textResponse);
  }
  return JSON.parse(textResponse);
};
