// app/api/ai-generator/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const preferences = await req.json();

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Generate an Ayurvedic recipe in strict JSON format matching this TypeScript interface:
          {
            "name": string,
            "ingredients": string[],
            "cookingMethod": string,
            "ayurvedicBenefits": string,
            "nutritionalInfo": {
              "calories": number,
              "protein": number,
              "carbs": number,
              "fat": number,
              "fiber": number
            },
            "cookingTime": string,
            "difficulty": "easy" | "medium" | "hard",
            "servings": number
          }
          User preferences: ${JSON.stringify(preferences)}`
        },
      ],
      response_format: { type: "json_object" }, // ensures valid JSON
    });

    const recipe = JSON.parse(response.choices[0].message?.content || "{}");
    return NextResponse.json({ recipe });
  } catch (error: any) {
    console.error("AI Generator error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
