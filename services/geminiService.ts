
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSmartProductDescription = async (product: Product) => {
  if (!process.env.API_KEY) return product.description;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, persuasive 1-sentence marketing pitch for this product: ${product.name} - ${product.description}. Category: ${product.category}.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || product.description;
  } catch (error) {
    console.error("Gemini Error:", error);
    return product.description;
  }
};

export const getRecommendedProducts = async (query: string, allProducts: Product[]) => {
  if (!process.env.API_KEY) return allProducts.slice(0, 4);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given the user query "${query}", select the most relevant product IDs from this list: ${JSON.stringify(allProducts.map(p => ({ id: p.id, name: p.name, category: p.category })))}. Return only the IDs in a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const recommendedIds = JSON.parse(response.text || '[]');
    return allProducts.filter(p => recommendedIds.includes(p.id));
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  }
};
