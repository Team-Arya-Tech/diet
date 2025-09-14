# Translation Setup Guide

Your diet app now supports multiple translation APIs with intelligent fallbacks. Here's how to set it up:

## Available Translation Services

### 1. Google Translate API (Recommended)
- **Accuracy**: Excellent for medical and general terms
- **Cost**: Pay-per-use, ~$20 per 1M characters
- **Setup**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Enable Cloud Translation API
  3. Create API key
  4. Add to `.env.local`: `GOOGLE_TRANSLATE_API_KEY=your_key_here`

### 2. Microsoft Azure Translator
- **Accuracy**: Very good for medical terminology
- **Cost**: Free tier available (2M characters/month)
- **Setup**:
  1. Go to [Azure Portal](https://portal.azure.com/)
  2. Create Translator resource
  3. Get key and region
  4. Add to `.env.local`:
     ```
     AZURE_TRANSLATOR_KEY=your_key_here
     AZURE_TRANSLATOR_REGION=your_region_here
     ```

### 3. LibreTranslate (Open Source)
- **Accuracy**: Good for basic translations
- **Cost**: Free (self-hosted) or minimal cost (hosted)
- **Setup**:
  1. Use public instance: `https://libretranslate.de`
  2. Or host your own
  3. Add to `.env.local`: `LIBRETRANSLATE_URL=https://libretranslate.de`

### 4. MyMemory Translation
- **Accuracy**: Basic but functional
- **Cost**: Free with limits (1000 words/day)
- **Setup**: No API key required, just add email for higher limits
- **Add to `.env.local**: `MYMEMORY_EMAIL=your_email@example.com`

## How It Works

1. **Local Dictionary First**: Uses built-in Ayurvedic terms dictionary for instant, accurate translations
2. **API Fallback**: If not found locally, tries APIs in order of preference
3. **Caching**: Results are cached to avoid repeated API calls
4. **Graceful Degradation**: Falls back to original text if all methods fail

## Setup Steps

1. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your API keys** (choose one or more):
   ```env
   # Google Translate (recommended)
   GOOGLE_TRANSLATE_API_KEY=your_google_key

   # Or Microsoft Translator
   AZURE_TRANSLATOR_KEY=your_azure_key
   AZURE_TRANSLATOR_REGION=eastus

   # Or LibreTranslate
   LIBRETRANSLATE_URL=https://libretranslate.de

   # Or MyMemory (free)
   MYMEMORY_EMAIL=your_email@example.com
   ```

3. **Test the translation**:
   - Toggle language in your app
   - Check browser console for translation logs
   - API endpoint available at: `http://localhost:3000/api/translate`

## Usage in Components

### Basic Translation (recommended)
```tsx
import { useTranslation } from "@/components/translation-provider"

const MyComponent = () => {
  const { t, language } = useTranslation()
  
  return (
    <div>
      <h1>{await t("Diet Plan", "ui")}</h1>
      <p>{await t("Create personalized diet charts", "medical")}</p>
    </div>
  )
}
```

### Advanced API Translation
```tsx
import { useAPITranslation } from "@/hooks/use-api-translation"

const MyComponent = () => {
  const { translateWithAPI, isTranslating } = useAPITranslation({
    fallbackToLocal: true
  })
  
  const handleTranslate = async () => {
    const result = await translateWithAPI(
      "Complex medical terminology here",
      "hi",
      "medical"
    )
    console.log(result.translatedText, result.service)
  }
}
```

## Cost Optimization Tips

1. **Use Local Dictionary First**: Most Ayurvedic terms are already included
2. **Enable Caching**: Translations are cached automatically
3. **Batch Translations**: Use `batchTranslate` for multiple texts
4. **Choose Right Service**: Start with free MyMemory, upgrade as needed
5. **Context Aware**: Provide context for better translations

## Monitoring

- Check browser console for translation logs
- Monitor API usage in respective dashboards
- Translation errors are logged and gracefully handled

## Troubleshooting

1. **No translations working**: Check `.env.local` file exists and has correct keys
2. **Slow translations**: Enable caching, check network
3. **Poor quality**: Try different API or improve context
4. **API limits exceeded**: Switch to different service or upgrade plan

Your app will work without any API keys using the built-in dictionary, but adding API keys will provide better translations for complex sentences.
