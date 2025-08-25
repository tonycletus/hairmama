import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HairPhoto } from '../../types/engagement';
import { aiService } from '../../lib/ai-service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Droplets,
  Heart,
  AlertTriangle,
  CheckCircle,
  Calendar,
  RefreshCw,
  Brain
} from 'lucide-react';

interface PhotoComparisonProps {
  photos: HairPhoto[];
  className?: string;
}

export const PhotoComparison: React.FC<PhotoComparisonProps> = ({ photos, className }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [photo1, setPhoto1] = useState<HairPhoto | null>(null);
  const [photo2, setPhoto2] = useState<HairPhoto | null>(null);
  const [aiComparison, setAiComparison] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [comparisonInsights, setComparisonInsights] = useState<string[]>([]);

  const getAnalysisColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getComparisonIcon = (value1?: number, value2?: number) => {
    if (!value1 || !value2) return <Minus className="w-4 h-4 text-gray-400" />;
    if (value2 > value1) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value2 < value1) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getComparisonText = (value1?: number, value2?: number, label: string) => {
    if (!value1 || !value2) return 'No data available';
    const diff = value2 - value1;
    const percent = Math.abs(diff);
    if (diff > 0) return `+${percent}% improvement in ${label}`;
    if (diff < 0) return `${percent}% decline in ${label}`;
    return `No change in ${label}`;
  };

  const availablePhotos = photos.filter(p => p.analysisResults);

  // Real-time AI comparison function
  const performRealTimeComparison = useCallback(async () => {
    if (!photo1 || !photo2) return;

    setIsAnalyzing(true);
    setAiComparison(null);
    setComparisonInsights([]);

    try {
      // Check if user prefers offline mode (can be enhanced with a toggle)
      const useOfflineMode = localStorage.getItem('hairmama_offline_mode') === 'true';
      
      if (useOfflineMode) {
        // Use offline analysis directly
        const offlineInsights = aiService.generateOfflineComparison({
          photo1Url: photo1.photoUrl,
          photo2Url: photo2.photoUrl,
          photo1Analysis: photo1.analysisResults,
          photo2Analysis: photo2.analysisResults
        });
        
        setComparisonInsights(offlineInsights);
        setAiComparison({
          insights: offlineInsights,
          rawResponse: 'Offline analysis',
          modelName: 'offline-fallback',
          isOffline: true
        });
        return;
      }

      // Create a combined analysis prompt for the two photos
      const comparisonPrompt = `Compare these two hair photos and provide real-time insights:

Photo 1 (Before): ${photo1.title} - ${photo1.dateUploaded.toLocaleDateString()}
Photo 2 (After): ${photo2.title} - ${photo2.dateUploaded.toLocaleDateString()}

Time between photos: ${Math.ceil((photo2.dateUploaded.getTime() - photo1.dateUploaded.getTime()) / (1000 * 60 * 60 * 24))} days

Please analyze:
1. Visual changes in hair texture, volume, and appearance
2. Progress toward common hair goals
3. Specific improvements or areas needing attention
4. Recommendations for continued progress
5. Overall progress assessment

Provide specific, actionable insights based on the visual comparison.`;

      // Use the AI service to analyze the comparison
      const result = await aiService.analyzeTextComparison(comparisonPrompt, {
        photo1Url: photo1.photoUrl,
        photo2Url: photo2.photoUrl,
        photo1Analysis: photo1.analysisResults,
        photo2Analysis: photo2.analysisResults
      });

      setAiComparison(result);
      
      // Extract insights from the AI response
      if (result.insights) {
        setComparisonInsights(Array.isArray(result.insights) ? result.insights : [result.insights]);
      }

    } catch (error) {
      console.error('Real-time comparison failed:', error);
      
      // Check if this is an offline fallback result
      if (error && typeof error === 'object' && 'insights' in error) {
        // This is actually a successful offline fallback
        setComparisonInsights(error.insights || []);
        setAiComparison({
          insights: error.insights || [],
          rawResponse: 'Offline analysis',
          modelName: 'offline-fallback',
          isOffline: true
        });
      } else {
        // Provide fallback insights based on available data
        const fallbackInsights = [];
        
        if (photo1 && photo2) {
          const daysDiff = Math.ceil((photo2.dateUploaded.getTime() - photo1.dateUploaded.getTime()) / (1000 * 60 * 60 * 24));
          
          fallbackInsights.push(
            `Time between photos: ${daysDiff} days`,
            'AI analysis temporarily unavailable',
            'Please try refreshing the analysis or check your connection'
          );
          
          // Add basic comparison if we have analysis data
          if (photo1.analysisResults && photo2.analysisResults) {
            if (photo1.analysisResults.moistureLevel && photo2.analysisResults.moistureLevel) {
              const moistureDiff = photo2.analysisResults.moistureLevel - photo1.analysisResults.moistureLevel;
              if (moistureDiff > 0) {
                fallbackInsights.push(`Moisture level improved by ${Math.abs(moistureDiff)}%`);
              } else if (moistureDiff < 0) {
                fallbackInsights.push(`Moisture level decreased by ${Math.abs(moistureDiff)}%`);
              }
            }
          }
        }
        
        setComparisonInsights(fallbackInsights);
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [photo1, photo2]);

  // Trigger real-time comparison when both photos are selected
  useEffect(() => {
    if (photo1 && photo2) {
      performRealTimeComparison();
    }
  }, [photo1, photo2, performRealTimeComparison]);

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline"
        className={`${className} text-sm sm:text-base px-3 sm:px-4 py-2`}
        disabled={availablePhotos.length < 2}
      >
        Compare Photos
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`${photo1 && photo2 ? 'max-w-full max-h-screen w-screen h-screen p-0' : 'max-w-6xl max-h-[90vh] w-[95vw] p-4 sm:p-6'}`}>
          <DialogHeader className={photo1 && photo2 ? 'p-6 border-b bg-white sticky top-0 z-10' : ''}>
            <DialogTitle>Compare Hair Progress</DialogTitle>
          </DialogHeader>

          <div className={`${photo1 && photo2 ? 'h-full overflow-y-auto p-6' : 'space-y-4 sm:space-y-6'}`}>
            {/* Photo Selection */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${photo1 && photo2 ? 'mb-6' : ''}`}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Before Photo</label>
                <Select onValueChange={(value) => {
                  const photo = photos.find(p => p.id === value);
                  setPhoto1(photo || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a photo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePhotos.map((photo) => (
                      <SelectItem key={photo.id} value={photo.id}>
                        {photo.title} - {photo.dateUploaded.toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">After Photo</label>
                <Select onValueChange={(value) => {
                  const photo = photos.find(p => p.id === value);
                  setPhoto2(photo || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a photo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePhotos.map((photo) => (
                      <SelectItem key={photo.id} value={photo.id}>
                        {photo.title} - {photo.dateUploaded.toLocaleDateString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Comparison Display */}
            {photo1 && photo2 && (
              <div className="space-y-6 sm:space-y-8">
                {/* Photos Side by Side */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {photo1.dateUploaded.toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={photo1.photoUrl}
                        alt={photo1.title || 'Before photo'}
                        className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg mb-4"
                      />
                      <h4 className="font-medium mb-2 text-sm sm:text-base">{photo1.title}</h4>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {photo2.dateUploaded.toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                                             <img
                         src={photo2.photoUrl}
                         alt={photo2.title || 'After photo'}
                         className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg mb-4"
                       />
                      <h4 className="font-medium mb-2 text-sm sm:text-base">{photo2.title}</h4>
                    </CardContent>
                  </Card>
                </div>

                {/* Analysis Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Progress Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Hair Type Comparison */}
                      {photo1.analysisResults?.hairType && photo2.analysisResults?.hairType && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm sm:text-base">Hair Type</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4">
                            <Badge variant="outline" className="text-xs sm:text-sm">{photo1.analysisResults.hairType}</Badge>
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                            <Badge variant="outline" className="text-xs sm:text-sm">{photo2.analysisResults.hairType}</Badge>
                          </div>
                        </div>
                      )}

                      {/* Moisture Level Comparison */}
                      {photo1.analysisResults?.moistureLevel && photo2.analysisResults?.moistureLevel && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            <span className="font-medium text-sm sm:text-base">Moisture Level</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="text-center">
                              <div className="text-xs sm:text-sm font-medium">{photo1.analysisResults.moistureLevel}%</div>
                              <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${photo1.analysisResults.moistureLevel}%` }}
                                />
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                            <div className="text-center">
                              <div className="text-xs sm:text-sm font-medium">{photo2.analysisResults.moistureLevel}%</div>
                              <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${photo2.analysisResults.moistureLevel}%` }}
                                />
                              </div>
                            </div>
                            {getComparisonIcon(photo1.analysisResults.moistureLevel, photo2.analysisResults.moistureLevel)}
                          </div>
                        </div>
                      )}

                      {/* Damage Level Comparison */}
                      {photo1.analysisResults?.damageLevel && photo2.analysisResults?.damageLevel && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium text-sm sm:text-base">Damage Level</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="text-center">
                              <div className="text-xs sm:text-sm font-medium">{photo1.analysisResults.damageLevel}%</div>
                              <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: `${photo1.analysisResults.damageLevel}%` }}
                                />
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                            <div className="text-center">
                              <div className="text-xs sm:text-sm font-medium">{photo2.analysisResults.damageLevel}%</div>
                              <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full"
                                  style={{ width: `${photo2.analysisResults.damageLevel}%` }}
                                />
                              </div>
                            </div>
                            {getComparisonIcon(photo1.analysisResults.damageLevel, photo2.analysisResults.damageLevel)}
                          </div>
                        </div>
                      )}

                      {/* Scalp Health Comparison */}
                      {photo1.analysisResults?.scalpHealth && photo2.analysisResults?.scalpHealth && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            <span className="font-medium text-sm sm:text-base">Scalp Health</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-4">
                            <Badge variant="outline" className="text-xs sm:text-sm">{photo1.analysisResults.scalpHealth}</Badge>
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                            <Badge variant="outline" className="text-xs sm:text-sm">{photo2.analysisResults.scalpHealth}</Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {/* Progress Summary */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm sm:text-base">Progress Summary</h4>
                      <div className="space-y-1 text-xs sm:text-sm">
                        {photo1.analysisResults?.moistureLevel && photo2.analysisResults?.moistureLevel && (
                          <div className="flex items-center gap-2">
                            {getComparisonIcon(photo1.analysisResults.moistureLevel, photo2.analysisResults.moistureLevel)}
                            <span>
                              {getComparisonText(photo1.analysisResults.moistureLevel, photo2.analysisResults.moistureLevel, 'moisture')}
                            </span>
                          </div>
                        )}
                        
                        {photo1.analysisResults?.damageLevel && photo2.analysisResults?.damageLevel && (
                          <div className="flex items-center gap-2">
                            {getComparisonIcon(photo1.analysisResults.damageLevel, photo2.analysisResults.damageLevel)}
                            <span>
                              {getComparisonText(photo1.analysisResults.damageLevel, photo2.analysisResults.damageLevel, 'damage')}
                            </span>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground mt-2">
                          Time between photos: {Math.ceil((photo2.dateUploaded.getTime() - photo1.dateUploaded.getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Real-Time AI Insights */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-green-800">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        AI-Powered Real-Time Insights
                        {isAnalyzing && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            Analyzing...
                          </div>
                        )}
                      </div>
                      {!isAnalyzing && comparisonInsights.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={performRealTimeComparison}
                          className="text-green-700 border-green-300 hover:bg-green-100"
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Refresh Analysis
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    {isAnalyzing ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-green-700">AI is analyzing your progress in real-time...</p>
                      </div>
                    ) : comparisonInsights.length > 0 ? (
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          {comparisonInsights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
                            </div>
                          ))}
                        </div>
                        
                                           {aiComparison && (
                     <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                       <div className="flex items-center gap-2 text-blue-700 mb-2">
                         <CheckCircle className="w-4 h-4" />
                         <span className="text-sm font-medium">
                           {aiComparison.isOffline ? 'Offline Analysis Complete' : 'Analysis Complete'}
                         </span>
                       </div>
                       <p className="text-xs text-blue-600">
                         {aiComparison.isOffline 
                           ? 'Offline analysis • No API required'
                           : `Powered by ${aiComparison.modelName} • Real-time comparison`
                         }
                       </p>
                     </div>
                   )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">
                          {comparisonInsights.length > 0 && comparisonInsights[0].includes('temporarily unavailable') 
                            ? 'AI analysis unavailable - showing basic comparison'
                            : 'Select both photos to get AI-powered insights'
                          }
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Call to Action Section */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-center space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Ready to Continue Your Hair Journey?
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-4">
                          Based on your progress comparison, take the next step to achieve your hair goals.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <Button 
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/goals');
                          }}
                          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Update My Goals
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/insights');
                          }}
                          variant="outline" 
                          className="w-full sm:w-auto border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          Get AI Insights
                        </Button>
                        
                        <Button 
                          onClick={() => {
                            setIsOpen(false);
                            navigate('/remedies');
                          }}
                          variant="outline"
                          className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          Find Remedies
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-3">
                        💡 Tip: Regular photo comparisons help track your progress more effectively
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {(!photo1 || !photo2) && (
              <Card>
                <CardContent className="text-center py-6 sm:py-8">
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Select two photos to compare your hair progress
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

