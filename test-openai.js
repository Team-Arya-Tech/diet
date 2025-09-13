// Simple OpenAI API key test script
const fs = require('fs');
const path = require('path');

// Read environment variables from .env.local
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        process.env[key.trim()] = value.trim();
      }
    });
  } catch (error) {
    console.error('Could not read .env.local file');
  }
}

async function testOpenAI() {
  try {
    loadEnv();
    
    console.log('Testing OpenAI API key...');
    console.log('API Key found:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
    
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in .env.local file');
      return;
    }

    console.log('API Key starts with:', process.env.OPENAI_API_KEY.substring(0, 10) + '...');
    console.log('Making a simple test request...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Say "Hello, OpenAI API is working!" and nothing else.' }
        ],
        max_tokens: 20,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ OpenAI API is working!');
      console.log('Response:', data.choices[0]?.message?.content);
    } else {
      console.error('❌ Error from OpenAI API:');
      console.error('Status:', response.status);
      console.error('Error:', data.error);
      
      if (data.error?.code === 'invalid_api_key') {
        console.error('Your API key is invalid or has been revoked.');
      } else if (data.error?.code === 'insufficient_quota') {
        console.error('You have exceeded your API quota or billing limit.');
      }
    }

  } catch (error) {
    console.error('❌ Network or other error:');
    console.error(error.message);
  }
}

testOpenAI();
