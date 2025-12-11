import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the client
// API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are 'Winn', a highly advanced AI business operations agent for NexusCore. 
Your goal is to assist merchants with cross-border e-commerce, CRM analysis, and content generation.
You are smarter, faster, and more integrated than standard support bots.
You have expertise in global banking protocols (SWIFT, SEPA, ACH), logistics, and multi-currency pricing.
Keep responses concise, professional, yet friendly. 
If asked about CRM data, simulate an analysis of high-value targets.
`;

export const sendMessageToWinn = async (
  history: ChatMessage[], 
  newMessage: string,
  contextData?: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct the prompt with context if available
    const prompt = contextData 
      ? `Context: ${contextData}\n\nUser Query: ${newMessage}` 
      : newMessage;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        tools: [{ googleSearch: {} }] // Enable search for real-time market rates or bank info
      }
    });

    return response.text || "I'm processing that global transaction data, but I couldn't generate a text response right now.";
  } catch (error) {
    console.error("Error talking to Winn:", error);
    return "I'm currently having trouble connecting to the NexusCore neural network. Please check your connection.";
  }
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a compelling, SEO-friendly product description for a "${productName}" in the category "${category}". Focus on cross-border appeal. Return ONLY the description text.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("GenAI Error:", error);
    return "Error generating description.";
  }
};

export const analyzeCustomerSegment = async (customerData: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this customer data list and suggest 3 actionable cross-selling strategies based on their location and LTV. Data: ${customerData}`,
            config: {
                thinkingConfig: { thinkingBudget: 1024 } // Use thinking for deeper analysis
            }
        });
        return response.text || "Analysis failed.";
    } catch (e) {
        return "Could not perform analysis.";
    }
}

export const generateMarketingContent = async (topic: string, type: 'Email' | 'SMS' | 'Social'): Promise<{subject: string, body: string}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate marketing copy for a ${type} campaign about "${topic}". Return JSON with keys "subject" (or title) and "body". Keep it punchy and sales-driven.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (e) {
    return { subject: "Error", body: "Could not generate content." };
  }
}

export const generateSEOData = async (content: string): Promise<{title: string, description: string, keywords: string[]}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following content and generate SEO metadata. 
      Content: "${content.substring(0, 500)}..."
      Return JSON with keys: "title" (max 60 chars), "description" (max 160 chars), and "keywords" (array of strings).`,
      config: {
        responseMimeType: "application/json"
      }
    });
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (e) {
    return { title: "", description: "", keywords: [] };
  }
}

export const generateViralPost = async (topic: string, platform: 'Twitter' | 'LinkedIn' | 'TikTok'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a viral, engaging social media post for ${platform} about: "${topic}". Use emojis, hashtags, and a hook that drives engagement.`,
    });
    return response.text || "Could not generate post.";
  } catch (e) {
    return "Error generating post.";
  }
}