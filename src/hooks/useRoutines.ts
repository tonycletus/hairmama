import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HairRoutine, RoutineStep, RoutineProduct, Reminder } from '@/types/engagement';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export const useRoutines = () => {
  const [routines, setRoutines] = useState<HairRoutine[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's routines
  const fetchRoutines = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('hair_routines')
        .select(`
          *,
          steps:routine_steps(*),
          products:routine_products(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const formattedRoutines: HairRoutine[] = (data || []).map(routine => ({
        ...routine,
        id: routine.id,
        userId: routine.user_id,
        steps: (routine.steps || []).map((step: any) => ({
          ...step,
          id: step.id,
          productIds: step.product_ids || []
        })),
        products: (routine.products || []).map((product: any) => ({
          ...product,
          id: product.id
        })),
        createdAt: new Date(routine.created_at),
        updatedAt: new Date(routine.updated_at)
      }));

      setRoutines(formattedRoutines);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch routines');
      toast({
        title: "Error",
        description: "Failed to load your hair routines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Fetch user's reminders
  const fetchReminders = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('scheduled_for', { ascending: true });

      if (fetchError) throw fetchError;

      const formattedReminders: Reminder[] = (data || []).map(reminder => ({
        ...reminder,
        id: reminder.id,
        userId: reminder.user_id,
        scheduledFor: new Date(reminder.scheduled_for),
        createdAt: new Date(reminder.created_at)
      }));

      setReminders(formattedReminders);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
    }
  }, [user]);

  // Create a new routine
  const createRoutine = useCallback(async (routineData: Omit<HairRoutine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('hair_routines')
        .insert({
          user_id: user.id,
          name: routineData.name,
          description: routineData.description,
          frequency: routineData.frequency,
          custom_days: routineData.customDays,
          time_of_day: routineData.timeOfDay,
          estimated_duration: routineData.estimatedDuration,
          tips: routineData.tips,
          is_active: routineData.isActive
        })
        .select()
        .single();

      if (createError) throw createError;

      const newRoutine: HairRoutine = {
        ...data,
        id: data.id,
        userId: data.user_id,
        steps: [],
        products: [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setRoutines(prev => [newRoutine, ...prev]);
      
      toast({
        title: "Success",
        description: "Hair routine created successfully!",
      });

      return newRoutine;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create routine');
      toast({
        title: "Error",
        description: "Failed to create hair routine",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Update a routine
  const updateRoutine = useCallback(async (routineId: string, updates: Partial<HairRoutine>) => {
    try {
      setError(null);

      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.frequency !== undefined) updateData.frequency = updates.frequency;
      if (updates.customDays !== undefined) updateData.custom_days = updates.customDays;
      if (updates.timeOfDay !== undefined) updateData.time_of_day = updates.timeOfDay;
      if (updates.estimatedDuration !== undefined) updateData.estimated_duration = updates.estimatedDuration;
      if (updates.tips !== undefined) updateData.tips = updates.tips;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { data, error: updateError } = await supabase
        .from('hair_routines')
        .update(updateData)
        .eq('id', routineId)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedRoutine: HairRoutine = {
        ...data,
        id: data.id,
        userId: data.user_id,
        steps: routines.find(r => r.id === routineId)?.steps || [],
        products: routines.find(r => r.id === routineId)?.products || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setRoutines(prev => prev.map(routine => routine.id === routineId ? updatedRoutine : routine));
      
      toast({
        title: "Success",
        description: "Routine updated successfully!",
      });

      return updatedRoutine;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update routine');
      toast({
        title: "Error",
        description: "Failed to update hair routine",
        variant: "destructive",
      });
      return null;
    }
  }, [routines, toast]);

  // Delete a routine
  const deleteRoutine = useCallback(async (routineId: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('hair_routines')
        .delete()
        .eq('id', routineId);

      if (deleteError) throw deleteError;

      setRoutines(prev => prev.filter(routine => routine.id !== routineId));
      
      toast({
        title: "Success",
        description: "Routine deleted successfully!",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete routine');
      toast({
        title: "Error",
        description: "Failed to delete hair routine",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Add step to routine
  const addStep = useCallback(async (routineId: string, stepData: Omit<RoutineStep, 'id'>) => {
    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('routine_steps')
        .insert({
          routine_id: routineId,
          order: stepData.order,
          title: stepData.title,
          description: stepData.description,
          duration: stepData.duration,
          product_ids: stepData.productIds,
          tips: stepData.tips
        })
        .select()
        .single();

      if (createError) throw createError;

      const newStep: RoutineStep = {
        ...data,
        id: data.id,
        productIds: data.product_ids || []
      };

      setRoutines(prev => prev.map(routine => 
        routine.id === routineId 
          ? { ...routine, steps: [...routine.steps, newStep] }
          : routine
      ));

      return newStep;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add step');
      toast({
        title: "Error",
        description: "Failed to add step to routine",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Update step
  const updateStep = useCallback(async (stepId: string, updates: Partial<RoutineStep>) => {
    try {
      setError(null);

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.duration !== undefined) updateData.duration = updates.duration;
      if (updates.productIds !== undefined) updateData.product_ids = updates.productIds;
      if (updates.tips !== undefined) updateData.tips = updates.tips;

      const { data, error: updateError } = await supabase
        .from('routine_steps')
        .update(updateData)
        .eq('id', stepId)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedStep: RoutineStep = {
        ...data,
        id: data.id,
        productIds: data.product_ids || []
      };

      setRoutines(prev => prev.map(routine => ({
        ...routine,
        steps: routine.steps.map(step => step.id === stepId ? updatedStep : step)
      })));

      return updatedStep;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update step');
      toast({
        title: "Error",
        description: "Failed to update step",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Delete step
  const deleteStep = useCallback(async (stepId: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('routine_steps')
        .delete()
        .eq('id', stepId);

      if (deleteError) throw deleteError;

      setRoutines(prev => prev.map(routine => ({
        ...routine,
        steps: routine.steps.filter(step => step.id !== stepId)
      })));

      toast({
        title: "Success",
        description: "Step removed from routine",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete step');
      toast({
        title: "Error",
        description: "Failed to remove step",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Add product to routine
  const addProduct = useCallback(async (routineId: string, productData: Omit<RoutineProduct, 'id'>) => {
    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('routine_products')
        .insert({
          routine_id: routineId,
          name: productData.name,
          brand: productData.brand,
          category: productData.category,
          ingredients: productData.ingredients,
          safety_score: productData.safetyScore,
          is_verified: productData.isVerified
        })
        .select()
        .single();

      if (createError) throw createError;

      const newProduct: RoutineProduct = {
        ...data,
        id: data.id
      };

      setRoutines(prev => prev.map(routine => 
        routine.id === routineId 
          ? { ...routine, products: [...routine.products, newProduct] }
          : routine
      ));

      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      toast({
        title: "Error",
        description: "Failed to add product to routine",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Create reminder
  const createReminder = useCallback(async (reminderData: Omit<Reminder, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return null;

    try {
      setError(null);

      const { data, error: createError } = await supabase
        .from('reminders')
        .insert({
          user_id: user.id,
          title: reminderData.title,
          message: reminderData.message,
          type: reminderData.type,
          scheduled_for: reminderData.scheduledFor.toISOString(),
          frequency: reminderData.frequency,
          is_active: reminderData.isActive,
          routine_id: reminderData.routineId,
          goal_id: reminderData.goalId
        })
        .select()
        .single();

      if (createError) throw createError;

      const newReminder: Reminder = {
        ...data,
        id: data.id,
        userId: data.user_id,
        scheduledFor: new Date(data.scheduled_for),
        createdAt: new Date(data.created_at)
      };

      setReminders(prev => [...prev, newReminder]);
      
      toast({
        title: "Success",
        description: "Reminder created successfully!",
      });

      return newReminder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create reminder');
      toast({
        title: "Error",
        description: "Failed to create reminder",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Update reminder
  const updateReminder = useCallback(async (reminderId: string, updates: Partial<Reminder>) => {
    try {
      setError(null);

      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.message !== undefined) updateData.message = updates.message;
      if (updates.scheduledFor !== undefined) updateData.scheduled_for = updates.scheduledFor.toISOString();
      if (updates.frequency !== undefined) updateData.frequency = updates.frequency;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      const { data, error: updateError } = await supabase
        .from('reminders')
        .update(updateData)
        .eq('id', reminderId)
        .select()
        .single();

      if (updateError) throw updateError;

      const updatedReminder: Reminder = {
        ...data,
        id: data.id,
        userId: data.user_id,
        scheduledFor: new Date(data.scheduled_for),
        createdAt: new Date(data.created_at)
      };

      setReminders(prev => prev.map(reminder => reminder.id === reminderId ? updatedReminder : reminder));
      
      toast({
        title: "Success",
        description: "Reminder updated successfully!",
      });

      return updatedReminder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reminder');
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  // Delete reminder
  const deleteReminder = useCallback(async (reminderId: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('reminders')
        .delete()
        .eq('id', reminderId);

      if (deleteError) throw deleteError;

      setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
      
      toast({
        title: "Success",
        description: "Reminder deleted successfully!",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete reminder');
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Get routines by frequency
  const getRoutinesByFrequency = useCallback((frequency: HairRoutine['frequency']) => {
    return routines.filter(routine => routine.frequency === frequency);
  }, [routines]);

  // Get active routines
  const getActiveRoutines = useCallback(() => {
    return routines.filter(routine => routine.isActive);
  }, [routines]);

  // Get today's routines
  const getTodayRoutines = useCallback(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

    return routines.filter(routine => {
      if (!routine.isActive) return false;

      switch (routine.frequency) {
        case 'daily':
          return true;
        case 'weekly':
          return dayOfWeek === 0; // Sunday
        case 'biweekly':
          return dayOfWeek === 0 && Math.floor(today.getDate() / 7) % 2 === 0;
        case 'monthly':
          return today.getDate() === 1; // First day of month
        case 'custom':
          return routine.customDays?.includes(dayOfWeek) || false;
        default:
          return false;
      }
    });
  }, [routines]);

  // Get upcoming reminders
  const getUpcomingReminders = useCallback((hours: number = 24) => {
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    return reminders.filter(reminder => 
      reminder.isActive && 
      reminder.scheduledFor >= now && 
      reminder.scheduledFor <= future
    );
  }, [reminders]);

  useEffect(() => {
    fetchRoutines();
    fetchReminders();
  }, [fetchRoutines, fetchReminders]);

  return {
    routines,
    reminders,
    loading,
    error,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    addStep,
    updateStep,
    deleteStep,
    addProduct,
    createReminder,
    updateReminder,
    deleteReminder,
    getRoutinesByFrequency,
    getActiveRoutines,
    getTodayRoutines,
    getUpcomingReminders,
    refreshRoutines: fetchRoutines,
    refreshReminders: fetchReminders
  };
};


