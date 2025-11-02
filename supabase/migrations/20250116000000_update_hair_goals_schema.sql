-- Update hair_goals table to match the exact schema provided
-- This migration ensures the schema matches the required structure

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_hair_goals_progress ON public.hair_goals;
DROP TRIGGER IF EXISTS update_hair_goals_updated_at ON public.hair_goals;

-- Drop existing functions if they exist (we'll recreate them)
DROP FUNCTION IF EXISTS public.update_goal_progress();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Ensure the table structure matches exactly
-- Note: We assume the table already exists, this migration ensures it has the correct structure
DO $$
BEGIN
  -- Check and add columns if they don't exist (for existing installations)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'hair_goals' 
    AND column_name = 'description'
  ) THEN
    ALTER TABLE public.hair_goals ADD COLUMN description TEXT;
  END IF;

  -- Ensure all columns match the schema exactly
  -- The table should already have these columns from previous migrations
  -- This is mainly for ensuring constraints and indexes match
END $$;

-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the update_goal_progress function
-- This function calculates progress based on current_value vs target_value
CREATE OR REPLACE FUNCTION public.update_goal_progress()
RETURNS TRIGGER AS $$
DECLARE
  value_progress DECIMAL;
  time_progress DECIMAL;
  total_progress DECIMAL;
BEGIN
  -- Calculate value-based progress
  IF NEW.target_value > 0 AND NEW.current_value >= 0 THEN
    -- Progress from 0 to target
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

-- Recreate triggers
CREATE TRIGGER update_hair_goals_progress
  BEFORE INSERT OR UPDATE ON public.hair_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_goal_progress();

CREATE TRIGGER update_hair_goals_updated_at
  BEFORE UPDATE ON public.hair_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_hair_goals_user_id ON public.hair_goals USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_hair_goals_status ON public.hair_goals USING btree (status);

