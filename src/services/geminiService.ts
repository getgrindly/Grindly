import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

export async function evaluateCode(code: string, principles: string[]) {
  const prompt = `
    You are the Grindly Architect AI, a senior staff engineer at a high-scale tech firm. 
    Evaluate the following code based on these Software Engineering principles: ${principles.join(', ')}.
    
    Code:
    \`\`\`
    ${code}
    \`\`\`
    
    In your feedback, focus on:
    1. Architectural integrity (coupling, cohesion)
    2. Edge case handling
    3. Scalability (Big O, memory usage)
    4. Compliance with the specified principles.

    Provide feedback in the following JSON format:
    {
      "score": number (0-100),
      "maintainability": "string (High/Medium/Low)",
      "scalability": "string feedback",
      "suggestions": ["string suggestion 1", "string suggestion 2", ...],
      "refactoredCode": "string (the improved version of the user's code)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Evaluation failed:", error);
    return null;
  }
}

export async function getArchitectAdvice(context: string) {
  const prompt = `
    You are the Grindly Architect AI. 
    The user is currently studying: ${context}.
    Provide a professional, high-level engineering insight (max 3 sentences) about this topic that focuses on trade-offs and scalability.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text;
  } catch (error) {
    return "Keep grinding. Systems are temporary, logic is forever.";
  }
}
