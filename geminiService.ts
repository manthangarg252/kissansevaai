
import { GoogleGenAI, Type } from "@google/genai";
import { Language, LoanAdvisorResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

  const result = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }, { text: prompt }] }],
    config: { responseMimeType: "application/json", temperature: 0.1 }
  });
  return JSON.parse(result.text || '{}');
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

  const result = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }, { text: prompt }] }],
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(result.text || '{}');
};

/**
 * CHATBOT ASSISTANT
 */
export const getGeminiChatResponse = async (message: string, mode: string, language: Language) => {
  const targetLang = getLangName(language);
  const systemInstruction = `Agriculture AI Assistant KissanSevaAI. Mode: ${mode}. MANDATORY: REPLY ONLY IN ${targetLang}. 
    STRICT RULES: DO NOT use Markdown formatting. No bold, no italics, no bullet stars, no hashtags. 
    Use simple numbering (1., 1.1) and colons for headings (Example: Topic:). Output plain text only.`;
  const result = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: { systemInstruction }
  });
  return result.text;
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
  const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
  return result.text;
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
  const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
  return result.text;
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
  const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
  return result.text;
};

/**
 * GOVERNMENT SCHEME RECOMMENDATIONS
 */
export const getSchemeRecommendations = async (form: any, language: Language) => {
  const targetLang = getLangName(language);
  const prompt = `Gov Schemes Expert. Recommend 3-5 schemes for: ${JSON.stringify(form)}. 
    MANDATORY: REPLY ENTIRELY IN ${targetLang}.
    STRICT RULES: DO NOT use Markdown. No stars, no bolding, no hashes. Use plain text and simple numbering only. Use colons for titles.`;
  const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
  return result.text;
};

/**
 * CARBON CREDIT ESTIMATION
 */
export const estimateCarbonCredits = async (form: any, language: Language) => {
  const targetLang = getLangName(language);
  const prompt = `Carbon Credit Consultant. Estimate credits for: ${JSON.stringify(form)}. 
    MANDATORY: REPLY ENTIRELY IN ${targetLang}.
    STRICT RULES: DO NOT use Markdown formatting. No stars, no bolding, no hashes. Use plain text only. Use simple numbering.`;
  const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
  return result.text;
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

  const result = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(result.text || '{}') as LoanAdvisorResult;
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

  const result = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: "application/json", temperature: 0.1 }
  });
  return JSON.parse(result.text || '{}');
};
