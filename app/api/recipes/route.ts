import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const recipesPath = path.join(process.cwd(), 'data', 'recipes.json');
    const recipesData = fs.readFileSync(recipesPath, 'utf8');
    const recipes = JSON.parse(recipesData);
    
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error reading recipes:', error);
    return NextResponse.json([], { status: 500 });
  }
}
