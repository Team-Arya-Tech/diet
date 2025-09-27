
import fs from 'fs'
import path from 'path'

// Use dynamic import for node-fetch (ESM compatibility)
const fetch = (...args: [any, ...any[]]) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_URL = 'http://localhost:3000/api/ai-generator/recipes';
const recipesJsonPath = path.join(__dirname, '../data/recipes.json');

async function main() {
  const prompt = process.argv[2] || '';
  const count = parseInt(process.argv[3] || '3', 10);

  console.log(`Requesting ${count} new recipes from LLM...`);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, count })
  });
  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorObj = JSON.parse(errorText);
      console.error('API error:', errorObj);
    } catch {
      console.error('API error:', errorText);
    }
    process.exit(1);
  }

  const raw = await (res.json() as Promise<any>);
  console.log('--- RAW LLM RESPONSE ---');
  console.log(JSON.stringify(raw, null, 2));
  const { recipes } = raw;
  if (!Array.isArray(recipes)) {
    console.error('No recipes returned!');
    process.exit(1);
  }
  console.log(`Received ${recipes.length} recipes. Appending to recipes.json...`);

  // Read the existing JSON file
  let existingRecipes: any[] = [];
  try {
    const jsonContent = await fs.promises.readFile(recipesJsonPath, "utf-8");
    existingRecipes = JSON.parse(jsonContent);
  } catch (err) {
    if ((err as any).code !== "ENOENT") throw err;
  }
  // Append new recipes
  const allRecipes = [...existingRecipes, ...recipes];
  // Write back to the JSON file
  await fs.promises.writeFile(recipesJsonPath, JSON.stringify(allRecipes, null, 2), "utf-8");

  console.log('Recipes appended successfully!');
}

main().catch(err => {
  console.error(err)
  process.exit(1)
});
