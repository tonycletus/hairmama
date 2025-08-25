-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create hair assessment table
CREATE TABLE public.hair_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hair_type TEXT NOT NULL,
  hair_concerns TEXT[] NOT NULL,
  lifestyle_factors TEXT[] NOT NULL,
  current_routine TEXT,
  hair_goals TEXT[] NOT NULL,
  diet_restrictions TEXT[] NOT NULL,
  supplement_usage TEXT,
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  sleep_hours INTEGER CHECK (sleep_hours >= 1 AND sleep_hours <= 12),
  exercise_frequency TEXT,
  health_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create nutrition tracking table
CREATE TABLE public.nutrition_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  nutrient_name TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  food_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create progress photos table
CREATE TABLE public.progress_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('front', 'side', 'back', 'top')),
  analysis_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create remedies tracking table
CREATE TABLE public.remedy_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  remedy_name TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hair_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remedy_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for hair assessments
CREATE POLICY "Users can view their own assessments" 
ON public.hair_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
ON public.hair_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
ON public.hair_assessments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for nutrition logs
CREATE POLICY "Users can view their own nutrition logs" 
ON public.nutrition_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own nutrition logs" 
ON public.nutrition_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition logs" 
ON public.nutrition_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition logs" 
ON public.nutrition_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for progress photos
CREATE POLICY "Users can view their own photos" 
ON public.progress_photos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own photos" 
ON public.progress_photos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos" 
ON public.progress_photos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
ON public.progress_photos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for remedy logs
CREATE POLICY "Users can view their own remedy logs" 
ON public.remedy_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own remedy logs" 
ON public.remedy_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own remedy logs" 
ON public.remedy_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hair_assessments_updated_at
  BEFORE UPDATE ON public.hair_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate health score
CREATE OR REPLACE FUNCTION public.calculate_health_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  base_score INTEGER := 50;
  nutrition_score INTEGER := 0;
  activity_score INTEGER := 0;
  assessment_data RECORD;
BEGIN
  -- Get user's latest assessment data
  SELECT * INTO assessment_data 
  FROM public.hair_assessments 
  WHERE user_id = user_uuid 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF assessment_data IS NULL THEN
    RETURN base_score;
  END IF;
  
  -- Calculate score based on lifestyle factors
  IF assessment_data.sleep_hours >= 7 AND assessment_data.sleep_hours <= 9 THEN
    base_score := base_score + 10;
  END IF;
  
  IF assessment_data.stress_level <= 3 THEN
    base_score := base_score + 15;
  ELSIF assessment_data.stress_level <= 6 THEN
    base_score := base_score + 5;
  END IF;
  
  IF assessment_data.exercise_frequency = 'daily' THEN
    activity_score := 20;
  ELSIF assessment_data.exercise_frequency = 'few_times_week' THEN
    activity_score := 15;
  ELSIF assessment_data.exercise_frequency = 'weekly' THEN
    activity_score := 10;
  END IF;
  
  -- Add recent nutrition tracking bonus
  SELECT COUNT(*) INTO nutrition_score
  FROM public.nutrition_logs
  WHERE user_id = user_uuid 
  AND date >= CURRENT_DATE - INTERVAL '7 days';
  
  IF nutrition_score >= 10 THEN
    base_score := base_score + 15;
  ELSIF nutrition_score >= 5 THEN
    base_score := base_score + 10;
  END IF;
  
  RETURN LEAST(100, base_score + activity_score);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();