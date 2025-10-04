-- FULL STORAGE SETUP FOR GODIRECT REALTY PLATFORM
-- This script sets up all storage buckets and policies for the platform
-- Updated to allow users (not just agents) to upload property images

-- 1. CREATE STORAGE BUCKETS
-- Ensure all required buckets exist with correct settings

-- Property Images Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Avatars Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Documents Bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 2. DROP EXISTING POLICIES (if any)
-- Clean up old policies to avoid conflicts

DROP POLICY IF EXISTS "Only agents and admins can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own property images" ON storage.objects;

DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- 3. CREATE NEW POLICIES

-- PROPERTY IMAGES POLICIES
-- Allow authenticated users to upload property images
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Allow public read access to property images
CREATE POLICY "Public read access to property images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Allow users to update their own property images
CREATE POLICY "Users can update their own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to delete their own property images
CREATE POLICY "Users can delete their own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- AVATARS POLICIES
-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow public read access to avatars
CREATE POLICY "Public read access to avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

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

-- DOCUMENTS POLICIES
-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow users to read their own documents only
CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- 4. ENABLE RLS ON storage.objects
-- Ensure Row Level Security is enabled for storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. VERIFICATION QUERIES
-- Run these queries to verify the setup

-- Check that all buckets exist
-- SELECT id, name, public FROM storage.buckets;

-- Check that policies exist
-- SELECT polname, polroles, polcmd FROM pg_policy 
-- WHERE polname LIKE '%property%' OR polname LIKE '%avatar%' OR polname LIKE '%document%';

-- Check RLS status
-- SELECT relname, relrowsecurity FROM pg_class 
-- WHERE relname = 'objects' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'storage');

-- 6. USAGE EXAMPLES

-- Upload property image (from client-side JavaScript)
-- const { data, error } = await supabase.storage
--   .from('property-images')
--   .upload(`user-id/property-id/image.jpg`, file);

-- Get public URL for property image
-- const { data: { publicUrl } } = supabase.storage
--   .from('property-images')
--   .getPublicUrl('user-id/property-id/image.jpg');

-- Upload avatar
-- const { data, error } = await supabase.storage
--   .from('avatars')
--   .upload(`user-id/avatar.jpg`, file);

-- Upload document (private)
-- const { data, error } = await supabase.storage
--   .from('documents')
--   .upload(`user-id/contract/contract.pdf`, file);

-- Get signed URL for private document (server-side or with service role key)
-- const { data, error } = await supabase.storage
--   .from('documents')
--   .createSignedUrl('user-id/contract/contract.pdf', 60); -- URL valid for 60 seconds

-- 7. TROUBLESHOOTING

-- If you still get permission errors:
-- 1. Verify the user is authenticated
-- 2. Check that the bucket names match exactly
-- 3. Ensure file paths follow the pattern: user-id/filename.ext
-- 4. Verify the user has the correct role in the profiles table

-- Common error fixes:
-- Error: "new row violates row-level security policy"
-- Solution: Ensure the INSERT policy has the correct WITH CHECK condition

-- Error: "permission denied for table objects"
-- Solution: Verify the user is authenticated and the bucket exists

-- To apply these changes:
-- 1. Copy this entire script
-- 2. Go to your Supabase project dashboard
-- 3. Navigate to SQL Editor
-- 4. Paste and run this script
-- 5. Test image uploads from your application