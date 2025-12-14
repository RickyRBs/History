import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AiEnhanceResponse } from '../types';

const apiKey = process.env.API_KEY || '';

// Create a singleton instance if key exists, otherwise handle gracefully in calls
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const schema: Schema = {
  type: Type.OBJECT,
  properties: {
    expandedDescription: {
      type: Type.STRING,
      description: "A detailed paragraph explaining the subject matter, focusing on artistic technique and historical significance.",
    },
    historicalContext: {
      type: Type.STRING,
      description: "A brief note on what was happening in China or the world at this time that influenced this design.",
    },
    suggestedTags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 relevant short tags (e.g., dynasty, material, technique).",
    }
  },
  required: ["expandedDescription", "historicalContext", "suggestedTags"],
};

export const enhanceEntry = async (title: string, year: string, currentNotes: string): Promise<AiEnhanceResponse | null> => {
  if (!ai) {
    console.error("API Key not found");
    return null;
  }

  try {
    const prompt = `
      The user is creating a timeline of Chinese Porcelain (Cíqì).
      Topic: ${title}
      Time Period: ${year}
      User Notes: ${currentNotes}

      Please act as an expert art historian. Expand on the user's notes, provide historical context regarding design movements, and suggest tags.
      Focus on the aesthetics, kiln types (e.g., Jingdezhen, Longquan), and cultural significance.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a world-class expert in Chinese Art History and Ceramics."
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AiEnhanceResponse;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
