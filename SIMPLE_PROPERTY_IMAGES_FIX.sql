-- SIMPLE FIX FOR PROPERTY IMAGES UPLOAD ISSUE
-- This script only fixes the property-images bucket permissions
-- Run this with a service role key in Supabase SQL Editor

-- 1. ENSURE THE BUCKET EXISTS AND IS PUBLIC
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. REMOVE RESTRICTIVE POLICIES (if they exist)
DROP POLICY IF EXISTS "Only agents and admins can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Only agents can upload property images" ON storage.objects;

-- 3. CREATE PERMISSIVE POLICY FOR PROPERTY IMAGES
-- Allow authenticated users to upload property images
CREATE POLICY "Allow property image uploads for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images'
);

-- 4. ENSURE PUBLIC READ ACCESS EXISTS
DROP POLICY IF EXISTS "Public read access to property images" ON storage.objects;
CREATE POLICY "Public read access to property images"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'property-images'
);

-- 5. ALLOW USERS TO MANAGE THEIR OWN IMAGES
-- Update their own images
CREATE POLICY "Allow users to update their own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Delete their own images
CREATE POLICY "Allow users to delete their own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- 6. HOW TO RUN THIS SCRIPT
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Make sure you're using the SERVICE ROLE KEY (not anon key)
--    - Project Settings > API > Service Role Key
-- 3. Copy and paste this script
-- 4. Click "Run"

-- 7. VERIFICATION QUERY
-- Run this to verify the policies were created:
-- SELECT polname FROM pg_policy WHERE polname LIKE '%property%';

-- 8. TEST THE FIX
-- After running this script:
-- 1. Log in to your app as a regular user
-- 2. Go to "List Your Property" page
-- 3. Try uploading images
-- 4. The upload should now work