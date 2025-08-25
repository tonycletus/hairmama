import { useState, useCallback } from 'react';
import { analyzeIngredients, searchScientificArticles, lookupIngredientRealTime } from '@/lib/external-apis';
import { IngredientAnalysis, ProductAnalysis, RoutineProduct } from '@/types/engagement';
import { useToast } from './use-toast';

export const useIngredients = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [realTimeLoading, setRealTimeLoading] = useState(false);
  const { toast } = useToast();

  // Real-time ingredient lookup
  const lookupIngredientRealTime = useCallback(async (ingredient: string) => {
    try {
      setRealTimeLoading(true);
      setError(null);

      const analysis = await lookupIngredientRealTime(ingredient);
      
      toast({
        title: "Real-time Analysis Complete",
        description: `${ingredient} analyzed with live data from multiple sources`,
      });

      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to lookup ingredient';
      setError(errorMessage);
      toast({
        title: "Real-time Lookup Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setRealTimeLoading(false);
    }
  }, [toast]);

  // Analyze ingredients from a product with real-time data
  const analyzeProductIngredients = useCallback(async (ingredients: string[]) => {
    try {
      setLoading(true);
      setError(null);

      const analysis = await analyzeIngredients(ingredients);
      
      const overallScore = Math.round(
        analysis.reduce((sum, ing) => sum + ing.safetyScore, 0) / analysis.length
      );

      const harmfulIngredients = analysis.filter(ing => ing.category === 'harmful');
      const moderateIngredients = analysis.filter(ing => ing.category === 'moderate');
      const safeIngredients = analysis.filter(ing => ing.category === 'safe');

      const recommendations = generateRecommendations(analysis);
      const saferAlternatives = await generateSaferAlternatives(analysis);

      const productAnalysis: ProductAnalysis = {
        productId: `analysis_${Date.now()}`,
        name: 'Analyzed Product',
        brand: 'Unknown',
        overallScore,
        ingredients: analysis,
        recommendations,
        saferAlternatives,
        lastUpdated: new Date()
      };

      toast({
        title: "Real-time Analysis Complete",
        description: `Product safety score: ${overallScore}/100 (Live data from multiple sources)`,
      });

      return productAnalysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze ingredients';
      setError(errorMessage);
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Analyze ingredients from text input with real-time data
  const analyzeIngredientsFromText = useCallback(async (ingredientText: string) => {
    try {
      setLoading(true);
      setError(null);

      // Parse ingredients from text (comma-separated, newline-separated, etc.)
      const ingredients = ingredientText
        .split(/[,\n;]/)
        .map(ing => ing.trim())
        .filter(ing => ing.length > 0);

      if (ingredients.length === 0) {
        throw new Error('No ingredients found in the provided text');
      }

      return await analyzeProductIngredients(ingredients);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze ingredients';
      setError(errorMessage);
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [analyzeProductIngredients, toast]);

  // Search for scientific articles about ingredients with real-time data
  const searchIngredientResearch = useCallback(async (ingredient: string) => {
    try {
      setLoading(true);
      setError(null);

      const articles = await searchScientificArticles(`${ingredient} hair health`, 5);
      
      toast({
        title: "Real-time Research Found",
        description: `Found ${articles.length} scientific articles about ${ingredient} (Live PubMed data)`,
      });

      return articles;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search research';
      setError(errorMessage);
      toast({
        title: "Research Error",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Batch analyze multiple ingredients with real-time data
  const batchAnalyzeIngredients = useCallback(async (ingredients: string[]) => {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.allSettled(
        ingredients.map(ingredient => lookupIngredientRealTime(ingredient))
      );

      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<IngredientAnalysis> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);

      const failedCount = results.filter(result => result.status === 'rejected').length;

      if (successfulResults.length === 0) {
        throw new Error('All ingredient lookups failed');
      }

      toast({
        title: "Batch Analysis Complete",
        description: `Analyzed ${successfulResults.length} ingredients${failedCount > 0 ? ` (${failedCount} failed)` : ''}`,
      });

      return successfulResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to batch analyze ingredients';
      setError(errorMessage);
      toast({
        title: "Batch Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Generate recommendations based on ingredient analysis
  const generateRecommendations = (analysis: IngredientAnalysis[]): string[] => {
    const recommendations: string[] = [];
    const harmfulCount = analysis.filter(ing => ing.category === 'harmful').length;
    const moderateCount = analysis.filter(ing => ing.category === 'moderate').length;

    if (harmfulCount > 0) {
      recommendations.push('Consider avoiding products with harmful ingredients');
      recommendations.push('Look for natural alternatives to harsh chemicals');
    }

    if (moderateCount > 0) {
      recommendations.push('Use products with moderate ingredients in moderation');
      recommendations.push('Monitor your hair and scalp for any adverse reactions');
    }

    if (harmfulCount === 0 && moderateCount === 0) {
      recommendations.push('Great choice! This product appears to be safe for most hair types');
    }

    // Specific ingredient recommendations
    analysis.forEach(ingredient => {
      if (ingredient.category === 'harmful') {
        recommendations.push(`Avoid ${ingredient.ingredient}: ${ingredient.description}`);
      } else if (ingredient.category === 'moderate') {
        recommendations.push(`Use ${ingredient.ingredient} with caution: ${ingredient.description}`);
      }
    });

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  };

  // Generate safer alternatives with real-time data
  const generateSaferAlternatives = async (analysis: IngredientAnalysis[]): Promise<RoutineProduct[]> => {
    const harmfulIngredients = analysis.filter(ing => ing.category === 'harmful');
    const alternatives: RoutineProduct[] = [];

    // This would typically integrate with a product database
    // For now, we'll provide generic alternatives
    const commonAlternatives: Record<string, RoutineProduct[]> = {
      'sulfate': [
        {
          id: 'alt_1',
          name: 'Gentle Cleansing Shampoo',
          brand: 'Natural Hair Co.',
          category: 'shampoo',
          ingredients: ['Cocamidopropyl Betaine', 'Decyl Glucoside', 'Aloe Vera'],
          safetyScore: 85,
          isVerified: true
        }
      ],
      'paraben': [
        {
          id: 'alt_2',
          name: 'Preservative-Free Conditioner',
          brand: 'Organic Hair Care',
          category: 'conditioner',
          ingredients: ['Shea Butter', 'Coconut Oil', 'Vitamin E'],
          safetyScore: 90,
          isVerified: true
        }
      ],
      'silicone': [
        {
          id: 'alt_3',
          name: 'Water-Soluble Conditioner',
          brand: 'Clean Hair Solutions',
          category: 'conditioner',
          ingredients: ['Glycerin', 'Panthenol', 'Hydrolyzed Protein'],
          safetyScore: 80,
          isVerified: true
        }
      ]
    };

    harmfulIngredients.forEach(ingredient => {
      const ingredientLower = ingredient.ingredient.toLowerCase();
      Object.entries(commonAlternatives).forEach(([key, products]) => {
        if (ingredientLower.includes(key) || key.includes(ingredientLower)) {
          alternatives.push(...products);
        }
      });
    });

    return alternatives.slice(0, 3); // Limit to 3 alternatives
  };

  // Check if ingredient is safe for specific hair concerns
  const checkIngredientForHairConcern = useCallback((ingredient: string, concern: string): boolean => {
    const concernMap: Record<string, string[]> = {
      'dryness': ['sulfate', 'alcohol', 'paraben'],
      'dandruff': ['sulfate', 'paraben', 'formaldehyde'],
      'hair_loss': ['sulfate', 'paraben', 'phthalate'],
      'scalp_irritation': ['sulfate', 'paraben', 'fragrance'],
      'build_up': ['silicone', 'wax', 'mineral_oil']
    };

    const harmfulIngredients = concernMap[concern] || [];
    const ingredientLower = ingredient.toLowerCase();
    
    return !harmfulIngredients.some(harmful => 
      ingredientLower.includes(harmful) || harmful.includes(ingredientLower)
    );
  }, []);

  // Get ingredient safety summary
  const getSafetySummary = useCallback((analysis: IngredientAnalysis[]) => {
    const total = analysis.length;
    const safe = analysis.filter(ing => ing.category === 'safe').length;
    const moderate = analysis.filter(ing => ing.category === 'moderate').length;
    const harmful = analysis.filter(ing => ing.category === 'harmful').length;

    const overallScore = Math.round(
      analysis.reduce((sum, ing) => sum + ing.safetyScore, 0) / total
    );

    let safetyLevel: 'excellent' | 'good' | 'moderate' | 'poor';
    if (overallScore >= 80) safetyLevel = 'excellent';
    else if (overallScore >= 60) safetyLevel = 'good';
    else if (overallScore >= 40) safetyLevel = 'moderate';
    else safetyLevel = 'poor';

    return {
      total,
      safe,
      moderate,
      harmful,
      overallScore,
      safetyLevel,
      percentage: {
        safe: Math.round((safe / total) * 100),
        moderate: Math.round((moderate / total) * 100),
        harmful: Math.round((harmful / total) * 100)
      }
    };
  }, []);

  // Compare two products
  const compareProducts = useCallback(async (product1: ProductAnalysis, product2: ProductAnalysis) => {
    const comparison = {
      product1: {
        name: product1.name,
        score: product1.overallScore,
        harmfulCount: product1.ingredients.filter(ing => ing.category === 'harmful').length,
        safeCount: product1.ingredients.filter(ing => ing.category === 'safe').length
      },
      product2: {
        name: product2.name,
        score: product2.overallScore,
        harmfulCount: product2.ingredients.filter(ing => ing.category === 'harmful').length,
        safeCount: product2.ingredients.filter(ing => ing.category === 'safe').length
      },
      winner: product1.overallScore > product2.overallScore ? product1.name : product2.name,
      scoreDifference: Math.abs(product1.overallScore - product2.overallScore)
    };

    return comparison;
  }, []);

  // Get ingredient education content
  const getIngredientEducation = useCallback((ingredient: string) => {
    const educationContent: Record<string, {
      description: string;
      benefits: string[];
      concerns: string[];
      alternatives: string[];
    }> = {
      'sulfate': {
        description: 'Sulfates are harsh cleansing agents that create lather but can strip natural oils.',
        benefits: ['Creates rich lather', 'Effective at removing dirt and oil'],
        concerns: ['Can cause dryness', 'May irritate scalp', 'Strips natural oils'],
        alternatives: ['Cocamidopropyl Betaine', 'Decyl Glucoside', 'Sodium Cocoyl Isethionate']
      },
      'silicone': {
        description: 'Silicones create a protective barrier on hair but can build up over time.',
        benefits: ['Provides smoothness', 'Reduces frizz', 'Protects from heat'],
        concerns: ['Can cause buildup', 'May weigh down hair', 'Hard to remove'],
        alternatives: ['Natural oils', 'Water-soluble conditioners', 'Glycerin']
      },
      'paraben': {
        description: 'Parabens are preservatives that prevent bacterial growth but have health concerns.',
        benefits: ['Prevents bacterial growth', 'Extends product shelf life'],
        concerns: ['Hormone disruption', 'Skin irritation', 'Allergic reactions'],
        alternatives: ['Vitamin E', 'Natural preservatives', 'Refrigeration']
      }
    };

    const ingredientLower = ingredient.toLowerCase();
    const match = Object.entries(educationContent).find(([key]) => 
      ingredientLower.includes(key) || key.includes(ingredientLower)
    );

    return match ? match[1] : null;
  }, []);

  return {
    loading,
    realTimeLoading,
    error,
    analyzeProductIngredients,
    analyzeIngredientsFromText,
    searchIngredientResearch,
    lookupIngredientRealTime,
    batchAnalyzeIngredients,
    checkIngredientForHairConcern,
    getSafetySummary,
    compareProducts,
    getIngredientEducation
  };
};


