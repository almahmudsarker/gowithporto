import { GeminiProvider } from "./geminiProvider";
import { buildTravelPrompt } from "./promptBuilder";
import { parseAIResponse } from "./responseParser";

const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);

export async function generateAIResponse({
  systemPrompt,
  userInput,
}: {
  systemPrompt: string;
  userInput: Record<string, any>;
}) {
  const prompt = buildTravelPrompt(systemPrompt, userInput);

  const result = await provider.generate({
    prompt,
    userInput,
  });

  return parseAIResponse(result.rawText);
}
