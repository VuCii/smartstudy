import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateAIResponse(prompt: string) {
  try {
    console.log('Generating content with prompt:', prompt);
    
    const generationConfig: GenerationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const response = result.response;
    const text = response.text();
    console.log('Generated content:', text);
    return text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

