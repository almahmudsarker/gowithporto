export function buildTravelPrompt(
  systemPrompt: string,
  userInput: Record<string, any>
) {
  return `
${systemPrompt}

User preferences for Porto trip:
- Duration: ${userInput.days} days
- Budget Level: ${userInput.budget}
- Travel Group: ${userInput.people}

CRITICAL: You must respond ONLY with a valid JSON object. Do not include any markdown formatting or extra text.
The JSON must follow this structure:
{
  "summary": "Short overview of the trip",
  "itinerary": [
    { "day": 1, "title": "Morning/Afternoon/Evening highlights", "activities": ["Activity 1", "Activity 2"] },
    ...
  ]
}
`;
}
