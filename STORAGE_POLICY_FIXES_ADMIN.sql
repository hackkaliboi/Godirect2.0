-- STORAGE POLICY FIXES FOR PROPERTY IMAGES - ADMIN VERSION
-- This file updates the storage policies to allow regular users to upload property images
-- NOTE: This must be run with a user that has administrative privileges (usually the service role)

-- IMPORTANT: HOW TO RUN THIS SCRIPT
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Click on the "SQL" tab
-- 4. Copy and paste this entire script
-- 5. Make sure you're using a service role key (not an anon or user key)
--    - Go to Project Settings > API
--    - Use the "service_role" key under "Service Roles" (not the anon/public key)
-- 6. Run the script

-- If you're getting "must be owner of table objects" error, it means:
-- 1. You're not using a service role key, OR
-- 2. You don't have the necessary privileges

-- 1. ENSURE BUCKETS EXIST WITH CORRECT SETTINGS
-- First, make sure the property-images bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. DROP EXISTING RESTRICTIVE POLICIES
-- Remove the old policies that only allow agents and admins
-- These commands might fail if the policies don't exist, which is fine

-- For property-images bucket
DROP POLICY IF EXISTS "Only agents and admins can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Only agents can upload property images" ON storage.objects;

-- For avatars bucket
DROP POLICY IF EXISTS "Only admins can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Only agents can upload avatars" ON storage.objects;

-- 3. CREATE NEW POLICIES THAT ALLOW AUTHENTICATED USERS

-- PROPERTY IMAGES POLICIES
-- Allow authenticated users to upload property images
CREATE POLICY "Allow authenticated users to upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images'
);

-- Allow public read access to property images (should already exist)
DROP POLICY IF EXISTS "Public read access to property images" ON storage.objects;
CREATE POLICY "Public read access to property images"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'property-images'
);

-- Allow users to update their own property images
CREATE POLICY "Allow users to update their own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to delete their own property images
CREATE POLICY "Allow users to delete their own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- AVATARS POLICIES
-- Allow authenticated users to upload avatars
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
);

-- Allow public read access to avatars (should already exist)
DROP POLICY IF EXISTS "Public read access to avatars" ON storage.objects;
CREATE POLICY "Public read access to avatars"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id = 'avatars'
);

-- Allow users to update their own avatars
CREATE POLICY "Allow users to update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to delete their own avatars
CREATE POLICY "Allow users to delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- DOCUMENTS POLICIES (private storage)
-- Allow authenticated users to upload documents
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
);

-- Allow users to read their own documents only
CREATE POLICY "Allow users to read their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to update their own documents
CREATE POLICY "Allow users to update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to delete their own documents
CREATE POLICY "Allow users to delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- 4. VERIFY POLICIES WERE CREATED
-- Run this query to check that the policies exist:
-- SELECT polname FROM pg_policy WHERE polname LIKE '%property%' OR polname LIKE '%avatar%' OR polname LIKE '%document%';

-- 5. TROUBLESHOOTING

-- If you still get "must be owner of table objects":
-- 1. Make sure you're using the service_role key (not anon or user key)
-- 2. Make sure you're running this in the Supabase SQL Editor
-- 3. Check that your user has the necessary privileges

-- If you get "policy already exists" errors:
-- This is normal and expected. The DROP POLICY commands should remove them first.

-- If you get "bucket already exists" errors:
-- This is normal. The INSERT ... ON CONFLICT commands handle this.

-- 6. TESTING THE FIX

-- After running this script, test image uploads:
-- 1. Log in to your application as a regular user
-- 2. Go to the "List Your Property" page
-- 3. Try to upload images
-- 4. The upload should now work without permission errors

-- 7. ALTERNATIVE APPROACH (if the above doesn't work)

-- If you're still having issues, you can try this simpler approach:
-- Connect to your Supabase database directly with a PostgreSQL client
-- using the database credentials (not the API keys) and run:

/*
-- Connect with psql or another PostgreSQL client using DB credentials
-- Then run these commands:

-- Make sure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows authenticated users to upload to property-images
CREATE POLICY "Allow uploads to property-images for authenticated users"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');
*/

-- 8. FINAL VERIFICATION

-- After running this script successfully, you can verify with:
-- SELECT * FROM storage.buckets WHERE id IN ('property-images', 'avatars', 'documents');
-- SELECT polname FROM pg_policy WHERE polrelid = 'storage.objects'::regclass;