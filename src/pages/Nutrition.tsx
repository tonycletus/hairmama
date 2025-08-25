import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, TrendingUp, Apple } from "lucide-react";
import { useNutrition } from "@/hooks/useNutrition";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";

const Nutrition = () => {
  const { logs, addNutritionLog, getNutrientSummary, getNutritionScore } = useNutrition();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    nutrient_name: '',
    amount: '',
    unit: '',
    food_source: '',
    date: new Date().toISOString().split('T')[0],
  });

  const nutrients = [
    'Iron', 'Biotin', 'Vitamin D', 'Vitamin B12', 'Zinc', 
    'Protein', 'Vitamin C', 'Vitamin E', 'Folate', 'Omega-3'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await addNutritionLog({
      ...formData,
      amount: parseFloat(formData.amount),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add nutrition log",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Nutrition log added successfully",
      });
      setFormData({
        nutrient_name: '',
        amount: '',
        unit: '',
        food_source: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowAddForm(false);
    }
  };

  const nutritionScore = getNutritionScore();
  const nutrientSummary = getNutrientSummary();

  return (
    <AppLayout title="Nutrition Tracking" subtitle="Monitor your essential hair nutrients">
      <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Nutrition Tracking</h1>
          <p className="text-lg text-muted-foreground mt-2">Monitor your essential hair nutrients</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Add Nutrition
        </Button>
      </div>

      {/* Add Nutrition Form */}
      {showAddForm && (
        <Card className="glass-card border-border/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Apple className="h-4 w-4 text-primary" />
              </div>
              Add Nutrition Log
            </CardTitle>
            <CardDescription className="text-muted-foreground">Track your daily nutrient intake</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nutrient">Nutrient</Label>
                  <Select value={formData.nutrient_name} onValueChange={(value) => setFormData(prev => ({ ...prev, nutrient_name: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nutrient" />
                    </SelectTrigger>
                    <SelectContent>
                      {nutrients.map(nutrient => (
                        <SelectItem key={nutrient} value={nutrient}>{nutrient}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.1"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="mcg">mcg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="IU">IU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="food_source">Food Source</Label>
                  <Input
                    id="food_source"
                    value={formData.food_source}
                    onChange={(e) => setFormData(prev => ({ ...prev, food_source: e.target.value }))}
                    placeholder="e.g., Spinach, Supplements"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Log</Button>
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Nutrition Score */}
      <Card className="glass-primary border-primary/30">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center gap-2">
            <Target className="h-5 w-5" />
            Today's Nutrition Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary-foreground">{nutritionScore}%</div>
            <div className="flex-1">
              <Progress value={nutritionScore} className="h-3" />
              <p className="text-sm text-primary-foreground/80 mt-2">
                {nutritionScore >= 90 ? 'Excellent!' : nutritionScore >= 70 ? 'Good progress' : 'Needs attention'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nutrient Summary */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle>Nutrient Status</CardTitle>
          <CardDescription>Your key hair nutrients today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutrientSummary.map((nutrient) => (
              <div key={nutrient.nutrient} className="p-4 glass-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{nutrient.nutrient}</h4>
                  <Badge variant={
                    nutrient.status === "excellent" ? "default" :
                    nutrient.status === "good" ? "secondary" :
                    "destructive"
                  }>
                    {nutrient.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={Math.min(100, nutrient.level)} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{nutrient.level}% of target</span>
                    <span>Target: {nutrient.target}{nutrient.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card className="glass-card border-border/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5" />
            Recent Nutrition Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 glass-secondary rounded-lg">
                <div>
                  <div className="font-medium text-foreground">{log.nutrient_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {log.amount}{log.unit} {log.food_source && `from ${log.food_source}`}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(log.date).toLocaleDateString()}
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No nutrition logs yet. Start tracking your nutrients!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </AppLayout>
  );
};

export default Nutrition;