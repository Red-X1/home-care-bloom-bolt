
-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images', 
  'site-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
);

-- Create policy to allow public uploads
CREATE POLICY "Anyone can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'site-images');

-- Create policy to allow public access to images
CREATE POLICY "Anyone can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'site-images');

-- Create policy to allow public updates to images
CREATE POLICY "Anyone can update images" ON storage.objects
FOR UPDATE USING (bucket_id = 'site-images');

-- Create policy to allow public deletes to images
CREATE POLICY "Anyone can delete images" ON storage.objects
FOR DELETE USING (bucket_id = 'site-images');
