-- STORAGE POLICY FIXES FOR PROPERTY IMAGES
-- This file updates the storage policies to allow regular users to upload property images
-- since we've removed the agent role and users now act as their own agents

-- 1. Update policy for uploading property images (INSERT/UPLOAD)
-- Allow authenticated users to upload images to the property-images bucket
CREATE POLICY "Users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- 2. Update policy for reading property images (SELECT)
-- Allow public read access to property images (this should already exist)
CREATE POLICY "Public read access to property images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- 3. Update policy for updating property images (UPDATE)
-- Allow users to update their own images
CREATE POLICY "Users can update their own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- 4. Update policy for deleting property images (DELETE)
-- Allow users to delete their own images
CREATE POLICY "Users can delete their own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- 5. Ensure the bucket exists and has correct settings
-- Note: This would typically be done through the Supabase dashboard
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('property-images', 'property-images', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Additional policies for avatars (if needed)
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- 7. Refresh the policies
-- This ensures the new policies are applied
-- Note: In Supabase, policies are applied immediately after creation

-- To apply these policies:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Run this script
-- 4. Test image uploads from the property listing form

-- Verification queries:
-- Check existing policies
-- SELECT * FROM pg_policy WHERE polname LIKE '%property%';

-- Check bucket settings
-- SELECT * FROM storage.buckets WHERE id = 'property-images';

-- Test policy effectiveness (as a user)
-- SELECT COUNT(*) FROM storage.objects WHERE bucket_id = 'property-images';