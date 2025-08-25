-- Create hair_photos table for progress tracking
CREATE TABLE IF NOT EXISTS public.hair_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  date_uploaded TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT,
  description TEXT,
  analysis_results JSONB,
  tags TEXT[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hair_photos_user_id ON public.hair_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_hair_photos_date_uploaded ON public.hair_photos(date_uploaded DESC);
CREATE INDEX IF NOT EXISTS idx_hair_photos_analysis_results ON public.hair_photos USING GIN(analysis_results);

-- Enable Row Level Security
ALTER TABLE public.hair_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own hair photos" ON public.hair_photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hair photos" ON public.hair_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hair photos" ON public.hair_photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hair photos" ON public.hair_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hair_photos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_hair_photos_updated_at
  BEFORE UPDATE ON public.hair_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_hair_photos_updated_at();

