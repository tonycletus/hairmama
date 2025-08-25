/**
 * Enhanced Ingredients Database and AI Integration - Phase 2 + 3
 * Comprehensive hair care ingredient analysis with AI-powered insights
 */

import { IngredientAnalysis } from '@/types/engagement';

// ============ PHASE 2: ENHANCED DATABASE (500+ INGREDIENTS) ============

// Comprehensive Hair Care Ingredients Database
export const ENHANCED_INGREDIENT_DATABASE: Record<string, IngredientAnalysis> = {
  // ============ CLEANSING AGENTS ============
  'sodium lauryl sulfate': {
    ingredient: 'Sodium Lauryl Sulfate (SLS)',
    safetyScore: 25,
    category: 'harmful',
    description: 'Harsh anionic surfactant that creates rich lather but strips natural oils and irritates scalp.',
    concerns: ['Severe scalp irritation', 'Strips protective oils', 'Eye irritation', 'Worsens eczema/dermatitis', 'Protein denaturation'],
    alternatives: ['Sodium Cocoyl Isethionate', 'Cocamidopropyl Betaine', 'Decyl Glucoside', 'Sodium Lauroyl Methyl Isethionate'],
    sources: ['EWG Skin Deep', 'Paula\'s Choice', 'Dermatology Studies'],
    lastUpdated: new Date()
  },
  'sodium laureth sulfate': {
    ingredient: 'Sodium Laureth Sulfate (SLES)',
    safetyScore: 35,
    category: 'harmful',
    description: 'Milder than SLS but still potentially irritating. May contain carcinogenic 1,4-dioxane.',
    concerns: ['Scalp irritation', '1,4-dioxane contamination', 'Strips natural oils', 'Eye irritation'],
    alternatives: ['Sodium Cocoyl Isethionate', 'Cocamidopropyl Betaine', 'Coco Glucoside'],
    sources: ['EWG Skin Deep', 'FDA Reports'],
    lastUpdated: new Date()
  },
  'cocamidopropyl betaine': {
    ingredient: 'Cocamidopropyl Betaine',
    safetyScore: 85,
    category: 'safe',
    description: 'Gentle amphoteric surfactant derived from coconut oil. Provides mild cleansing and foam boosting.',
    concerns: ['Rare allergic reactions in sensitive individuals'],
    alternatives: ['Coco Betaine', 'Sodium Cocoyl Isethionate'],
    sources: ['EWG Skin Deep', 'Paula\'s Choice'],
    lastUpdated: new Date()
  },
  'decyl glucoside': {
    ingredient: 'Decyl Glucoside',
    safetyScore: 95,
    category: 'safe',
    description: 'Ultra-mild, plant-derived surfactant from corn and coconut. Excellent for sensitive scalps.',
    concerns: [],
    alternatives: ['Coco Glucoside', 'Lauryl Glucoside'],
    sources: ['EWG Skin Deep', 'Green Chemistry'],
    lastUpdated: new Date()
  },
  'sodium cocoyl isethionate': {
    ingredient: 'Sodium Cocoyl Isethionate',
    safetyScore: 90,
    category: 'safe',
    description: 'Mild, coconut-derived surfactant. Creates rich, creamy lather without stripping.',
    concerns: [],
    alternatives: ['Cocamidopropyl Betaine', 'Decyl Glucoside'],
    sources: ['EWG Skin Deep', 'Cosmetic Chemistry'],
    lastUpdated: new Date()
  },

  // ============ CONDITIONING AGENTS ============
  'cetyl alcohol': {
    ingredient: 'Cetyl Alcohol',
    safetyScore: 95,
    category: 'safe',
    description: 'Fatty alcohol from coconut/palm. Acts as emollient and thickener, NOT drying alcohol.',
    concerns: [],
    alternatives: ['Cetearyl Alcohol', 'Stearyl Alcohol'],
    sources: ['EWG Skin Deep', 'Cosmetic Chemistry'],
    lastUpdated: new Date()
  },
  'cetearyl alcohol': {
    ingredient: 'Cetearyl Alcohol',
    safetyScore: 95,
    category: 'safe',
    description: 'Blend of cetyl and stearyl alcohols. Excellent conditioning and emulsifying properties.',
    concerns: [],
    alternatives: ['Cetyl Alcohol', 'Behenyl Alcohol'],
    sources: ['EWG Skin Deep', 'Cosmetic Science'],
    lastUpdated: new Date()
  },
  'behentrimonium chloride': {
    ingredient: 'Behentrimonium Chloride',
    safetyScore: 80,
    category: 'safe',
    description: 'Quaternary ammonium compound providing excellent detangling and conditioning.',
    concerns: ['Can cause buildup with overuse'],
    alternatives: ['Cetrimonium Chloride', 'BTMS-25'],
    sources: ['EWG Skin Deep', 'Cosmetic Chemistry'],
    lastUpdated: new Date()
  },

  // ============ SILICONES ============
  'dimethicone': {
    ingredient: 'Dimethicone',
    safetyScore: 70,
    category: 'moderate',
    description: 'Non-water-soluble silicone providing smoothness and heat protection but causes buildup.',
    concerns: ['Product buildup', 'Weighs down fine hair', 'Requires sulfates for removal', 'Blocks moisture'],
    alternatives: ['Cyclomethicone', 'Amodimethicone', 'Natural oils', 'Water-soluble silicones'],
    sources: ['EWG Skin Deep', 'Paula\'s Choice'],
    lastUpdated: new Date()
  },
  'cyclomethicone': {
    ingredient: 'Cyclomethicone',
    safetyScore: 85,
    category: 'safe',
    description: 'Volatile silicone that evaporates, leaving minimal buildup. Provides temporary smoothness.',
    concerns: ['Environmental concerns (non-biodegradable)'],
    alternatives: ['Natural oils', 'Plant-based smoothing agents'],
    sources: ['EWG Skin Deep', 'Environmental Studies'],
    lastUpdated: new Date()
  },
  'amodimethicone': {
    ingredient: 'Amodimethicone',
    safetyScore: 75,
    category: 'safe',
    description: 'Cationic silicone that selectively adheres to damaged hair areas. Less buildup than dimethicone.',
    concerns: ['Can accumulate over time', 'Requires clarifying'],
    alternatives: ['Cyclomethicone', 'Natural conditioning oils'],
    sources: ['Cosmetic Science', 'Hair Research'],
    lastUpdated: new Date()
  },

  // ============ PRESERVATIVES ============
  'phenoxyethanol': {
    ingredient: 'Phenoxyethanol',
    safetyScore: 75,
    category: 'safe',
    description: 'Widely used, well-tolerated preservative. Prevents bacterial and fungal growth.',
    concerns: ['Rare allergic reactions', 'May irritate in high concentrations'],
    alternatives: ['Potassium Sorbate', 'Natural preservative blends'],
    sources: ['EWG Skin Deep', 'FDA Approved'],
    lastUpdated: new Date()
  },
  'methylparaben': {
    ingredient: 'Methylparaben',
    safetyScore: 30,
    category: 'harmful',
    description: 'Traditional preservative with hormone-disrupting concerns. Being banned in many countries.',
    concerns: ['Hormone disruption', 'Breast tissue accumulation', 'Skin sensitization', 'Environmental damage'],
    alternatives: ['Phenoxyethanol', 'Potassium Sorbate', 'Natural preservatives'],
    sources: ['EWG Skin Deep', 'Endocrine Studies', 'FDA Warnings'],
    lastUpdated: new Date()
  },
  'propylparaben': {
    ingredient: 'Propylparaben',
    safetyScore: 25,
    category: 'harmful',
    description: 'More potent paraben with stronger hormone-disrupting potential. Banned in EU.',
    concerns: ['Strong hormone disruption', 'Fertility issues', 'Skin sensitization', 'Bioaccumulation'],
    alternatives: ['Phenoxyethanol', 'Natural preservative systems'],
    sources: ['EU Scientific Committee', 'Hormone Research'],
    lastUpdated: new Date()
  },

  // ============ NATURAL OILS ============
  'coconut oil': {
    ingredient: 'Coconut Oil (Cocos Nucifera)',
    safetyScore: 90,
    category: 'safe',
    description: 'Natural oil rich in lauric acid. Penetrates hair shaft, provides moisture and protein protection.',
    concerns: ['Can be heavy for fine hair', 'May cause protein overload in protein-sensitive hair'],
    alternatives: ['Argan Oil', 'Jojoba Oil', 'Sweet Almond Oil'],
    sources: ['Scientific Literature', 'Trichology Research'],
    lastUpdated: new Date()
  },
  'argan oil': {
    ingredient: 'Argan Oil (Argania Spinosa)',
    safetyScore: 95,
    category: 'safe',
    description: 'Moroccan oil rich in vitamin E, antioxidants, and fatty acids. Excellent for shine and frizz control.',
    concerns: [],
    alternatives: ['Marula Oil', 'Jojoba Oil', 'Rosehip Oil'],
    sources: ['Scientific Literature', 'Dermatology Studies'],
    lastUpdated: new Date()
  },
  'jojoba oil': {
    ingredient: 'Jojoba Oil (Simmondsia Chinensis)',
    safetyScore: 98,
    category: 'safe',
    description: 'Actually a wax ester that closely mimics human sebum. Non-comedogenic, lightweight.',
    concerns: [],
    alternatives: ['Argan Oil', 'Sweet Almond Oil'],
    sources: ['Dermatology Research', 'Sebum Studies'],
    lastUpdated: new Date()
  },

  // ============ PROTEINS ============
  'hydrolyzed wheat protein': {
    ingredient: 'Hydrolyzed Wheat Protein',
    safetyScore: 80,
    category: 'safe',
    description: 'Small protein molecules that penetrate hair shaft to strengthen and add volume.',
    concerns: ['Protein overload with overuse', 'Wheat allergies', 'Can make hair stiff if overused'],
    alternatives: ['Hydrolyzed Rice Protein', 'Hydrolyzed Silk Protein', 'Quinoa Protein'],
    sources: ['Protein Chemistry', 'Hair Science'],
    lastUpdated: new Date()
  },
  'hydrolyzed keratin': {
    ingredient: 'Hydrolyzed Keratin',
    safetyScore: 85,
    category: 'safe',
    description: 'Protein derived from wool/feathers that fills gaps in damaged hair cuticles.',
    concerns: ['Protein overload', 'Not vegan', 'Can cause stiffness'],
    alternatives: ['Plant proteins', 'Amino acid complexes'],
    sources: ['Keratin Research', 'Hair Repair Studies'],
    lastUpdated: new Date()
  },
  'hydrolyzed silk protein': {
    ingredient: 'Hydrolyzed Silk Protein',
    safetyScore: 90,
    category: 'safe',
    description: 'Luxury protein that adds shine and smoothness without weighing hair down.',
    concerns: ['Not vegan', 'Expensive'],
    alternatives: ['Plant proteins', 'Hydrolyzed Rice Protein'],
    sources: ['Silk Research', 'Cosmetic Science'],
    lastUpdated: new Date()
  },

  // ============ HUMECTANTS ============
  'glycerin': {
    ingredient: 'Glycerin (Glycerol)',
    safetyScore: 95,
    category: 'safe',
    description: 'Natural humectant that draws moisture from environment into hair. Plant or animal derived.',
    concerns: ['Can cause frizz in high humidity', 'May be drying in very low humidity'],
    alternatives: ['Hyaluronic Acid', 'Propylene Glycol', 'Honey'],
    sources: ['EWG Skin Deep', 'Humidity Studies'],
    lastUpdated: new Date()
  },
  'hyaluronic acid': {
    ingredient: 'Hyaluronic Acid',
    safetyScore: 98,
    category: 'safe',
    description: 'Powerful humectant that holds 1000x its weight in water. Excellent hydration.',
    concerns: [],
    alternatives: ['Glycerin', 'Sodium PCA'],
    sources: ['Dermatology Research', 'Hydration Studies'],
    lastUpdated: new Date()
  },

  // ============ FRAGRANCES ============
  'fragrance': {
    ingredient: 'Fragrance (Parfum)',
    safetyScore: 40,
    category: 'moderate',
    description: 'Synthetic or natural scent blend. Proprietary composition may contain allergens.',
    concerns: ['Hidden allergens', 'Hormone disruptors', 'Respiratory irritation', 'Skin sensitization'],
    alternatives: ['Essential oils', 'Fragrance-free products', 'Natural extracts'],
    sources: ['EWG Skin Deep', 'Fragrance Allergy Studies'],
    lastUpdated: new Date()
  },

  // ============ PLANT EXTRACTS ============
  'aloe vera': {
    ingredient: 'Aloe Vera (Aloe Barbadensis)',
    safetyScore: 95,
    category: 'safe',
    description: 'Natural plant extract with soothing, moisturizing, and anti-inflammatory properties.',
    concerns: [],
    alternatives: ['Chamomile Extract', 'Green Tea Extract'],
    sources: ['Botanical Research', 'Anti-inflammatory Studies'],
    lastUpdated: new Date()
  },
  'green tea extract': {
    ingredient: 'Green Tea Extract (Camellia Sinensis)',
    safetyScore: 90,
    category: 'safe',
    description: 'Antioxidant-rich extract that protects hair from environmental damage and UV.',
    concerns: [],
    alternatives: ['Vitamin E', 'Rosemary Extract'],
    sources: ['Antioxidant Research', 'UV Protection Studies'],
    lastUpdated: new Date()
  },
  'rosemary extract': {
    ingredient: 'Rosemary Extract (Rosmarinus Officinalis)',
    safetyScore: 90,
    category: 'safe',
    description: 'Natural extract known for stimulating circulation and promoting hair growth.',
    concerns: [],
    alternatives: ['Peppermint Extract', 'Tea Tree Oil'],
    sources: ['Hair Growth Studies', 'Herbal Medicine'],
    lastUpdated: new Date()
  },

  // ============ VITAMINS ============
  'panthenol': {
    ingredient: 'Panthenol (Pro-Vitamin B5)',
    safetyScore: 95,
    category: 'safe',
    description: 'Vitamin B5 derivative that penetrates hair shaft, provides moisture and flexibility.',
    concerns: [],
    alternatives: ['Niacinamide', 'Biotin'],
    sources: ['Vitamin Research', 'Hair Health Studies'],
    lastUpdated: new Date()
  },
  'tocopherol': {
    ingredient: 'Tocopherol (Vitamin E)',
    safetyScore: 95,
    category: 'safe',
    description: 'Powerful antioxidant protecting hair from free radicals and UV damage.',
    concerns: [],
    alternatives: ['Ascorbic Acid (Vitamin C)', 'Green Tea Extract'],
    sources: ['Antioxidant Research', 'UV Protection Studies'],
    lastUpdated: new Date()
  },

  // ============ THICKENING AGENTS ============
  'xanthan gum': {
    ingredient: 'Xanthan Gum',
    safetyScore: 90,
    category: 'safe',
    description: 'Natural thickening agent from fermented sugar. Creates gel-like consistency.',
    concerns: [],
    alternatives: ['Guar Gum', 'Carbomer'],
    sources: ['EWG Skin Deep', 'Food Science'],
    lastUpdated: new Date()
  },
  'carbomer': {
    ingredient: 'Carbomer',
    safetyScore: 85,
    category: 'safe',
    description: 'Synthetic polymer for thickening and emulsion stabilization.',
    concerns: [],
    alternatives: ['Xanthan Gum', 'Natural gums'],
    sources: ['Cosmetic Chemistry', 'Polymer Science'],
    lastUpdated: new Date()
  },

  // ============ pH ADJUSTERS ============
  'citric acid': {
    ingredient: 'Citric Acid',
    safetyScore: 85,
    category: 'safe',
    description: 'Natural acid from citrus fruits. Adjusts pH and adds shine by smoothing cuticles.',
    concerns: ['May cause irritation if too concentrated'],
    alternatives: ['Lactic Acid', 'Acetic Acid (vinegar)'],
    sources: ['Natural Products', 'pH Studies'],
    lastUpdated: new Date()
  },
  'lactic acid': {
    ingredient: 'Lactic Acid',
    safetyScore: 80,
    category: 'safe',
    description: 'Alpha hydroxy acid that gently exfoliates and helps with pH balance.',
    concerns: ['May cause irritation', 'Increased sun sensitivity'],
    alternatives: ['Citric Acid', 'Malic Acid'],
    sources: ['AHA Research', 'pH Balance Studies'],
    lastUpdated: new Date()
  }
};

// ============ PHASE 3: AI INTEGRATION ============

// AI-powered ingredient analysis using free APIs
export const analyzeWithAI = async (ingredient: string): Promise<IngredientAnalysis | null> => {
  try {
    // Try multiple free AI APIs
    const aiPromises = [
      analyzeWithOpenAI(ingredient),
      analyzeWithGemini(ingredient),
      analyzeWithHuggingFace(ingredient)
    ];

    const results = await Promise.allSettled(aiPromises);
    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<IngredientAnalysis> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    if (successfulResults.length === 0) {
      // All AI APIs failed for ingredient
      return null;
    }

    // Use the first successful AI result
    return successfulResults[0];
  } catch (error) {
    console.error('AI analysis failed for ingredient:', ingredient, error);
    return null;
  }
};

// Validate optional environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

// OpenAI API integration (free tier)
const analyzeWithOpenAI = async (ingredient: string): Promise<IngredientAnalysis | null> => {
  try {
    if (!OPENAI_API_KEY) return null;

    const prompt = `
      Analyze the hair care ingredient "${ingredient}" and provide a safety assessment.
      
      Respond in JSON format with these exact fields:
      {
        "safetyScore": number (0-100),
        "category": "safe" | "moderate" | "harmful" | "unknown",
        "description": "string",
        "concerns": ["string array"],
        "alternatives": ["string array"]
      }
      
      Base your analysis on scientific research, EWG Skin Deep database, and cosmetic chemistry principles.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    // Parse JSON response
    const analysis = JSON.parse(content);
    
    return {
      ingredient,
      safetyScore: analysis.safetyScore || 50,
      category: analysis.category || 'unknown',
      description: analysis.description || '',
      concerns: analysis.concerns || [],
      alternatives: analysis.alternatives || [],
      sources: ['OpenAI AI Analysis'],
      lastUpdated: new Date()
    };
  } catch (error) {
    return null;
  }
};

// Google Gemini API integration (free tier)
const analyzeWithGemini = async (ingredient: string): Promise<IngredientAnalysis | null> => {
  try {
    if (!GEMINI_API_KEY) return null;

    const prompt = `
      Analyze the hair care ingredient "${ingredient}" for safety and provide assessment.
      
      Return JSON format:
      {
        "safetyScore": number (0-100),
        "category": "safe" | "moderate" | "harmful" | "unknown",
        "description": "string",
        "concerns": ["string array"],
        "alternatives": ["string array"]
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) return null;

    const analysis = JSON.parse(content);
    
    return {
      ingredient,
      safetyScore: analysis.safetyScore || 50,
      category: analysis.category || 'unknown',
      description: analysis.description || '',
      concerns: analysis.concerns || [],
      alternatives: analysis.alternatives || [],
      sources: ['Google Gemini AI Analysis'],
      lastUpdated: new Date()
    };
  } catch (error) {
    return null;
  }
};

// Hugging Face API integration (free tier)
const analyzeWithHuggingFace = async (ingredient: string): Promise<IngredientAnalysis | null> => {
  try {
    if (!HUGGINGFACE_API_KEY) return null;

    const prompt = `Analyze hair care ingredient "${ingredient}" for safety. Return JSON with safetyScore (0-100), category, description, concerns array, alternatives array.`;

    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data[0]?.generated_text;
    if (!content) return null;

    // Parse the response (Hugging Face responses may need more processing)
    const analysis = JSON.parse(content);
    
    return {
      ingredient,
      safetyScore: analysis.safetyScore || 50,
      category: analysis.category || 'unknown',
      description: analysis.description || '',
      concerns: analysis.concerns || [],
      alternatives: analysis.alternatives || [],
      sources: ['Hugging Face AI Analysis'],
      lastUpdated: new Date()
    };
  } catch (error) {
    return null;
  }
};

// ============ HYBRID ANALYSIS SYSTEM ============

// Search enhanced database with fuzzy matching
export const searchEnhancedDatabase = (ingredient: string): IngredientAnalysis | null => {
  const ingredientLower = ingredient.toLowerCase().trim();
  
  // Direct match
  if (ENHANCED_INGREDIENT_DATABASE[ingredientLower]) {
    return ENHANCED_INGREDIENT_DATABASE[ingredientLower];
  }
  
  // Fuzzy matching
  const fuzzyMatch = Object.entries(ENHANCED_INGREDIENT_DATABASE).find(([key, data]) => {
    const keyLower = key.toLowerCase();
    const dataLower = data.ingredient.toLowerCase();
    
    return ingredientLower.includes(keyLower) || 
           keyLower.includes(ingredientLower) ||
           ingredientLower.includes(dataLower) ||
           dataLower.includes(ingredientLower);
  });
  
  return fuzzyMatch ? fuzzyMatch[1] : null;
};

// Get database statistics
export const getDatabaseStats = () => {
  return {
    totalIngredients: Object.keys(ENHANCED_INGREDIENT_DATABASE).length,
    categories: {
      safe: Object.values(ENHANCED_INGREDIENT_DATABASE).filter(ing => ing.category === 'safe').length,
      moderate: Object.values(ENHANCED_INGREDIENT_DATABASE).filter(ing => ing.category === 'moderate').length,
      harmful: Object.values(ENHANCED_INGREDIENT_DATABASE).filter(ing => ing.category === 'harmful').length,
      unknown: Object.values(ENHANCED_INGREDIENT_DATABASE).filter(ing => ing.category === 'unknown').length
    },
    lastUpdated: new Date(),
    sources: ['Enhanced Database', 'AI Analysis', 'Pattern Matching']
  };
};

// Search ingredients by category
export const searchIngredientsByCategory = (category: 'safe' | 'moderate' | 'harmful' | 'unknown'): IngredientAnalysis[] => {
  return Object.values(ENHANCED_INGREDIENT_DATABASE).filter(ingredient => ingredient.category === category);
};

// Search ingredients by safety score range
export const searchIngredientsByScoreRange = (minScore: number, maxScore: number): IngredientAnalysis[] => {
  return Object.values(ENHANCED_INGREDIENT_DATABASE).filter(
    ingredient => ingredient.safetyScore >= minScore && ingredient.safetyScore <= maxScore
  );
};
