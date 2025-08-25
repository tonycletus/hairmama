# Quick Setup Guide - Hairmama AI

## 🚀 Get Started in 3 Steps

### Step 1: Get Your Free API Key
1. Go to [OpenRouter](https://openrouter.ai/)
2. Sign up for a free account
3. Get your API key from the dashboard

### Step 2: Add Your API Key
1. Open the `.env` file in your project root
2. Replace `your_openrouter_api_key_here` with your actual API key:

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Step 3: Test the AI Analysis
1. Start the development server: `npm run dev`
2. Go to `http://localhost:8080`
3. Sign up/login
4. Upload a hair photo
5. Click "Analyze Photo" to get AI results!

## 🎯 What You'll Get

- **Health Score**: 0-100% rating
- **Detailed Analysis**: Texture, density, moisture, damage, shine, scalp health
- **AI Recommendations**: Personalized care tips
- **Downloadable Report**: Save your analysis

## 📸 Best Photo Tips

- Use natural lighting
- Show hair clearly
- Take from multiple angles
- Avoid shadows

## 🔧 Troubleshooting

**"API key not configured" error?**
- Make sure your `.env` file has the correct API key
- Restart the development server after adding the key

**"Analysis failed" error?**
- Check your internet connection
- Try a different photo
- Make sure the photo shows hair clearly

## 💡 Free Models Used

The app automatically tries these free models:
1. `kimi-vl-a3b-thinking:free` (best for hair analysis)
2. `gemini-2.5-pro-exp:free`
3. `qwen2.5-vl-3b-instruct:free`
4. `llama-4-maverick:free`

## 🎉 You're Ready!

Your Hairmama AI is now ready to analyze hair photos and provide professional insights!
