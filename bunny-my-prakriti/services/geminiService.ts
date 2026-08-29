
import { GoogleGenAI, Type } from "@google/genai";
import { PrakritiState, VikritiState } from "../types";

export async function calculateVikriti(
  prakriti: PrakritiState,
  symptoms: string[],
  currentFeeling: string
): Promise<VikritiState> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this person's Ayurvedic state.
    Prakriti (Natural State): Vata ${prakriti.vata}%, Pitta ${prakriti.pitta}%, Kapha ${prakriti.kapha}%.
    Current Symptoms: ${symptoms.join(", ")}
    Current Feeling: "${currentFeeling}"

    Based on these inputs, estimate their Vikriti (Current State) as percentages. 
    Compare the Vikriti to the Prakriti to calculate an "imbalanceScore" (0-100, where 0 is perfect alignment and 100 is severe imbalance).
    Provide 3 specific non-medical, educational lifestyle shifts.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          vata: { type: Type.NUMBER, description: 'Vikriti Vata %' },
          pitta: { type: Type.NUMBER, description: 'Vikriti Pitta %' },
          kapha: { type: Type.NUMBER, description: 'Vikriti Kapha %' },
          imbalanceScore: { type: Type.NUMBER, description: '0-100 score' },
          lifestyleShifts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 3,
            maxItems: 3
          }
        },
        required: ["vata", "pitta", "kapha", "imbalanceScore", "lifestyleShifts"]
      }
    }
  });

  return JSON.parse(response.text);
}
