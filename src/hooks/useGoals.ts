import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HairGoal, GoalMilestone } from '@/types/engagement';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useHairPhotos } from './useHairPhotos';

export const useGoals = () => {
  const [goals, setGoals] = useState<HairGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { photos } = useHairPhotos();

  // Fetch user's goals
  const fetchGoals = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('hair_goals')
        .select(`
          *,
          milestones:goal_milestones(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedGoals: HairGoal[] = (data || []).map(goal => {
        // Calculate initial value from start_date - use current_value at creation time
        // Since initial_value doesn't exist in schema, we'll use current_value as baseline
        const initialValue = goal.current_value; // Use current_value as initial baseline
        
        return {
          ...goal,
          id: goal.id,
          userId: goal.user_id,
          initialValue: initialValue,
          targetDate: new Date(goal.target_date),
          startDate: new Date(goal.start_date),
          createdAt: new Date(goal.created_at),
          updatedAt: new Date(goal.updated_at),
          milestones: (goal.milestones || []).map((milestone: any) => ({
            ...milestone,
            id: milestone.id,
            goalId: milestone.goal_id,
            targetDate: new Date(milestone.target_date),
            completedAt: milestone.completed_at ? new Date(milestone.completed_at) : undefined
          }))
        };
      });

      setGoals(formattedGoals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
      toast({
        title: "Error",
        description: "Failed to load your hair goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Create a new goal
  const createGoal = useCallback(async (goalData: Omit<HairGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'progress' | 'milestones'>) => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('hair_goals')
        .insert({
          user_id: user.id,
          title: goalData.title,
          description: goalData.description,
          target_value: goalData.targetValue,
          current_value: goalData.currentValue,
          unit: goalData.unit,
          target_date: goalData.targetDate.toISOString(),
          start_date: goalData.startDate.toISOString(),
          category: goalData.category,
          status: goalData.status
        })
        .select()
        .single();

      if (createError) throw createError;

      const newGoal: HairGoal = {
        ...data,
        id: data.id,
        userId: data.user_id,
        initialValue: data.current_value, // Use current_value as initial baseline
        targetDate: new Date(data.target_date),
        startDate: new Date(data.start_date),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        progress: calculateProgress(data.current_value, data.target_value, data.current_value, new Date(data.start_date), new Date(data.target_date)),
        milestones: []
      };

      setGoals(prev => [newGoal, ...prev]);
      
      toast({
        title: "Success",
        description: "Hair goal created successfully!",
      });

      return newGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
      toast({
        title: "Error",
        description: "Failed to create hair goal",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Update a goal
  const updateGoal = useCallback(async (goalId: string, updates: Partial<HairGoal>) => {
    try {
      setError(null);

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.targetValue !== undefined) updateData.target_value = updates.targetValue;
      if (updates.currentValue !== undefined) updateData.current_value = updates.currentValue;
      if (updates.unit !== undefined) updateData.unit = updates.unit;
      if (updates.targetDate !== undefined) updateData.target_date = updates.targetDate.toISOString();
      if (updates.status !== undefined) updateData.status = updates.status;

      const { data, error: updateError } = await supabase
        .from('hair_goals')
        .update(updateData)
        .eq('id', goalId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Get the original goal to preserve initialValue
      const originalGoal = goals.find(g => g.id === goalId);
      const updatedGoal: HairGoal = {
        ...data,
        id: data.id,
        userId: data.user_id,
        initialValue: originalGoal?.initialValue || data.current_value, // Preserve original initial value
        targetDate: new Date(data.target_date),
        startDate: new Date(data.start_date),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        progress: calculateProgress(data.current_value, data.target_value, originalGoal?.initialValue || data.current_value, new Date(data.start_date), new Date(data.target_date)),
        milestones: originalGoal?.milestones || []
      };

      setGoals(prev => prev.map(goal => goal.id === goalId ? updatedGoal : goal));
      
      toast({
        title: "Success",
        description: "Goal updated successfully!",
      });

      return updatedGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal');
      toast({
        title: "Error",
        description: "Failed to update hair goal",
        variant: "destructive",
      });
      return null;
    }
  }, [goals, toast]);

  // Delete a goal
  const deleteGoal = useCallback(async (goalId: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('hair_goals')
        .delete()
        .eq('id', goalId);

      if (deleteError) throw deleteError;

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      toast({
        title: "Success",
        description: "Goal deleted successfully!",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete goal');
      toast({
        title: "Error",
        description: "Failed to delete hair goal",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Update goal progress
  const updateProgress = useCallback(async (goalId: string, currentValue: number) => {
    try {
      setError(null);

      const goal = goals.find(g => g.id === goalId);
      if (!goal) throw new Error('Goal not found');

      // For progress calculation, use the goal's initialValue if available, otherwise use current value
      // The database trigger will calculate progress, but we calculate it here for immediate UI update
      const initialBaseline = goal.initialValue || 0; // Start from 0 if no initial value
      const progress = calculateProgress(currentValue, goal.targetValue, initialBaseline, goal.startDate, goal.targetDate);

      const { data, error: updateError } = await supabase
        .from('hair_goals')
        .update({
          current_value: currentValue,
          progress: progress,
          status: progress >= 100 ? 'completed' : 'active'
        })
        .eq('id', goalId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Preserve initialValue from original goal
      const updatedGoal: HairGoal = {
        ...goal,
        currentValue,
        initialValue: goal.initialValue || 0, // Preserve initial value for progress calculation
        progress,
        status: progress >= 100 ? 'completed' : 'active',
        updatedAt: new Date()
      };

      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      
      if (progress >= 100) {
        toast({
          title: "🎉 Congratulations!",
          description: "You've achieved your hair goal!",
        });
      } else {
        toast({
          title: "Progress Updated",
          description: `Great progress! You're ${progress.toFixed(1)}% of the way to your goal.`,
        });
      }

      return updatedGoal;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
      toast({
        title: "Error",
        description: "Failed to update goal progress",
        variant: "destructive",
      });
      return null;
    }
  }, [goals, toast]);

  // Auto-update goals based on analysis results
  const autoUpdateGoalsFromAnalysis = useCallback(async (analysisResults: any) => {
    if (!user || !analysisResults) return;

    const updates = [];

    // Find goals that can be updated based on analysis
    for (const goal of goals.filter(g => g.status === 'active')) {
      let shouldUpdate = false;
      let newValue = goal.currentValue;

      switch (goal.category) {
        case 'moisture':
          if (analysisResults.moistureLevel !== undefined) {
            newValue = analysisResults.moistureLevel;
            shouldUpdate = true;
          }
          break;
        case 'strength':
          if (analysisResults.damageLevel !== undefined) {
            // Convert damage level to strength (inverse relationship)
            newValue = 100 - analysisResults.damageLevel;
            shouldUpdate = true;
          }
          break;
        case 'scalp_health':
          if (analysisResults.scalpHealth) {
            // Convert scalp health to numeric value
            const healthScore = analysisResults.scalpHealth.includes('healthy') ? 90 :
                               analysisResults.scalpHealth.includes('normal') ? 70 :
                               analysisResults.scalpHealth.includes('dry') ? 40 : 30;
            newValue = healthScore;
            shouldUpdate = true;
          }
          break;
      }

      if (shouldUpdate && Math.abs(newValue - goal.currentValue) > 5) {
        updates.push(updateProgress(goal.id, newValue));
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
      toast({
        title: "Goals Auto-Updated",
        description: `${updates.length} goals updated based on your latest analysis.`,
      });
    }
  }, [user, goals, updateProgress, toast]);

  // Add milestone
  const addMilestone = useCallback(async (goalId: string, milestoneData: Omit<GoalMilestone, 'id' | 'goalId' | 'completed' | 'completedAt'>) => {
    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('goal_milestones')
        .insert({
          goal_id: goalId,
          title: milestoneData.title,
          target_value: milestoneData.targetValue,
          current_value: milestoneData.currentValue,
          target_date: milestoneData.targetDate.toISOString()
        })
        .select()
        .single();

      if (createError) throw createError;

      const newMilestone: GoalMilestone = {
        ...data,
        id: data.id,
        goalId: data.goal_id,
        targetDate: new Date(data.target_date),
        completed: false
      };

      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, milestones: [...goal.milestones, newMilestone] }
          : goal
      ));

      return newMilestone;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add milestone');
      toast({
        title: "Error",
        description: "Failed to add milestone",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Complete milestone
  const completeMilestone = useCallback(async (milestoneId: string) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('goal_milestones')
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', milestoneId)
        .select()
        .single();

      if (updateError) throw updateError;

      setGoals(prev => prev.map(goal => ({
        ...goal,
        milestones: goal.milestones.map(milestone => 
          milestone.id === milestoneId 
            ? { ...milestone, completed: true, completedAt: new Date() }
            : milestone
        )
      })));

      toast({
        title: "Milestone Achieved! 🎯",
        description: "Great job reaching this milestone!",
      });

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete milestone');
      toast({
        title: "Error",
        description: "Failed to complete milestone",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Generate AI recommendations for goals based on analysis data
  const generateGoalRecommendations = useCallback(async (goal: HairGoal) => {
    try {
      // Get recent analysis data to inform recommendations
      const recentAnalyses = photos
        .filter(photo => photo.analysisResults)
        .sort((a, b) => b.dateUploaded.getTime() - a.dateUploaded.getTime())
        .slice(0, 3);

      const recommendations = {
        nutrition: [
          'Increase protein intake to support hair growth',
          'Add biotin-rich foods like eggs and nuts',
          'Include omega-3 fatty acids from fish or flaxseeds'
        ],
        routine: [
          'Use gentle, sulfate-free shampoo',
          'Deep condition weekly',
          'Protect hair from heat damage'
        ],
        lifestyle: [
          'Reduce stress through meditation or exercise',
          'Get adequate sleep (7-9 hours)',
          'Stay hydrated throughout the day'
        ]
      };

      // Customize recommendations based on analysis data
      if (recentAnalyses.length > 0) {
        const latestAnalysis = recentAnalyses[0].analysisResults;
        
        if (latestAnalysis) {
          // Moisture-based recommendations
          if (goal.category === 'moisture' && latestAnalysis.moistureLevel) {
            if (latestAnalysis.moistureLevel < 50) {
              recommendations.routine.unshift("Use intensive moisturizing treatments");
              recommendations.routine.unshift("Avoid harsh shampoos that strip moisture");
            }
          }

          // Damage-based recommendations
          if (goal.category === 'strength' && latestAnalysis.damageLevel) {
            if (latestAnalysis.damageLevel > 60) {
              recommendations.routine.unshift("Use protein treatments to strengthen hair");
              recommendations.routine.unshift("Minimize heat styling and chemical treatments");
            }
          }

          // Scalp health recommendations
          if (goal.category === 'scalp_health' && latestAnalysis.scalpHealth) {
            if (latestAnalysis.scalpHealth.includes('dry') || latestAnalysis.scalpHealth.includes('irritated')) {
              recommendations.routine.unshift("Use gentle scalp treatments");
              recommendations.routine.unshift("Avoid products with harsh chemicals");
            }
          }
        }
      }

      return recommendations;
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
      return null;
    }
  }, [photos]);

  // Calculate progress percentage based on progress from initial to target value
  const calculateProgress = (current: number, target: number, initial: number, startDate: Date, targetDate: Date): number => {
    // Handle edge cases to prevent NaN
    if (!current || !target || !initial || !startDate || !targetDate) {
      return 0;
    }
    
    // Ensure values are numbers
    const currentValue = Number(current) || 0;
    const targetValue = Number(target) || 1;
    const initialValue = Number(initial) || 0;
    
    // Calculate the total change needed
    const totalChangeNeeded = targetValue - initialValue;
    
    // If no change is needed (target equals initial), return 100% if current equals target
    if (totalChangeNeeded === 0) {
      return currentValue === targetValue ? 100 : 0;
    }
    
    // Calculate how much progress has been made
    const progressMade = currentValue - initialValue;
    
    // Calculate percentage based on progress made vs total change needed
    const valueProgress = Math.max(0, Math.min(100, (progressMade / totalChangeNeeded) * 100));
    
    // Handle time calculation
    const now = Date.now();
    const startTime = startDate.getTime();
    const targetTime = targetDate.getTime();
    
    // Prevent division by zero in time calculation
    if (targetTime <= startTime) {
      return Math.round(valueProgress);
    }
    
    const timeProgress = Math.max(0, Math.min(100, ((now - startTime) / (targetTime - startTime)) * 100));
    
    // Weight time and value progress equally
    const totalProgress = (timeProgress + valueProgress) / 2;
    
    // Ensure result is a valid number
    return Math.round(Math.max(0, Math.min(100, totalProgress)));
  };

  // Get goals by category
  const getGoalsByCategory = useCallback((category: HairGoal['category']) => {
    return goals.filter(goal => goal.category === category);
  }, [goals]);

  // Get active goals
  const getActiveGoals = useCallback(() => {
    return goals.filter(goal => goal.status === 'active');
  }, [goals]);

  // Get completed goals
  const getCompletedGoals = useCallback(() => {
    return goals.filter(goal => goal.status === 'completed');
  }, [goals]);

  // Get overdue goals
  const getOverdueGoals = useCallback(() => {
    return goals.filter(goal => 
      goal.status === 'active' && 
      new Date() > goal.targetDate
    );
  }, [goals]);

  // Get analysis-based insights for goal progress
  const getAnalysisInsights = useCallback(() => {
    const recentAnalyses = photos
      .filter(photo => photo.analysisResults)
      .sort((a, b) => b.dateUploaded.getTime() - a.dateUploaded.getTime())
      .slice(0, 5);

    if (recentAnalyses.length === 0) {
      return {
        trends: [],
        recommendations: [],
        progress: null
      };
    }

    const insights = {
      trends: [] as string[],
      recommendations: [] as string[],
      progress: {
        moisture: 0,
        damage: 0,
        strength: 0
      }
    };

    // Calculate trends
    if (recentAnalyses.length >= 2) {
      const latest = recentAnalyses[0].analysisResults;
      const previous = recentAnalyses[1].analysisResults;

      if (latest && previous) {
        // Moisture trend
        if (latest.moistureLevel && previous.moistureLevel) {
          const moistureChange = latest.moistureLevel - previous.moistureLevel;
          if (moistureChange > 10) {
            insights.trends.push("Moisture levels are improving significantly");
          } else if (moistureChange < -10) {
            insights.trends.push("Moisture levels are decreasing - consider hydration");
          }
        }

        // Damage trend
        if (latest.damageLevel && previous.damageLevel) {
          const damageChange = latest.damageLevel - previous.damageLevel;
          if (damageChange < -10) {
            insights.trends.push("Damage levels are decreasing - great progress!");
          } else if (damageChange > 10) {
            insights.trends.push("Damage levels are increasing - consider protective measures");
          }
        }
      }
    }

    // Generate recommendations based on latest analysis
    const latestAnalysis = recentAnalyses[0].analysisResults;
    if (latestAnalysis) {
      if (latestAnalysis.moistureLevel && latestAnalysis.moistureLevel < 50) {
        insights.recommendations.push("Focus on moisture retention with deep conditioning");
      }
      if (latestAnalysis.damageLevel && latestAnalysis.damageLevel > 60) {
        insights.recommendations.push("Prioritize damage repair with protein treatments");
      }
      if (latestAnalysis.scalpHealth && latestAnalysis.scalpHealth.includes('dry')) {
        insights.recommendations.push("Address scalp health with gentle treatments");
      }
    }

    return insights;
  }, [photos]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    addMilestone,
    completeMilestone,
    generateGoalRecommendations,
    getGoalsByCategory,
    getActiveGoals,
    getCompletedGoals,
    getOverdueGoals,
    getAnalysisInsights,
    autoUpdateGoalsFromAnalysis,
    refreshGoals: fetchGoals
  };
};

