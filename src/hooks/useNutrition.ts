import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface NutritionLog {
  id: string;
  user_id: string;
  date: string;
  nutrient_name: string;
  amount: number;
  unit: string;
  food_source: string | null;
  created_at: string;
}

interface NutrientSummary {
  nutrient: string;
  level: number;
  status: 'low' | 'good' | 'excellent';
  target: number;
  unit: string;
}

const NUTRIENT_TARGETS = {
  'Iron': { target: 18, unit: 'mg' },
  'Biotin': { target: 30, unit: 'mcg' },
  'Vitamin D': { target: 600, unit: 'IU' },
  'Vitamin B12': { target: 2.4, unit: 'mcg' },
  'Zinc': { target: 11, unit: 'mg' },
  'Protein': { target: 50, unit: 'g' },
  'Vitamin C': { target: 90, unit: 'mg' },
  'Vitamin E': { target: 15, unit: 'mg' },
  'Folate': { target: 400, unit: 'mcg' },
  'Omega-3': { target: 1.6, unit: 'g' },
};

export const useNutrition = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNutritionLogs();
    } else {
      setLogs([]);
      setLoading(false);
    }
  }, [user]);

  const fetchNutritionLogs = async (days = 7) => {
    if (!user) return;

    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);

      const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', fromDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNutritionLog = async (logData: Omit<NutritionLog, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: new Error('No user') };

    try {
      const { data, error } = await supabase
        .from('nutrition_logs')
        .insert({
          ...logData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      setLogs(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      return { error, data: null };
    }
  };

  const getNutrientSummary = (): NutrientSummary[] => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(log => log.date === today);

    return Object.entries(NUTRIENT_TARGETS).map(([nutrient, { target, unit }]) => {
      const totalAmount = todayLogs
        .filter(log => log.nutrient_name === nutrient)
        .reduce((sum, log) => sum + Number(log.amount), 0);

      const percentage = Math.round((totalAmount / target) * 100);
      
      let status: 'low' | 'good' | 'excellent';
      if (percentage >= 90) status = 'excellent';
      else if (percentage >= 70) status = 'good';
      else status = 'low';

      return {
        nutrient,
        level: percentage,
        status,
        target,
        unit,
      };
    });
  };

  const getNutritionScore = (): number => {
    const summary = getNutrientSummary();
    const avgPercentage = summary.reduce((sum, item) => sum + item.level, 0) / summary.length;
    return Math.min(100, Math.round(avgPercentage));
  };

  return {
    logs,
    loading,
    addNutritionLog,
    getNutrientSummary,
    getNutritionScore,
    refetch: fetchNutritionLogs,
  };
};