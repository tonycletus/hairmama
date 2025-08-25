-- Create storage bucket for hair photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hair_photos',
  'hair_photos',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
) ON CONFLICT (id) DO NOTHING;

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

