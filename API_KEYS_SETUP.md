# 🔑 Complete API Keys Setup Guide

## 🤖 OpenAI API (Recommended - Best for Medical Context)

### Why OpenAI?
- **Context-aware**: Understands medical terminology and Ayurvedic concepts
- **Highly accurate**: Better than Google for specialized medical content
- **Cost-effective**: ~$0.0015 per 1K tokens (very cheap for translations)
- **Cultural understanding**: Better handles Sanskrit terms and cultural concepts

### Getting OpenAI API Key:

1. **Visit OpenAI Platform**: https://platform.openai.com/
2. **Sign up/Login** to your account
3. **Go to API Keys**: https://platform.openai.com/api-keys
4. **Create New Key**:
   - Click "Create new secret key"
   - Give it a name like "Diet App Translation"
   - Copy the key (you won't see it again!)
5. **Add Credits**: 
   - Go to "Billing" and add $5-10 credit
   - Translation costs are very low (~$0.10 for 1000 translations)

### Cost Example:
- 1000 medical term translations ≈ $0.15
- 10,000 UI translations ≈ $1.50
- Very affordable for a medical app!

---

## 🌐 Google Translate API

### Getting Google Translate API Key:

1. **Google Cloud Console**: https://console.cloud.google.com/
2. **Create Project**:
   - Click "New Project"
   - Name it "Diet App Translation"
   - Click "Create"
3. **Enable Translation API**:
   - Go to "APIs & Services" > "Library"
   - Search "Cloud Translation API"
   - Click "Enable"
4. **Create API Key**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated key
5. **Secure the Key** (Important!):
   - Click on the key name to edit
   - Under "API restrictions": Select "Restrict key"
   - Choose "Cloud Translation API"
   - Under "Application restrictions": Add your domain

### Cost:
- $20 per 1 million characters
- Very reasonable for production use

---

## 🔧 Quick Setup (5 Minutes)

### 1. Copy Environment File:
```bash
cp .env.example .env.local
```

### 2. Add Your Keys to `.env.local`:

**Option A: OpenAI Only (Recommended)**
```env
OPENAI_API_KEY=sk-your-openai-key-here
```

**Option B: Google Translate Only**
```env
GOOGLE_TRANSLATE_API_KEY=your-google-api-key-here
```

**Option C: Both (Best Setup)**
```env
OPENAI_API_KEY=sk-your-openai-key-here
GOOGLE_TRANSLATE_API_KEY=your-google-api-key-here
```

### 3. Test Your Setup:
- Start your dev server: `npm run dev`
- Go to any page and toggle language
- Check browser console for translation logs

---

## 🏥 Why OpenAI is Perfect for Medical Apps

### Context-Aware Medical Translation:
- **Input**: "Patient has vata dosha imbalance"
- **OpenAI**: "मरीज़ में वात दोष का असंतुलन है" (perfect medical context)
- **Google**: Often misses Ayurvedic context

### Ayurvedic Term Handling:
- **Understands**: Vata, Pitta, Kapha, Prakriti, Vikriti
- **Maintains**: Sanskrit terminology with proper explanations
- **Cultural**: Understands Indian medical concepts

### Sample Translations by OpenAI:
```
English: "Kapha constitution should avoid dairy"
Hindi: "कफ प्रकृति वाले व्यक्ति को डेयरी उत्पादों से बचना चाहिए"

English: "Agni (digestive fire) is weak"
Hindi: "अग्नि (पाचन शक्ति) कमजोर है"
```

---

## 💰 Cost Comparison

| Service | Cost | Best For | Setup Difficulty |
|---------|------|----------|------------------|
| **OpenAI** | $0.0015/1K tokens | Medical context | Easy |
| **Google** | $20/1M chars | General accuracy | Medium |
| **Azure** | Free tier available | Enterprise | Medium |
| **LibreTranslate** | Free | Basic translation | Easy |

---

## 🚀 Recommended Setup for Your Diet App

1. **Start with OpenAI** - Best for medical terminology
2. **Add Google as fallback** - For general text
3. **Keep local dictionary** - Instant common terms

This gives you:
- ✅ Perfect medical translations (OpenAI)
- ✅ Fast common terms (Local dictionary)
- ✅ Reliable fallback (Google)
- ✅ Very low cost ($5-10 will last months)

---

## 🔒 Security Best Practices

### For OpenAI:
- Use server-side API key (OPENAI_API_KEY)
- Don't expose in client-side code
- Set usage limits in OpenAI dashboard

### For Google:
- Restrict API key to your domain
- Enable only Translation API
- Monitor usage in Google Cloud Console

---

## 🐛 Troubleshooting

### OpenAI Issues:
- **"Invalid API key"**: Check key starts with "sk-"
- **"Insufficient quota"**: Add billing to your OpenAI account
- **"Rate limit"**: OpenAI has generous limits, wait a moment

### Google Issues:
- **"API not enabled"**: Enable Cloud Translation API
- **"Forbidden"**: Check API key restrictions
- **"Quota exceeded"**: Check Google Cloud billing

---

## 📱 Testing Your Setup

Once you have keys configured, test with:

1. **Simple test**: Toggle language on any page
2. **Medical test**: Translate "vata dosha imbalance"
3. **Food test**: Translate "khichdi with ghee"

The app will automatically use the best available service!

---

**Total setup time**: 5-10 minutes
**Monthly cost**: $1-5 for typical usage
**Translation quality**: Excellent for medical apps! 🏥✨
