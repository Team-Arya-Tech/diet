import { NextRequest, NextResponse } from 'next/server'

// You need to set your OpenAI API key in your environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// The Recipe interface (should match your lib/recipe-intelligence.ts)
// ...existing code...

export async function POST(req: NextRequest) {
  const { prompt, count = 1 } = await req.json()

  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not set.' }, { status: 500 })
  }

  // Build the system prompt for the LLM
  const systemPrompt = `You are an expert Ayurvedic nutritionist and chef. You must generate a JSON array of ${count} unique, authentic, and nutritionally balanced Ayurvedic recipes. Strictly output a compact, minified JSON array of Recipe objects only—no newlines, no extra spaces, no markdown, and no explanations. Each recipe must strictly follow this TypeScript interface:

interface Recipe {
  id: string // unique, e.g. 'recipe-003'
  name: string
  description: string
  cuisine: string
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverage'
  ingredients: Array<{ id: string, name: string, quantity: number, unit: string, notes?: string, ayurvedicRole?: 'main' | 'spice' | 'garnish' | 'base' }>
  cookingSteps: Array<{ stepNumber: number, instruction: string, duration?: number, temperature?: string, ayurvedicTip?: string }>
  prepTime: number
  cookTime: number
  totalTime: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  skillsRequired: string[]
  ayurvedicProperties: {
    primaryRasa: string[]
    secondaryRasa: string[]
    virya: 'heating' | 'cooling' | 'neutral'
    vipaka: 'sweet' | 'sour' | 'pungent'
    doshaEffect: { vata: 'increases' | 'decreases' | 'balances' | 'neutral', pitta: 'increases' | 'decreases' | 'balances' | 'neutral', kapha: 'increases' | 'decreases' | 'balances' | 'neutral' }
    constitution: string[]
    season: string[]
    timeOfDay: string[]
    digestibility: 'easy' | 'moderate' | 'heavy'
  }
  nutritionalInfo: {
    caloriesPerServing: number
    protein: number
    carbohydrates: number
    fat: number
    fiber: number
    sugar: number
    sodium: number
    potassium: number
    calcium: number
    iron: number
    vitamins: { [key: string]: number }
  }
  ayurvedicGuidelines: Array<{ principle: string, description: string, benefits: string[], application: string }>
  variations?: Array<{ name: string, changes: string[], ayurvedicBenefit: string }>
  tags: string[]
  healthBenefits: string[]
  contraindications?: string[]
  source: 'traditional' | 'modern' | 'fusion'
  region?: string
}

Here is an example of a valid Recipe object:
[
  {
    "id": "recipe-001",
    "name": "Moong Dal Dosa",
    "description": "A high-protein, nutritious breakfast dish made from soaked and ground moong dal (green gram) and mild spices. Easy to digest and light on the stomach.",
    "cuisine": "Ayurvedic",
    "category": "breakfast",
    "ingredients": [
      { "id": "i1", "name": "moong dal", "quantity": 1, "unit": "cup", "ayurvedicRole": "main" },
      { "id": "i2", "name": "rice", "quantity": 0.25, "unit": "cup", "ayurvedicRole": "base" },
      { "id": "i3", "name": "cumin seeds", "quantity": 1, "unit": "tsp", "ayurvedicRole": "spice" },
      { "id": "i4", "name": "ginger", "quantity": 1, "unit": "inch", "ayurvedicRole": "spice" },
      { "id": "i5", "name": "water", "quantity": 2, "unit": "cups" },
      { "id": "i6", "name": "ghee", "quantity": 1, "unit": "tbsp", "ayurvedicRole": "garnish" }
    ],
    "cookingSteps": [
      { "stepNumber": 1, "instruction": "Soak moong dal and rice overnight.", "duration": 720 },
      { "stepNumber": 2, "instruction": "Drain and grind with cumin seeds and ginger to make a batter.", "duration": 15 },
      { "stepNumber": 3, "instruction": "Heat a pan, pour a ladle of batter and spread it. Cook until golden brown and flip the dosa.", "duration": 5, "temperature": "medium", "ayurvedicTip": "Cook on a medium flame to retain nutrients." },
      { "stepNumber": 4, "instruction": "Drizzle ghee on top and serve hot.", "duration": 1 }
    ],
    "prepTime": 10,
    "cookTime": 20,
    "totalTime": 30,
    "servings": 4,
    "difficulty": "easy",
    "skillsRequired": ["Grinding", "Frying"],
    "ayurvedicProperties": {
      "primaryRasa": ["sweet"],
      "secondaryRasa": ["pungent"],
      "virya": "cooling",
      "vipaka": "sweet",
      "doshaEffect": { "vata": "balances", "pitta": "balances", "kapha": "balances" },
      "constitution": ["Vata", "Pitta", "Kapha"],
      "season": ["Summer", "Spring"],
      "timeOfDay": ["Morning"],
      "digestibility": "easy"
    },
    "nutritionalInfo": {
      "caloriesPerServing": 150,
      "protein": 10,
      "carbohydrates": 20,
      "fat": 3,
      "fiber": 4,
      "sugar": 1,
      "sodium": 15,
      "potassium": 200,
      "calcium": 30,
      "iron": 2,
      "vitamins": { "Vitamin C": 4, "Vitamin A": 100 }
    },
    "ayurvedicGuidelines": [
      { "principle": "Agni", "description": "Enhances digestive fire", "benefits": ["Improves digestion", "Aids nutrient absorption"], "application": "Eat warm and freshly cooked." },
      { "principle": "Ojas", "description": "Nourishes the body", "benefits": ["Promotes strength", "Boosts immunity"], "application": "Consume as a part of a balanced diet." }
    ],
    "tags": ["High protein", "Breakfast", "Vegetarian", "Gluten-free"],
    "healthBenefits": ["High in protein", "Boosts digestive health", "Rich in vitamins"],
    "source": "traditional",
    "region": "South India"
  }
]

Strictly output only a valid, compact, minified JSON array of Recipe objects, following the above example. Do not include any explanation, markdown, or ingredient-only lists. The recipes should be original and not duplicates of existing ones. Each object in the array must have at least the following keys: id, name, description, cuisine, category, ingredients, cookingSteps, prepTime, cookTime, totalTime, servings, difficulty, skillsRequired, ayurvedicProperties, nutritionalInfo, ayurvedicGuidelines, tags, healthBenefits, source. ${prompt ? `Focus on: ${prompt}` : ''}`

  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${count} full, unique, authentic Ayurvedic recipes as a JSON array of Recipe objects, not just ingredients. Each object must have all required fields as per the interface. Do not output only ingredients or partial recipes. ${prompt ? `Focus on: ${prompt}` : ''}` }
      ],
      max_tokens: 3000,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const error = await response.text()
    return NextResponse.json({ error }, { status: 500 })
  }

  const data = await response.json();
  let recipes: any[] = [];
  let rawText = '';
  try {
    let text = data.choices[0].message.content.trim();
    rawText = text;
    // Log the raw LLM response for debugging
    console.log('--- RAW LLM RESPONSE ---');
    console.log(text);
    // Remove markdown code block if present
    if (text.startsWith('```')) {
      text = text.replace(/^```[a-zA-Z]*\n/, '').replace(/```$/, '').trim();
    }
    // Remove all escaped newlines
    text = text.replace(/\\n/g, '');
    // Remove any leading/trailing single quotes
    text = text.replace(/^'/, '').replace(/'$/, '');
    // Remove any leading/trailing backticks
    text = text.replace(/^`/, '').replace(/`$/, '');
    // Remove any trailing commas before closing brackets
    text = text.replace(/,\s*([\]}])/g, '$1');
    // If text looks like a JSON array, parse directly
    let parsed;
    if (text.trim().startsWith('[') && text.trim().endsWith(']')) {
      parsed = JSON.parse(text);
    } else {
      // fallback: try to parse as stringified JSON
      parsed = JSON.parse(text);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
    }
    // Validate: must be an array of objects with required keys
    if (!Array.isArray(parsed) || !parsed.every(obj => obj && typeof obj === 'object' && obj.name && obj.description && obj.ingredients && obj.cookingSteps)) {
      return NextResponse.json({ error: 'LLM did not return full recipes. Raw:', raw: text }, { status: 500 });
    }
    recipes = parsed;
  } catch (e) {
    console.error('Failed to parse LLM response as JSON:', e);
    return NextResponse.json({ error: (e instanceof Error ? e.message : String(e)), raw: rawText }, { status: 500 });
  }

  return NextResponse.json({ recipes });
}
