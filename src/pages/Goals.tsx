import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Target, TrendingUp, CheckCircle, Clock, AlertCircle, Star, Lightbulb, Calendar as CalendarIcon2, Image as ImageIcon, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/layout/AppLayout";
import { useGoals } from "@/hooks/useGoals";
import { useHairPhotos } from "@/hooks/useHairPhotos";
import { HairGoal } from "@/types/engagement";
import { ProgressGallery } from "@/components/progress/ProgressGallery";
import { PhotoComparison } from "@/components/progress/PhotoComparison";
import { ComprehensiveReport } from "@/components/reports/ComprehensiveReport";

const Goals = () => {
  const {
    goals,
    loading,
    createGoal,
    updateProgress,
    generateGoalRecommendations,
    getActiveGoals,
    getCompletedGoals,
    getOverdueGoals,
    getAnalysisInsights
  } = useGoals();

  const { photos, loading: photosLoading } = useHairPhotos();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<HairGoal | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isUpdateProgressDialogOpen, setIsUpdateProgressDialogOpen] = useState(false);
  const [updatingGoal, setUpdatingGoal] = useState<HairGoal | null>(null);
  const [newProgressValue, setNewProgressValue] = useState<string>('');

  const activeGoals = getActiveGoals();
  const completedGoals = getCompletedGoals();
  const overdueGoals = getOverdueGoals();

  const handleCreateGoal = async (formData: FormData) => {
    const goalData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      targetValue: parseFloat(formData.get('targetValue') as string),
      currentValue: parseFloat(formData.get('currentValue') as string),
      unit: formData.get('unit') as string,
      targetDate: new Date(formData.get('targetDate') as string),
      startDate: new Date(),
      category: formData.get('category') as HairGoal['category'],
      status: 'active' as const
    };

    const newGoal = await createGoal(goalData);
    if (newGoal) {
      setIsCreateDialogOpen(false);
    }
  };

  const handleUpdateProgress = async (goalId: string, newValue: number) => {
    await updateProgress(goalId, newValue);
    setIsUpdateProgressDialogOpen(false);
    setUpdatingGoal(null);
    setNewProgressValue('');
  };

  const handleOpenUpdateProgress = (goal: HairGoal) => {
    setUpdatingGoal(goal);
    setNewProgressValue((goal.currentValue ?? 0).toString());
    setIsUpdateProgressDialogOpen(true);
  };

  const handleGetRecommendations = async (goal: HairGoal) => {
    setSelectedGoal(goal);
    const recs = await generateGoalRecommendations(goal);
    setRecommendations(recs);
  };

  const getCategoryIcon = (category: HairGoal['category']) => {
    const icons = {
      length: "📏",
      thickness: "🔄",
      moisture: "💧",
      strength: "💪",
      curl_definition: "🌀",
      scalp_health: "🧠"
    };
    return icons[category];
  };

  const getCategoryColor = (category: HairGoal['category']) => {
    const colors = {
      length: "bg-blue-100 text-blue-800",
      thickness: "bg-purple-100 text-purple-800",
      moisture: "bg-cyan-100 text-cyan-800",
      strength: "bg-green-100 text-green-800",
      curl_definition: "bg-pink-100 text-pink-800",
      scalp_health: "bg-orange-100 text-orange-800"
    };
    return colors[category];
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-blue-500";
    if (progress >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <AppLayout title="Hair Goals" subtitle="Track your hair health journey">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your goals...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Hair Goals" subtitle="Track your hair health journey">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Create Goal Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hair Goals Dashboard</h1>
            <p className="text-muted-foreground">
              Set, track, and achieve your hair health objectives with photo progress tracking
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Hair Goal</DialogTitle>
                <DialogDescription>
                  Set a specific, measurable goal for your hair health journey
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateGoal(new FormData(e.currentTarget)); }} className="space-y-4">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Grow 3 inches" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Describe your goal and why it's important to you"
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentValue">Current Value</Label>
                    <Input id="currentValue" name="currentValue" type="number" step="0.1" required />
                  </div>
                  <div>
                    <Label htmlFor="targetValue">Target Value</Label>
                    <Input id="targetValue" name="targetValue" type="number" step="0.1" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select name="unit" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inches">Inches</SelectItem>
                        <SelectItem value="cm">Centimeters</SelectItem>
                        <SelectItem value="%">Percentage</SelectItem>
                        <SelectItem value="score">Score (1-10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="length">Length</SelectItem>
                        <SelectItem value="thickness">Thickness</SelectItem>
                        <SelectItem value="moisture">Moisture</SelectItem>
                        <SelectItem value="strength">Strength</SelectItem>
                        <SelectItem value="curl_definition">Curl Definition</SelectItem>
                        <SelectItem value="scalp_health">Scalp Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input id="targetDate" name="targetDate" type="date" required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Goal</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Active Goals</p>
                  <p className="text-2xl font-bold">{activeGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-2xl font-bold">{completedGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Overdue</p>
                  <p className="text-2xl font-bold">{overdueGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Avg Progress</p>
                  <p className="text-2xl font-bold">
                    {activeGoals.length > 0 
                      ? Math.round(activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Insights Section */}
        {photos.length > 0 && (
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your hair analysis history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const insights = getAnalysisInsights();
                return (
                  <div className="space-y-4">
                    {insights.trends.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Trends</h4>
                        <div className="space-y-2">
                          {insights.trends.map((trend, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>{trend}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {insights.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                        <div className="space-y-2">
                          {insights.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {insights.trends.length === 0 && insights.recommendations.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>Upload more photos to get personalized insights</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Photo Progress
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            {/* Goals Tabs */}
            <Tabs defaultValue="active" className="space-y-4">
              <TabsList>
                <TabsTrigger value="active">Active Goals</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeGoals.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Goals</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first hair goal to start tracking your progress
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Create Your First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map((goal) => (
                  <Card key={goal.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                          <div>
                            <CardTitle className="text-lg">{goal.title}</CardTitle>
                            <Badge className={cn("text-xs", getCategoryColor(goal.category))}>
                              {goal.category.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGetRecommendations(goal)}
                        >
                          <Lightbulb className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{goal.currentValue} {goal.unit}</span>
                          <span>{goal.targetValue} {goal.unit}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon2 className="h-4 w-4" />
                        <span>Target: {format(goal.targetDate, 'MMM dd, yyyy')}</span>
                      </div>

                      <div className="flex gap-2">
                                                 <Button
                           variant="outline"
                           size="sm"
                           className="flex-1"
                           onClick={() => handleOpenUpdateProgress(goal)}
                         >
                           Update Progress
                         </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGetRecommendations(goal)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedGoals.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Completed Goals Yet</h3>
                  <p className="text-muted-foreground">
                    Keep working on your active goals to see them here!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <Card key={goal.id} className="border-green-200 bg-green-50/50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span>🎉 Completed on {format(goal.updatedAt, 'MMM dd, yyyy')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4">
            {overdueGoals.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Overdue Goals</h3>
                  <p className="text-muted-foreground">
                    Great job staying on track with your goals!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {overdueGoals.map((goal) => (
                  <Card key={goal.id} className="border-red-200 bg-red-50/50">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <span>⚠️ Overdue since {format(goal.targetDate, 'MMM dd, yyyy')}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </TabsContent>

      {/* AI Recommendations Dialog */}
         <Dialog open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
           <DialogContent className="sm:max-w-2xl">
             <DialogHeader>
               <DialogTitle>AI Recommendations for "{selectedGoal?.title}"</DialogTitle>
               <DialogDescription>
                 Personalized suggestions to help you achieve your hair goal
               </DialogDescription>
             </DialogHeader>
             {recommendations && (
               <div className="space-y-6">
                 <div>
                   <h4 className="font-semibold mb-3 flex items-center gap-2">
                     🥗 Nutrition Tips
                   </h4>
                   <ul className="space-y-2">
                     {recommendations.nutrition?.map((tip: string, index: number) => (
                       <li key={index} className="flex items-start gap-2">
                         <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                         <span className="text-sm">{tip}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 
                 <div>
                   <h4 className="font-semibold mb-3 flex items-center gap-2">
                     🧴 Hair Care Routine
                   </h4>
                   <ul className="space-y-2">
                     {recommendations.routine?.map((tip: string, index: number) => (
                       <li key={index} className="flex items-start gap-2">
                         <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                         <span className="text-sm">{tip}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 
                 <div>
                   <h4 className="font-semibold mb-3 flex items-center gap-2">
                     🌟 Lifestyle Changes
                   </h4>
                   <ul className="space-y-2">
                     {recommendations.lifestyle?.map((tip: string, index: number) => (
                       <li key={index} className="flex items-start gap-2">
                         <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                         <span className="text-sm">{tip}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
             )}
           </DialogContent>
         </Dialog>

         {/* Update Progress Dialog */}
         <Dialog open={isUpdateProgressDialogOpen} onOpenChange={setIsUpdateProgressDialogOpen}>
           <DialogContent className="sm:max-w-md">
             <DialogHeader>
               <DialogTitle>Update Progress</DialogTitle>
               <DialogDescription>
                 Update the current value for "{updatingGoal?.title}"
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               <div>
                 <Label htmlFor="newProgressValue">New Value</Label>
                 <Input
                   id="newProgressValue"
                   type="number"
                   step="0.1"
                   value={newProgressValue}
                   onChange={(e) => setNewProgressValue(e.target.value)}
                   placeholder={`Enter new value in ${updatingGoal?.unit}`}
                 />
                 <p className="text-xs text-muted-foreground mt-1">
                   Current: {updatingGoal?.currentValue ?? 0} {updatingGoal?.unit} | Target: {updatingGoal?.targetValue} {updatingGoal?.unit}
                 </p>
               </div>
               <div className="flex justify-end gap-2">
                 <Button 
                   variant="outline" 
                   onClick={() => {
                     setIsUpdateProgressDialogOpen(false);
                     setUpdatingGoal(null);
                     setNewProgressValue('');
                   }}
                 >
                   Cancel
                 </Button>
                 <Button 
                   onClick={() => {
                     if (newProgressValue && !isNaN(parseFloat(newProgressValue))) {
                       handleUpdateProgress(updatingGoal!.id, parseFloat(newProgressValue));
                     }
                   }}
                   disabled={!newProgressValue || isNaN(parseFloat(newProgressValue))}
                 >
                   Update Progress
                 </Button>
               </div>
             </div>
           </DialogContent>
         </Dialog>

          {/* Photo Progress Tab */}
          <TabsContent value="photos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Photo Progress Tracking</h2>
                <p className="text-muted-foreground">
                  Visualize your hair journey with photos and AI analysis
                </p>
              </div>
              <PhotoComparison photos={photos} />
            </div>
            <ProgressGallery />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {photos.length === 0 && goals.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No data yet</h3>
                <p className="text-muted-foreground">
                  Start tracking your progress to see comprehensive analytics here
                </p>
              </div>
            ) : (
              <ComprehensiveReport goals={goals} photos={photos} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Goals;

