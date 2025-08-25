-- Create hair_goals table
CREATE TABLE IF NOT EXISTS public.hair_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  category TEXT NOT NULL CHECK (category IN ('length', 'thickness', 'moisture', 'strength', 'curl_definition', 'scalp_health')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goal_milestones table
CREATE TABLE IF NOT EXISTS public.goal_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.hair_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hair_goals_user_id ON public.hair_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_hair_goals_status ON public.hair_goals(status);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON public.goal_milestones(goal_id);

-- Enable Row Level Security
ALTER TABLE public.hair_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hair_goals
CREATE POLICY "Users can view their own hair goals" ON public.hair_goals
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hair goals" ON public.hair_goals
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hair goals" ON public.hair_goals
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hair goals" ON public.hair_goals
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for goal_milestones
CREATE POLICY "Users can view their own goal milestones" ON public.goal_milestones
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.hair_goals
    WHERE public.hair_goals.id = public.goal_milestones.goal_id
    AND public.hair_goals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own goal milestones" ON public.goal_milestones
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.hair_goals
    WHERE public.hair_goals.id = public.goal_milestones.goal_id
    AND public.hair_goals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own goal milestones" ON public.goal_milestones
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.hair_goals
    WHERE public.hair_goals.id = public.goal_milestones.goal_id
    AND public.hair_goals.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own goal milestones" ON public.goal_milestones
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.hair_goals
    WHERE public.hair_goals.id = public.goal_milestones.goal_id
    AND public.hair_goals.user_id = auth.uid()
  )
);

-- Create function to calculate goal progress
CREATE OR REPLACE FUNCTION public.calculate_goal_progress(
  current_val DECIMAL,
  target_val DECIMAL,
  start_date TIMESTAMP WITH TIME ZONE,
  target_date TIMESTAMP WITH TIME ZONE
)
RETURNS INTEGER AS $$
DECLARE
  value_progress DECIMAL;
  time_progress DECIMAL;
  total_progress DECIMAL;
BEGIN
  -- Calculate value-based progress (0-100%)
  IF target_val > 0 THEN
    value_progress := (current_val / target_val) * 100;
  ELSE
    value_progress := 0;
  END IF;
  
  -- Calculate time-based progress (0-100%)
  IF target_date > start_date THEN
    time_progress := (
      EXTRACT(EPOCH FROM (NOW() - start_date)) / 
      EXTRACT(EPOCH FROM (target_date - start_date))
    ) * 100;
  ELSE
    time_progress := 100;
  END IF;
  
  -- Average the two progress indicators
  total_progress := (value_progress + time_progress) / 2;
  
  -- Ensure progress is between 0 and 100
  RETURN GREATEST(0, LEAST(100, total_progress::INTEGER));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update goal progress
CREATE OR REPLACE FUNCTION public.update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  NEW.progress := public.calculate_goal_progress(
    NEW.current_value,
    NEW.target_value,
    NEW.start_date,
    NEW.target_date
  );
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic progress updates
CREATE TRIGGER update_hair_goals_progress
BEFORE INSERT OR UPDATE ON public.hair_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_goal_progress();

-- Create trigger for updated_at column
CREATE TRIGGER update_hair_goals_updated_at
BEFORE UPDATE ON public.hair_goals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
