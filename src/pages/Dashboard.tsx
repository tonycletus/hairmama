import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/layout/AppLayout";
import PhotoUpload from "@/components/ui/photo-upload";
import { aiService, type HairAnalysisResult } from "@/lib/ai-service";
import { downloadPDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useHairPhotos } from "@/hooks/useHairPhotos";
import { useGoals } from "@/hooks/useGoals";
import { 
  Download,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Loader2,
  Eye,
  Heart,
  Shield,
  Sparkles,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<HairAnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile } = useProfile();
  const { uploadPhoto, photos } = useHairPhotos();
  const { autoUpdateGoalsFromAnalysis } = useGoals();
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setAnalysisResults(null);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setAnalysisResults(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };



  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      const results = await aiService.analyzeHairPhoto(file);
      setAnalysisResults(results);
      
      if (!results.isHairImage) {
        toast({
          title: results.detectedContent === "Blurry or unclear image" ? "Image Quality Issue" : "Not Human Hair",
          description: `${results.message} (Analyzed by: ${results.modelName})`,
          variant: "destructive",
        });
      } else if (results.modelName === 'fallback-analysis') {
        toast({
          title: "Basic Analysis Complete",
          description: `${results.message} (Fallback analysis due to AI service issues)`,
          variant: "default",
        });
              } else {
          // Save analysis results to database
          const photoTitle = `Hair Analysis - ${new Date().toLocaleDateString()}`;
          const analysisData = {
            hairType: results.details.curlPattern,
            hairCondition: results.condition,
            moistureLevel: results.details.moisture === 'dry' ? 30 : results.details.moisture === 'balanced' ? 70 : 90,
            scalpHealth: results.details.scalpHealth,
            damageLevel: results.details.damage === 'low' ? 20 : results.details.damage === 'moderate' ? 50 : 80,
            recommendations: [...results.recommendations.immediate, ...results.recommendations.longTerm],
            confidence: results.healthScore,
            analysisDate: new Date()
          };
          
          // Only save to database and update goals if it's not a fallback analysis
          if (results.modelName !== 'fallback-analysis') {
            const savedPhoto = await uploadPhoto(file, photoTitle, "AI hair analysis", ["analysis"], analysisData);
            
            if (savedPhoto) {
              // Auto-update goals based on analysis results
              await autoUpdateGoalsFromAnalysis(analysisData);
              
              toast({
                title: "Analysis Complete & Goals Updated!",
                description: `Your hair health score: ${results.healthScore}/100 (Analyzed by: ${results.modelName}). Results saved and goals updated automatically.`,
              });
            } else {
              toast({
                title: "Analysis Complete!",
                description: `Your hair health score: ${results.healthScore}/100 (Analyzed by: ${results.modelName})`,
              });
            }
          } else {
            toast({
              title: "Basic Analysis Complete",
              description: `Your hair health score: ${results.healthScore}/100 (Fallback analysis). Try again later for AI-powered insights.`,
            });
          }
        }
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const getHealthBadgeColor = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 60) return "bg-amber-100 text-amber-800 border-amber-200";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const handleDownloadReport = async () => {
    if (!analysisResults) return;
    
    setIsDownloading(true);
    
    try {
      const userName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : undefined;
      await downloadPDF(analysisResults, userName);
      
      toast({
        title: "Report Downloaded!",
        description: "Your beautiful Hairmama PDF report has been saved.",
      });
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AppLayout title="Hair Analysis">
      <div className="max-w-6xl mx-auto space-y-8">


        {/* Upload Section */}
        <div className="space-y-6">
          <PhotoUpload
            onPhotoSelect={handleFileSelect}
            selectedFile={selectedFile}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
            onRemovePhoto={handleRemovePhoto}
          />
        </div>
        
        {/* Image Preview */}
        {previewUrl && selectedFile && (
          <Card className="glass-card border-border/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                Photo Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Hair preview" 
                  className="w-full h-auto max-h-96 object-contain rounded-xl shadow-md"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Analysis History */}
        {photos.length > 0 && (
          <Card className="glass-card border-border/20 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                Recent Analysis History
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your recent hair analysis results and progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.slice(0, 6).map((photo) => (
                  <Card key={photo.id} className="border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-foreground">{photo.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {photo.dateUploaded.toLocaleDateString()}
                          </p>
                          {photo.analysisResults && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-2 h-2 rounded-full bg-success"></div>
                              <span className="text-xs text-muted-foreground font-medium">Analyzed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {photos.length > 6 && (
                <div className="mt-6 text-center">
                  <Button variant="outline" size="sm" onClick={() => navigate('/goals')} className="transition-colors">
                    View All Photos & Progress
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResults && (
      <div className="space-y-8">
            {/* Not Hair Image Alert */}
            {!analysisResults.isHairImage && (
              <Card className="glass-card border-red-200/30 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-red-600">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                    Not Human Hair Detected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1 text-sm font-medium">
                        {analysisResults.modelName}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        AI Analysis Complete
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground bg-red-50 p-2 rounded border border-red-100">
                      <div className="font-medium text-red-700 mb-1">Detection Details:</div>
                      <div>• AI Model: {analysisResults.modelName}</div>
                      <div>• Detection Type: {analysisResults.detectedContent === "Blurry or unclear image" ? 'Image Quality Assessment' : 'Content Classification'}</div>
                      <div>• Status: Content Identified</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-sm font-medium text-red-800 mb-2">
                        {analysisResults.detectedContent === "Blurry or unclear image" ? 
                          "📸 Image Quality Issue" : 
                          "🚫 HairMama can only analyze human hair"
                        }
                      </div>
                      <div className="text-sm text-red-700 mb-3">
                        <strong>Detected:</strong> {analysisResults.detectedContent}
                      </div>
                      <div className="text-sm text-red-600">
                        {analysisResults.message}
                      </div>
                      {analysisResults.detectedContent === "Blurry or unclear image" && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                          <div className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better photos:</div>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Use good lighting (natural light preferred)</li>
                            <li>• Hold the camera steady</li>
                            <li>• Get close enough to see hair details</li>
                            <li>• Make sure the image is in focus</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hair Analysis Results - Only show if it's a hair image */}
            {analysisResults.isHairImage && (
              <>
                {/* Health Score - Insanely Great Design */}
            <Card className="glass-primary border-primary/30 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-primary-foreground flex items-center gap-3 text-3xl font-bold tracking-tight">
                  <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-400" />
                  </div>
                Hair Health Score
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                  <div className={`text-6xl font-black ${getHealthColor(analysisResults.healthScore)} tracking-tight`}>
                    {analysisResults.healthScore}
                    <span className="text-2xl font-medium text-white">/100</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <Badge className={`text-lg px-4 py-2 font-semibold ${getHealthBadgeColor(analysisResults.healthScore)}`}>
                      {getHealthStatus(analysisResults.healthScore)}
                    </Badge>
                    <Progress 
                      value={analysisResults.healthScore} 
                      className="h-4 bg-background/50" 
                    />
                    <div className="text-sm text-white font-medium">
                      {analysisResults.healthScore >= 80 ? "🌟 Outstanding hair health!" :
                       analysisResults.healthScore >= 60 ? "✨ Good condition with room for improvement" :
                       analysisResults.healthScore >= 40 ? "⚠️ Needs attention and care" :
                       "🚨 Requires immediate care and professional advice"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Information - Enhanced */}
            <Card className="glass-secondary border-blue-200/30 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-blue-600">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                  </div>
                  AI Analysis Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 text-sm font-medium">
                      {analysisResults.modelName}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Powered by advanced vision AI
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded border border-blue-100">
                    <div className="font-medium text-blue-700 mb-1">Analysis Information:</div>
                    <div>• Model: {analysisResults.modelName}</div>
                    <div>• Analysis Type: {analysisResults.isHairImage ? 'Hair Health Assessment' : 'Image Content Detection'}</div>
                    <div>• Status: {analysisResults.isHairImage ? 'Complete' : 'Content Identified'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hair Details Grid */}
            <Card className="glass-card border-border/20 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  Hair Analysis Details
                </CardTitle>
                <CardDescription className="text-muted-foreground">Comprehensive breakdown of your hair characteristics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-6 glass-secondary rounded-xl text-center border border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Texture</div>
                    <div className="text-2xl font-bold text-primary mt-3">
                      {analysisResults.details.texture}
                    </div>
                  </div>
                  <div className="p-6 glass-secondary rounded-xl text-center border border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Thickness</div>
                    <div className="text-2xl font-bold text-primary mt-3">
                      {analysisResults.details.thickness}
                    </div>
                  </div>
                  <div className="p-6 glass-secondary rounded-xl text-center border border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Curl Pattern</div>
                    <div className="text-2xl font-bold text-primary mt-3">
                      {analysisResults.details.curlPattern}
                    </div>
                  </div>
                  <div className="p-4 glass-secondary rounded-xl text-center border border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Moisture</div>
                    <div className="text-xl font-bold text-primary mt-2">
                      {analysisResults.details.moisture}
                    </div>
                  </div>
                  <div className="p-4 glass-secondary rounded-xl text-center border border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Shine</div>
                    <div className="text-xl font-bold text-primary mt-2">
                      {analysisResults.details.shine}
                    </div>
                  </div>
                  <div className="p-4 glass-secondary rounded-xl text-center border border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Color</div>
                    <div className="text-xl font-bold text-primary mt-2">
                      {analysisResults.details.color}
                    </div>
                  </div>
                  <div className="p-4 glass-secondary rounded-xl text-center border border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Length</div>
                    <div className="text-xl font-bold text-primary mt-2">
                      {analysisResults.details.length}
                    </div>
                  </div>
                  <div className="p-4 glass-secondary rounded-xl text-center border border-border/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Density</div>
                    <div className="text-xl font-bold text-primary mt-2">
                      {analysisResults.details.density}
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Damage & Scalp Issues */}
            <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Damage Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                      <span className="text-sm">Damage Level:</span>
                      <Badge variant={analysisResults.details.damage === 'High' ? 'destructive' : analysisResults.details.damage === 'Moderate' ? 'secondary' : 'default'}>
                        {analysisResults.details.damage}
                  </Badge>
                </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Damage Types:</div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.details.damageTypes.map((type, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Scalp Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scalp Condition:</span>
                      <Badge variant={analysisResults.details.scalpHealth === 'Poor' ? 'destructive' : analysisResults.details.scalpHealth === 'Fair' ? 'secondary' : 'default'}>
                        {analysisResults.details.scalpHealth}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Issues Detected:</div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.details.scalpIssues.map((issue, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

            {/* AI Insights */}
        <Card className="glass-card border-border/30">
          <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Insights
                </CardTitle>
                <CardDescription>Detailed analysis of each hair characteristic</CardDescription>
          </CardHeader>
          <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Texture & Thickness</h4>
                      <p className="text-sm text-muted-foreground">{analysisResults.insights.textureInsights}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Moisture & Shine</h4>
                      <p className="text-sm text-muted-foreground">{analysisResults.insights.moistureInsights}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Color & Uniformity</h4>
                      <p className="text-sm text-muted-foreground">{analysisResults.insights.colorInsights}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Length & Growth</h4>
                      <p className="text-sm text-muted-foreground">{analysisResults.insights.lengthInsights}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Damage Assessment</h4>
                      <p className="text-sm text-muted-foreground">{analysisResults.insights.damageInsights}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Scalp Health</h4>
                      <p className="text-sm text-muted-foreground">{analysisResults.insights.scalpInsights}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Density & Volume</h4>
                      <p className="text-sm text-muted-foreground">{analysisResults.insights.densityInsights}</p>
                    </div>
                  </div>
            </div>
          </CardContent>
        </Card>

            {/* Recommendations */}
          <Card className="glass-card border-border/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>Actionable advice tailored to your hair analysis</CardDescription>
            </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Immediate Actions
                    </h4>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.immediate.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Long-term Care
                    </h4>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.longTerm.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Preventive Care
                    </h4>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.preventive.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Product Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.products.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Natural Remedies
                    </h4>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.naturalRemedies.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Protective Styles
                    </h4>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.protectiveStyles.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Report */}
            <Card className="glass-card border-border/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Download Report
                </CardTitle>
                <CardDescription>
                  Get your beautiful, branded PDF report with all analysis details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleDownloadReport}
                    disabled={isDownloading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 text-base font-medium"
                    size="lg"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="hidden sm:inline">Generating PDF...</span>
                        <span className="sm:hidden">Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        <span className="hidden sm:inline">Download PDF Report</span>
                        <span className="sm:hidden">Download Report</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Professional Layout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Hairmama Branding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>Complete Analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>
        </>
        )}
        </div>
        )}

        {/* Tips for Better Photos */}
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Tips for Better Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Photo Quality:</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Use good lighting</li>
                  <li>• Take photo in natural light</li>
                  <li>• Ensure hair is clearly visible</li>
                  <li>• Avoid shadows on hair</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Best Angles:</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Front view of hair</li>
                  <li>• Side profile</li>
                  <li>• Close-up of scalp area</li>
                  <li>• Show hair texture clearly</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-800 mb-2">💡 Free Tier Information:</div>
              <div className="text-xs text-blue-700 space-y-1">
                <div>• Free models have daily rate limits</div>
                <div>• If you hit the limit, try again tomorrow</div>
                <div>• Add credits to unlock unlimited requests</div>
                <div>• Only human hair photos are supported</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-800 mb-2">🎯 Consistency Features:</div>
              <div className="text-xs text-green-700 space-y-1">
                <div>• AI performs multiple analysis attempts for consistency</div>
                <div>• Scores are averaged when variance is low</div>
                <div>• Standardized scoring criteria for objectivity</div>
                <div>• Results should be consistent for the same hair</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;