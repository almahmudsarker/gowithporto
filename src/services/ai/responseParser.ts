export function parseAIResponse(rawText: string) {
  try {
    // Clean up potential markdown formatting (```json ... ```)
    const jsonString = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("AI Parse Error:", error, "Raw text:", rawText);
    return {
      summary: rawText,
      itinerary: [],
      error: "Structured parsing failed"
    };
  }
}
