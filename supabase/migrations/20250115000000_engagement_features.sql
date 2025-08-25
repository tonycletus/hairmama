-- Create hair_goals table
CREATE TABLE IF NOT EXISTS hair_goals (
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
CREATE TABLE IF NOT EXISTS goal_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES hair_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hair_routines table
CREATE TABLE IF NOT EXISTS hair_routines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'custom')),
  custom_days INTEGER[],
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('morning', 'evening', 'anytime')),
  estimated_duration INTEGER NOT NULL, -- in minutes
  tips TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routine_steps table
CREATE TABLE IF NOT EXISTS routine_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_id UUID REFERENCES hair_routines(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in minutes
  product_ids UUID[],
  tips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routine_products table
CREATE TABLE IF NOT EXISTS routine_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  routine_id UUID REFERENCES hair_routines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('shampoo', 'conditioner', 'mask', 'oil', 'serum', 'styling', 'other')),
  ingredients TEXT[] NOT NULL,
  safety_score INTEGER CHECK (safety_score >= 0 AND safety_score <= 100),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL CHECK (type IN ('routine', 'goal', 'product', 'general')),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('once', 'daily', 'weekly', 'monthly')),
  is_active BOOLEAN DEFAULT TRUE,
  routine_id UUID REFERENCES hair_routines(id) ON DELETE SET NULL,
  goal_id UUID REFERENCES hair_goals(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('progress', 'routine', 'product_review', 'question', 'tip')),
  hair_type TEXT,
  tags TEXT[],
  likes INTEGER DEFAULT 0,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cached_data table for offline functionality
CREATE TABLE IF NOT EXISTS cached_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cache_key TEXT NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, cache_key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hair_goals_user_id ON hair_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_hair_goals_status ON hair_goals(status);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_hair_routines_user_id ON hair_routines(user_id);
CREATE INDEX IF NOT EXISTS idx_routine_steps_routine_id ON routine_steps(routine_id);
CREATE INDEX IF NOT EXISTS idx_routine_products_routine_id ON routine_products(routine_id);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_for ON reminders(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_reminders_is_active ON reminders(is_active);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_cached_data_user_id ON cached_data(user_id);
CREATE INDEX IF NOT EXISTS idx_cached_data_expires_at ON cached_data(expires_at);

-- Create RLS policies
ALTER TABLE hair_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE hair_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_data ENABLE ROW LEVEL SECURITY;

-- Hair goals policies
CREATE POLICY "Users can view their own hair goals" ON hair_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hair goals" ON hair_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hair goals" ON hair_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hair goals" ON hair_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Goal milestones policies
CREATE POLICY "Users can view milestones for their goals" ON goal_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hair_goals 
      WHERE hair_goals.id = goal_milestones.goal_id 
      AND hair_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert milestones for their goals" ON goal_milestones
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM hair_goals 
      WHERE hair_goals.id = goal_milestones.goal_id 
      AND hair_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update milestones for their goals" ON goal_milestones
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM hair_goals 
      WHERE hair_goals.id = goal_milestones.goal_id 
      AND hair_goals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete milestones for their goals" ON goal_milestones
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM hair_goals 
      WHERE hair_goals.id = goal_milestones.goal_id 
      AND hair_goals.user_id = auth.uid()
    )
  );

-- Hair routines policies
CREATE POLICY "Users can view their own hair routines" ON hair_routines
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hair routines" ON hair_routines
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hair routines" ON hair_routines
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hair routines" ON hair_routines
  FOR DELETE USING (auth.uid() = user_id);

-- Routine steps policies
CREATE POLICY "Users can view steps for their routines" ON routine_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hair_routines 
      WHERE hair_routines.id = routine_steps.routine_id 
      AND hair_routines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert steps for their routines" ON routine_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM hair_routines 
      WHERE hair_routines.id = routine_steps.routine_id 
      AND hair_routines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update steps for their routines" ON routine_steps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM hair_routines 
      WHERE hair_routines.id = routine_steps.routine_id 
      AND hair_routines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete steps for their routines" ON routine_steps
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM hair_routines 
      WHERE hair_routines.id = routine_steps.routine_id 
      AND hair_routines.user_id = auth.uid()
    )
  );

-- Routine products policies
CREATE POLICY "Users can view products for their routines" ON routine_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM hair_routines 
      WHERE hair_routines.id = routine_products.routine_id 
      AND hair_routines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert products for their routines" ON routine_products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM hair_routines 
      WHERE hair_routines.id = routine_products.routine_id 
      AND hair_routines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update products for their routines" ON routine_products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM hair_routines 
      WHERE hair_routines.id = routine_products.routine_id 
      AND hair_routines.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete products for their routines" ON routine_products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM hair_routines 
      WHERE hair_routines.id = routine_products.routine_id 
      AND hair_routines.user_id = auth.uid()
    )
  );

-- Reminders policies
CREATE POLICY "Users can view their own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Community posts policies (allow public read, authenticated write)
CREATE POLICY "Anyone can view community posts" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert community posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community posts" ON community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community posts" ON community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies (allow public read, authenticated write)
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Cached data policies
CREATE POLICY "Users can view their own cached data" ON cached_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cached data" ON cached_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cached data" ON cached_data
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cached data" ON cached_data
  FOR DELETE USING (auth.uid() = user_id);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_hair_goals_updated_at 
  BEFORE UPDATE ON hair_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hair_routines_updated_at 
  BEFORE UPDATE ON hair_routines 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at 
  BEFORE UPDATE ON community_posts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate goal progress
CREATE OR REPLACE FUNCTION calculate_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate progress based on current value vs target value and time
  NEW.progress = LEAST(
    GREATEST(
      ROUND(
        (
          (NEW.current_value / NULLIF(NEW.target_value, 0)) * 0.5 +
          (EXTRACT(EPOCH FROM (NOW() - NEW.start_date)) / 
           NULLIF(EXTRACT(EPOCH FROM (NEW.target_date - NEW.start_date)), 0)) * 0.5
        ) * 100
      ),
      0
    ),
    100
  );
  
  -- Update status if progress is 100%
  IF NEW.progress >= 100 THEN
    NEW.status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for goal progress calculation
CREATE TRIGGER calculate_goal_progress_trigger
  BEFORE INSERT OR UPDATE ON hair_goals
  FOR EACH ROW EXECUTE FUNCTION calculate_goal_progress();


