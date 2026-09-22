
import { PrakritiState, VikritiState } from "../types";

// The Gemini call and its API key now live server-side, proxied through the
// shared dashboard proxy (see api/proxy.ts) - calling Gemini directly from the
// browser used to ship the API key in the public JS bundle.
const API_ROUTE = "/api/proxy";

export async function calculateVikriti(
  prakriti: PrakritiState,
  symptoms: string[],
  currentFeeling: string
): Promise<VikritiState> {
  const prompt = `
    Analyze this person's Ayurvedic state.
    Prakriti (Natural State): Vata ${prakriti.vata}%, Pitta ${prakriti.pitta}%, Kapha ${prakriti.kapha}%.
    Current Symptoms: ${symptoms.join(", ")}
    Current Feeling: "${currentFeeling}"

    Based on these inputs, estimate their Vikriti (Current State) as percentages.
    Compare the Vikriti to the Prakriti to calculate an "imbalanceScore" (0-100, where 0 is perfect alignment and 100 is severe imbalance).
    Provide 3 specific non-medical, educational lifestyle shifts.
  `;

  const response = await fetch(API_ROUTE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            vata: { type: "NUMBER", description: 'Vikriti Vata %' },
            pitta: { type: "NUMBER", description: 'Vikriti Pitta %' },
            kapha: { type: "NUMBER", description: 'Vikriti Kapha %' },
            imbalanceScore: { type: "NUMBER", description: '0-100 score' },
            lifestyleShifts: {
              type: "ARRAY",
              items: { type: "STRING" },
              minItems: 3,
              maxItems: 3
            }
          },
          required: ["vata", "pitta", "kapha", "imbalanceScore", "lifestyleShifts"]
        }
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Vikriti request failed with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }
  return JSON.parse(text);
}
