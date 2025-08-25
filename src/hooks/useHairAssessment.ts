import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface HairAssessment {
  id: string;
  user_id: string;
  hair_type: string;
  hair_concerns: string[];
  lifestyle_factors: string[];
  current_routine: string | null;
  hair_goals: string[];
  diet_restrictions: string[];
  supplement_usage: string | null;
  stress_level: number;
  sleep_hours: number;
  exercise_frequency: string | null;
  health_score: number;
  created_at: string;
  updated_at: string;
}

export const useHairAssessment = () => {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<HairAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAssessment();
    } else {
      setAssessment(null);
      setLoading(false);
    }
  }, [user]);

  const fetchAssessment = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('hair_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setAssessment(data);
    } catch (error) {
      console.error('Error fetching assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAssessment = async (assessmentData: Omit<HairAssessment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: new Error('User not authenticated. Please check your email and confirm your account.') };

    try {
      const { data, error } = await supabase
        .from('hair_assessments')
        .insert({
          ...assessmentData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      setAssessment(data);
      return { data, error: null };
    } catch (error) {
      console.error('Assessment creation error:', error);
      return { error, data: null };
    }
  };

  const getHealthScore = async () => {
    if (!user) return 50;

    try {
      const { data, error } = await supabase
        .rpc('calculate_health_score', { user_uuid: user.id });

      if (error) throw error;
      return data || 50;
    } catch (error) {
      console.error('Error calculating health score:', error);
      return 50;
    }
  };

  return {
    assessment,
    loading,
    createAssessment,
    getHealthScore,
    refetch: fetchAssessment,
  };
};