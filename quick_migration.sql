-- Quick Migration Script for Hair Photos
-- Copy and paste this entire script into your Supabase SQL Editor

-- Create hair_photos table for progress tracking
CREATE TABLE IF NOT EXISTS public.hair_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  tags TEXT[],
  analysis_results JSONB,
  date_uploaded TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for hair_photos
CREATE INDEX IF NOT EXISTS idx_hair_photos_user_id ON public.hair_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_hair_photos_date_uploaded ON public.hair_photos(date_uploaded DESC);
CREATE INDEX IF NOT EXISTS idx_hair_photos_analysis_results ON public.hair_photos USING GIN(analysis_results);

-- Enable Row Level Security for hair_photos
ALTER TABLE public.hair_photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own hair photos" ON public.hair_photos;
DROP POLICY IF EXISTS "Users can insert their own hair photos" ON public.hair_photos;
DROP POLICY IF EXISTS "Users can update their own hair photos" ON public.hair_photos;
DROP POLICY IF EXISTS "Users can delete their own hair photos" ON public.hair_photos;

-- Create RLS policies for hair_photos
CREATE POLICY "Users can view their own hair photos" ON public.hair_photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hair photos" ON public.hair_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hair photos" ON public.hair_photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hair photos" ON public.hair_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for hair photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hair_photos',
  'hair_photos',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own hair photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own hair photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own hair photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own hair photos" ON storage.objects;

-- Create storage policy for authenticated users to upload their own photos
CREATE POLICY "Users can upload their own hair photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'hair_photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policy for users to view their own photos
CREATE POLICY "Users can view their own hair photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'hair_photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policy for users to update their own photos
CREATE POLICY "Users can update their own hair photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'hair_photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policy for users to delete their own photos
CREATE POLICY "Users can delete their own hair photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'hair_photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
