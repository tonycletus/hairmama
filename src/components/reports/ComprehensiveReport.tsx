import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Image as ImageIcon, 
  Calendar,
  BarChart3,
  Download,
  Lightbulb
} from "lucide-react";
import { HairGoal } from "@/types/engagement";
import { format } from "date-fns";

interface ComprehensiveReportProps {
  goals: HairGoal[];
  photos: any[];
  className?: string;
}

export const ComprehensiveReport: React.FC<ComprehensiveReportProps> = ({ 
  goals, 
  photos, 
  className = "" 
}) => {
  const analyzedPhotos = photos.filter(p => p.analysisResults);
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  // Calculate overall progress
  const overallProgress = activeGoals.length > 0 
    ? Math.round(activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length)
    : 0;

  // Calculate analysis frequency
  const analysisFrequency = analyzedPhotos.length >= 2 
    ? Math.round(analyzedPhotos.length / Math.max(1, 
        (analyzedPhotos[0].dateUploaded.getTime() - analyzedPhotos[analyzedPhotos.length - 1].dateUploaded.getTime()) / (1000 * 60 * 60 * 24 * 30)
      ))
    : 0;

  // Get latest analysis insights
  const latestAnalysis = analyzedPhotos[0]?.analysisResults;
  const previousAnalysis = analyzedPhotos[1]?.analysisResults;

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { text: "Excellent", color: "bg-green-100 text-green-800" };
    if (score >= 60) return { text: "Good", color: "bg-blue-100 text-blue-800" };
    if (score >= 40) return { text: "Fair", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Poor", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Report Header */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comprehensive Hair Health Report
          </CardTitle>
          <CardDescription>
            Generated on {format(new Date(), 'MMMM dd, yyyy')} • {analyzedPhotos.length} analyses • {goals.length} goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analyzedPhotos.length}</div>
              <div className="text-sm text-muted-foreground">Total Analyses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
              <div className="text-sm text-muted-foreground">Goals Achieved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Health Status */}
      {latestAnalysis && (
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Current Hair Health Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Moisture Level</span>
                  {previousAnalysis && getTrendIcon(latestAnalysis.moistureLevel || 0, previousAnalysis.moistureLevel || 0)}
                </div>
                <Progress value={latestAnalysis.moistureLevel || 0} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {latestAnalysis.moistureLevel || 0}% • {getHealthStatus(latestAnalysis.moistureLevel || 0).text}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Damage Level</span>
                  {previousAnalysis && getTrendIcon(previousAnalysis.damageLevel || 0, latestAnalysis.damageLevel || 0)}
                </div>
                <Progress value={latestAnalysis.damageLevel || 0} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {latestAnalysis.damageLevel || 0}% • {getHealthStatus(100 - (latestAnalysis.damageLevel || 0)).text}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Hair Type</span>
                <Badge variant="outline" className="w-fit">
                  {latestAnalysis.hairType || 'Unknown'}
                </Badge>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">Scalp Health</span>
                <Badge variant="outline" className="w-fit">
                  {latestAnalysis.scalpHealth || 'Unknown'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal Progress Summary */}
      {activeGoals.length > 0 && (
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Active Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{goal.title}</div>
                      <div className="text-sm text-muted-foreground">{goal.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{goal.progress}%</div>
                      <div className="text-xs text-muted-foreground">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </div>
                    </div>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Target: {format(goal.targetDate, 'MMM dd, yyyy')}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis History */}
      {analyzedPhotos.length > 0 && (
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Analysis History
            </CardTitle>
            <CardDescription>
              Your hair analysis journey over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyzedPhotos.slice(0, 5).map((photo, index) => (
                <div key={photo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{photo.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(photo.dateUploaded, 'MMM dd, yyyy')}
                    </div>
                  </div>
                  {photo.analysisResults && (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {photo.analysisResults.confidence || 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">Health Score</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {latestAnalysis && latestAnalysis.recommendations && (
        <Card className="glass-card border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestAnalysis.recommendations.slice(0, 6).map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Items */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Continue your current hair care routine</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Schedule your next analysis in 2-4 weeks</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Review and adjust your goals based on progress</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Report */}
      <div className="flex justify-center">
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Full Report
        </Button>
      </div>
    </div>
  );
};
