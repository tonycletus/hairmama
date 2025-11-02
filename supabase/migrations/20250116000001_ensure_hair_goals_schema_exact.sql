-- Ensure hair_goals table matches the exact schema provided by user
-- This migration ensures the table structure, constraints, indexes, and triggers match exactly

-- First, ensure the table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.hair_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NULL,
  title text NOT NULL,
  description text NULL,
  target_value numeric(10, 2) NOT NULL,
  current_value numeric(10, 2) NOT NULL DEFAULT 0,
  unit text NOT NULL,
  target_date timestamp with time zone NOT NULL,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  category text NOT NULL,
  status text NOT NULL DEFAULT 'active'::text,
  progress integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT hair_goals_pkey PRIMARY KEY (id),
  CONSTRAINT hair_goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT hair_goals_category_check CHECK (
    (
      category = ANY (
        ARRAY[
          'length'::text,
          'thickness'::text,
          'moisture'::text,
          'strength'::text,
          'curl_definition'::text,
          'scalp_health'::text
        ]
      )
    )
  ),
  CONSTRAINT hair_goals_progress_check CHECK (
    (
      (progress >= 0)
      AND (progress <= 100)
    )
  ),
  CONSTRAINT hair_goals_status_check CHECK (
    (
      status = ANY (
        ARRAY['active'::text, 'completed'::text, 'paused'::text]
      )
    )
  )
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hair_goals_user_id ON public.hair_goals USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_hair_goals_status ON public.hair_goals USING btree (status) TABLESPACE pg_default;

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the update_goal_progress function
CREATE OR REPLACE FUNCTION public.update_goal_progress()
RETURNS TRIGGER AS $$
DECLARE
  value_progress DECIMAL;
  time_progress DECIMAL;
  total_progress DECIMAL;
BEGIN
  -- Calculate value-based progress (current_value / target_value)
  IF NEW.target_value > 0 AND NEW.current_value >= 0 THEN
    value_progress := LEAST(100, GREATEST(0, (NEW.current_value / NEW.target_value) * 100));
  ELSE
    value_progress := 0;
  END IF;
  
  -- Calculate time-based progress
  IF NEW.target_date > NEW.start_date THEN
    time_progress := LEAST(100, GREATEST(0, 
      (EXTRACT(EPOCH FROM (NOW() - NEW.start_date)) / 
       NULLIF(EXTRACT(EPOCH FROM (NEW.target_date - NEW.start_date)), 0)) * 100
    ));
  ELSE
    time_progress := 100;
  END IF;
  
  -- Average the two progress indicators
  total_progress := (value_progress + time_progress) / 2;
  
  -- Ensure progress is between 0 and 100
  NEW.progress := GREATEST(0, LEAST(100, total_progress::INTEGER));
  
  -- Update status based on progress
  IF NEW.progress >= 100 AND NEW.status = 'active' THEN
    NEW.status := 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_hair_goals_progress ON public.hair_goals;
DROP TRIGGER IF EXISTS update_hair_goals_updated_at ON public.hair_goals;

-- Create triggers
CREATE TRIGGER update_hair_goals_progress
  BEFORE INSERT OR UPDATE ON public.hair_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_goal_progress();

CREATE TRIGGER update_hair_goals_updated_at
  BEFORE UPDATE ON public.hair_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

