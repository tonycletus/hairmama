-- Create goal_progress_entries table for detailed progress tracking
CREATE TABLE IF NOT EXISTS public.goal_progress_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.hair_goals(id) ON DELETE CASCADE,
  value DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'bad')),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  sleep_hours DECIMAL(3,1),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  notes TEXT,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goal_habits table for habit tracking
CREATE TABLE IF NOT EXISTS public.goal_habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.hair_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly')),
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')),
  streak INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goal_progress_entries_goal_id ON public.goal_progress_entries(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_entries_date ON public.goal_progress_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_goal_habits_goal_id ON public.goal_habits(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_habits_is_active ON public.goal_habits(is_active);

-- Enable Row Level Security
ALTER TABLE public.goal_progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_habits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for goal_progress_entries
CREATE POLICY "Users can view their own goal progress entries" ON public.goal_progress_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hair_goals
      WHERE public.hair_goals.id = public.goal_progress_entries.goal_id
      AND public.hair_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own goal progress entries" ON public.goal_progress_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hair_goals
      WHERE public.hair_goals.id = public.goal_progress_entries.goal_id
      AND public.hair_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own goal progress entries" ON public.goal_progress_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.hair_goals
      WHERE public.hair_goals.id = public.goal_progress_entries.goal_id
      AND public.hair_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own goal progress entries" ON public.goal_progress_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.hair_goals
      WHERE public.hair_goals.id = public.goal_progress_entries.goal_id
      AND public.hair_goals.user_id = auth.uid()
    )
  );

-- Create RLS policies for goal_habits
CREATE POLICY "Users can view their own goal habits" ON public.goal_habits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hair_goals
      WHERE public.hair_goals.id = public.goal_habits.goal_id
      AND public.hair_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own goal habits" ON public.goal_habits
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.hair_goals
      WHERE public.hair_goals.id = public.goal_habits.goal_id
      AND public.hair_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own goal habits" ON public.goal_habits
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.hair_goals
      WHERE public.hair_goals.id = public.goal_habits.goal_id
      AND public.hair_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own goal habits" ON public.goal_habits
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.hair_goals
      WHERE public.hair_goals.id = public.goal_habits.goal_id
      AND public.hair_goals.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp for goal_habits
CREATE OR REPLACE FUNCTION update_goal_habits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_goal_habits_updated_at
  BEFORE UPDATE ON public.goal_habits
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_habits_updated_at();
