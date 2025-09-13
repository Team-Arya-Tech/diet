import { type NextRequest, NextResponse } from 'next/server';
import { openai, OPENAI_CONFIG } from '@/lib/openai-config';
import { getAllFoods, getAllCategories } from '@/lib/ayurvedic-data';
import { getPatients } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'en', patientId, context } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Get Ayurvedic context data
    const foods = getAllFoods();
    const categories = getAllCategories();
    const patients = getPatients();
    
    // Find specific patient if provided
    const patient = patientId ? patients.find(p => p.id === patientId) : null;

    // Build context for OpenAI
    let systemContext = OPENAI_CONFIG.systemPrompt;
    
    if (language === 'hi') {
      systemContext += `\n\nRespond in Hindi (Devanagari script) while maintaining professional medical terminology. Use simple, clear Hindi that patients can understand.`;
    }

    // Add patient-specific context if available
    if (patient) {
      systemContext += `\n\nPatient Context:
- Constitution: ${patient.constitution}
- Age: ${patient.age} years
- Gender: ${patient.gender}
- BMI: ${patient.bmi || 'Not calculated'}
- Current Conditions: ${patient.currentConditions.join(', ') || 'None specified'}
- Lifestyle: Activity Level - ${patient.lifestyle.activityLevel}, Stress Level - ${patient.lifestyle.stressLevel}, Sleep Hours - ${patient.lifestyle.sleepHours}
- Dietary Restrictions: ${patient.dietaryRestrictions.join(', ') || 'None'}
- Allergies: ${patient.allergies?.join(', ') || 'None'}

Please tailor your recommendations specifically for this patient's constitution and health profile.`;
    }

    // Add relevant food data context (sample of available foods)
    const sampleFoods = foods.slice(0, 20).map(food => 
      `${food.Food}: ${food.Rasa} taste, ${food.Veerya} potency, ${food["Dosha Effect"]}`
    ).join('; ');
    
    systemContext += `\n\nAvailable Ayurvedic Food Database (sample): ${sampleFoods}`;

    // Add seasonal context
    const currentMonth = new Date().getMonth();
    let season = 'general';
    if (currentMonth >= 2 && currentMonth <= 4) season = 'spring';
    else if (currentMonth >= 5 && currentMonth <= 7) season = 'summer';
    else if (currentMonth >= 8 && currentMonth <= 10) season = 'autumn';
    else season = 'winter';

    systemContext += `\n\nCurrent Season: ${season} - Please consider seasonal dietary recommendations.`;

    const completion = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: OPENAI_CONFIG.temperature,
      messages: [
        {
          role: 'system',
          content: systemContext,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response generated from OpenAI');
    }

    return NextResponse.json({
      response,
      language,
      patientId,
      timestamp: new Date().toISOString(),
      usage: completion.usage,
    });

  } catch (error) {
    console.error('OpenAI Chat API error:', error);
    
    // Return appropriate error message based on error type
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes('quota')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'OpenAI Chat API is running',
    model: OPENAI_CONFIG.model,
    supportedLanguages: ['en', 'hi'],
    features: [
      'Ayurvedic dietary guidance',
      'Constitution-based recommendations',
      'Seasonal dietary advice',
      'Patient-specific consultations',
      'Bilingual support (English/Hindi)',
    ],
  });
}
