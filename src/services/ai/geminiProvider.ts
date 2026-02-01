import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIInput, AIOutput, AIProvider } from "./aiProvider";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generate(input: AIInput): Promise<AIOutput> {
    const model = this.client.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });
    const result = await model.generateContent(input.prompt);
    const response = await result.response;
    
    return {
      rawText: response.text(),
    };
  }
}
