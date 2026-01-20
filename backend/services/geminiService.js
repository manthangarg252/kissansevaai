
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (prompt, systemInstruction) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { systemInstruction },
  });
  return response.text;
};

export const analyzeImage = async (imageBuffer, mimeType, prompt, schema) => {
  const imagePart = {
    inlineData: {
      data: imageBuffer.toString('base64'),
      mimeType,
    },
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [imagePart, { text: prompt }] },
    config: schema ? {
      responseMimeType: "application/json",
      responseSchema: schema
    } : {},
  });

  return schema ? JSON.parse(response.text) : response.text;
};

export const generateStructuredJSON = async (prompt, schema) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema
    },
  });
  return JSON.parse(response.text);
};
