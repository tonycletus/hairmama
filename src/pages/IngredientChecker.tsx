import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ExternalLink, 
  Upload,
  FileText,
  Shield,
  Lightbulb,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Wifi,
  Clock,
  Zap,
  Database,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";
import { useIngredients } from "@/hooks/useIngredients";
import { IngredientAnalysis, ProductAnalysis } from "@/types/engagement";

const IngredientChecker = () => {
  const {
    loading,
    realTimeLoading,
    analyzeIngredientsFromText,
    searchIngredientResearch,
    lookupIngredientRealTime,
    batchAnalyzeIngredients,
    getSafetySummary,
    getIngredientEducation
  } = useIngredients();

  const [ingredientText, setIngredientText] = useState("");
  const [singleIngredient, setSingleIngredient] = useState("");
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [singleAnalysis, setSingleAnalysis] = useState<IngredientAnalysis | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientAnalysis | null>(null);
  const [researchArticles, setResearchArticles] = useState<any[]>([]);
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("batch");

  const handleAnalyze = async () => {
    if (!ingredientText.trim()) return;
    
    const result = await analyzeIngredientsFromText(ingredientText);
    setAnalysis(result);
  };

  const handleSingleIngredientLookup = async () => {
    if (!singleIngredient.trim()) return;
    
    const result = await lookupIngredientRealTime(singleIngredient);
    setSingleAnalysis(result);
  };

  const handleResearchIngredient = async (ingredient: IngredientAnalysis) => {
    setSelectedIngredient(ingredient);
    setIsResearchLoading(true);
    
    try {
      const articles = await searchIngredientResearch(ingredient.ingredient);
      setResearchArticles(articles);
    } finally {
      setIsResearchLoading(false);
    }
  };

  const getSafetyColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    if (score >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getSafetyIcon = (category: string) => {
    switch (category) {
      case 'safe': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'moderate': return <Info className="h-4 w-4 text-yellow-500" />;
      case 'harmful': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const safetySummary = analysis ? getSafetySummary(analysis.ingredients) : null;

  return (
    <AppLayout title="Ingredient Checker" subtitle="Real-time ingredient safety analysis with live data">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Real-Time Ingredient Safety Checker</h1>
          <p className="text-muted-foreground">
            Analyze product ingredients with live data from multiple sources including EWG, INCIDecoder, and scientific databases
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Wifi className="h-4 w-4" />
              <span>Live Data</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Multiple Sources</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Real-time Updates</span>
            </div>
          </div>
        </div>

        {/* Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Batch Analysis
            </TabsTrigger>
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Single Ingredient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="space-y-4">
            {/* Batch Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Batch Ingredient Analysis
                </CardTitle>
                <CardDescription>
                  Paste the ingredient list from any hair care product for comprehensive real-time analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ingredients">Ingredient List</Label>
                  <Textarea
                    id="ingredients"
                    placeholder="Paste ingredients here (comma-separated or one per line)...&#10;Example:&#10;Water, Sodium Lauryl Sulfate, Cocamidopropyl Betaine, Glycerin, Fragrance"
                    value={ingredientText}
                    onChange={(e) => setIngredientText(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading || !ingredientText.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing with Live Data...
                    </>
                  ) : (
                    <>
                      <Globe className="h-4 w-4 mr-2" />
                      Analyze with Real-time Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="single" className="space-y-4">
            {/* Single Ingredient Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Single Ingredient Lookup
                </CardTitle>
                <CardDescription>
                  Look up a single ingredient for instant real-time safety information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="single-ingredient">Ingredient Name</Label>
                  <Input
                    id="single-ingredient"
                    placeholder="e.g., Sodium Lauryl Sulfate, Parabens, Silicones..."
                    value={singleIngredient}
                    onChange={(e) => setSingleIngredient(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleSingleIngredientLookup} 
                  disabled={realTimeLoading || !singleIngredient.trim()}
                  className="w-full"
                >
                  {realTimeLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Looking up...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Lookup Ingredient
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Single Ingredient Results */}
            {singleAnalysis && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Real-time Analysis: {singleAnalysis.ingredient}
                  </CardTitle>
                  <CardDescription>
                    Live data from multiple sources • Last updated: {singleAnalysis.lastUpdated?.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSafetyIcon(singleAnalysis.category)}
                      <span className="font-medium">{singleAnalysis.ingredient}</span>
                    </div>
                    <Badge className={cn("text-sm", getSafetyColor(singleAnalysis.safetyScore))}>
                      {singleAnalysis.safetyScore}/100
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{singleAnalysis.description}</p>

                  {singleAnalysis.concerns.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-red-600 mb-1">Concerns:</p>
                      <ul className="text-xs text-red-600 space-y-1">
                        {singleAnalysis.concerns.map((concern, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {singleAnalysis.alternatives.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-600 mb-1">Safer Alternatives:</p>
                      <div className="flex flex-wrap gap-1">
                        {singleAnalysis.alternatives.map((alt, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {alt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Database className="h-3 w-3" />
                    <span>Sources: {singleAnalysis.sources.join(', ')}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Batch Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Safety Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Real-time Safety Overview
                </CardTitle>
                <CardDescription>
                  Live analysis from multiple databases • Updated: {analysis.lastUpdated?.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {safetySummary && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold p-2 rounded-lg", getSafetyColor(safetySummary.overallScore))}>
                        {safetySummary.overallScore}/100
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{safetySummary.safe}</div>
                      <p className="text-sm text-muted-foreground">Safe Ingredients</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{safetySummary.moderate}</div>
                      <p className="text-sm text-muted-foreground">Moderate Risk</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{safetySummary.harmful}</div>
                      <p className="text-sm text-muted-foreground">Harmful</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Safety Level</span>
                    <span className="font-medium capitalize">{safetySummary?.safetyLevel}</span>
                  </div>
                  <Progress value={safetySummary?.overallScore || 0} className="h-2" />
                </div>

                {safetySummary && safetySummary.harmful > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This product contains {safetySummary.harmful} potentially harmful ingredients. 
                      Consider safer alternatives below.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Tabs defaultValue="ingredients" className="space-y-4">
              <TabsList>
                <TabsTrigger value="ingredients">Ingredients Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="alternatives">Safer Alternatives</TabsTrigger>
              </TabsList>

              <TabsContent value="ingredients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Ingredient Breakdown</CardTitle>
                    <CardDescription>
                      Live analysis of each ingredient with safety information from multiple sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.ingredients.map((ingredient, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getSafetyIcon(ingredient.category)}
                              <h4 className="font-medium">{ingredient.ingredient}</h4>
                              <Badge className={cn("text-xs", getSafetyColor(ingredient.safetyScore))}>
                                {ingredient.safetyScore}/100
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResearchIngredient(ingredient)}
                            >
                              <BookOpen className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {ingredient.description}
                          </p>

                          {ingredient.concerns.length > 0 && (
                            <div className="mb-2">
                              <p className="text-xs font-medium text-red-600 mb-1">Concerns:</p>
                              <ul className="text-xs text-red-600 space-y-1">
                                {ingredient.concerns.map((concern, idx) => (
                                  <li key={idx} className="flex items-start gap-1">
                                    <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0"></span>
                                    {concern}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {ingredient.alternatives.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-green-600 mb-1">Safer Alternatives:</p>
                              <div className="flex flex-wrap gap-1">
                                {ingredient.alternatives.map((alt, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {alt}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                            <Database className="h-3 w-3" />
                            <span>Sources: {ingredient.sources.join(', ')}</span>
                            {ingredient.lastUpdated && (
                              <>
                                <span>•</span>
                                <span>Updated: {ingredient.lastUpdated.toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Real-time Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alternatives" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Safer Alternatives
                    </CardTitle>
                    <CardDescription>
                      Recommended products with better ingredient profiles based on real-time analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analysis.saferAlternatives.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.saferAlternatives.map((product, index) => (
                          <Card key={index} className="border-green-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">{product.name}</CardTitle>
                              <CardDescription>{product.brand}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge className="text-xs bg-green-100 text-green-800">
                                  {product.category}
                                </Badge>
                                {product.safetyScore && (
                                  <Badge className="text-xs bg-blue-100 text-blue-800">
                                    Safety: {product.safetyScore}/100
                                  </Badge>
                                )}
                              </div>
                              
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Key Ingredients:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {product.ingredients.slice(0, 3).map((ingredient, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {ingredient}
                                    </Badge>
                                  ))}
                                  {product.ingredients.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{product.ingredients.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Great Choice!</h3>
                        <p className="text-muted-foreground">
                          This product appears to have a good ingredient profile. 
                          No safer alternatives needed.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Research Dialog */}
        <Dialog open={!!selectedIngredient} onOpenChange={() => setSelectedIngredient(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Real-time Research: {selectedIngredient?.ingredient}</DialogTitle>
              <DialogDescription>
                Live scientific research and information about this ingredient from PubMed and other sources
              </DialogDescription>
            </DialogHeader>
            
            {selectedIngredient && (
              <div className="space-y-6">
                {/* Ingredient Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getSafetyIcon(selectedIngredient.category)}
                    <Badge className={cn("text-xs", getSafetyColor(selectedIngredient.safetyScore))}>
                      Safety Score: {selectedIngredient.safetyScore}/100
                    </Badge>
                  </div>
                  
                  <p className="text-sm">{selectedIngredient.description}</p>
                  
                  {selectedIngredient.concerns.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Potential Concerns:</h4>
                      <ul className="space-y-1">
                        {selectedIngredient.concerns.map((concern, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Research Articles */}
                <div>
                  <h4 className="font-medium mb-3">Live Scientific Research</h4>
                  {isResearchLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Searching for live research articles...</p>
                    </div>
                  ) : researchArticles.length > 0 ? (
                    <div className="space-y-3">
                      {researchArticles.map((article, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h5 className="font-medium text-sm mb-2">{article.title}</h5>
                            <p className="text-xs text-muted-foreground mb-2">
                              {article.authors.join(', ')} • {article.journal}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                              Relevance: {article.relevanceScore}/100
                            </p>
                            <p className="text-xs line-clamp-3">{article.abstract}</p>
                            {article.doi && (
                              <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                                View Full Article <ExternalLink className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No research articles found for this ingredient.
                    </p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              How to Use the Real-time Ingredient Checker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium">1. Find Ingredients</h4>
                <p className="text-sm text-muted-foreground">
                  Look for the ingredient list on your hair care product packaging
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium">2. Real-time Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Get live data from EWG, INCIDecoder, and scientific databases
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium">3. Instant Results</h4>
                <p className="text-sm text-muted-foreground">
                  Receive safety scores, concerns, and recommendations immediately
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default IngredientChecker;


