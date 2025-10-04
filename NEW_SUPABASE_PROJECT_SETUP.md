# New Supabase Project Setup Guide

## Overview
This guide will help you set up a fresh Supabase project with the consolidated database schema to permanently resolve the admin login issue.

## Steps to Create a New Supabase Project

### 1. Create a New Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Enter project details:
   - Project name
   - Database password
   - Region
4. Click "Create new project"

### 2. Wait for Project to be Ready
- The project creation process may take a few minutes
- Wait until you see the "Project is ready" message

### 3. Get Project Credentials
1. In your new project dashboard, click on "Project Settings"
2. Go to "API" section
3. Copy the following:
   - Project URL
   - anon key
   - service_role key

### 4. Update Environment Variables
1. Open your `.env` file in the project
2. Update the Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_new_project_url
   VITE_SUPABASE_ANON_KEY=your_new_anon_key
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_new_service_role_key
   ```

### 5. Apply Database Schema
1. In your new Supabase project, go to "SQL Editor"
2. Copy the entire contents of `CONSOLIDATED_DATABASE_FIX.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL

### 6. Verify Database Setup
1. Go to "Table Editor" to verify tables were created
2. Check that the `profiles` table exists
3. Verify that RLS policies are applied

### 7. Verify Storage Buckets
1. Go to "Storage" in Supabase dashboard
2. Verify that three buckets were created:
   - `avatars` - for profile pictures
   - `property-images` - for property photos
   - `documents` - for private documents
3. Check that bucket policies are applied correctly

### 8. Test User Signup
1. Start your application:
   ```bash
   npm run dev
   ```
2. Go to http://localhost:5173
3. Try signing up as an admin user:
   - Go to Admin Signup page
   - Create a new admin account
   - Verify the profile is created with correct user_type

### 9. Test Admin Login
1. Log out if you're logged in
2. Go to Admin Login page
3. Log in with your admin credentials
4. Verify you're redirected to the admin dashboard

## Benefits of Fresh Setup

### 1. Clean Database
- No corrupted or incorrect profile data
- Properly configured RLS policies
- Correct trigger functions

### 2. No Workarounds Needed
- Removed temporary fix pages and buttons
- Clean authentication flow
- Proper user type assignment

### 3. Improved Performance
- Optimized database schema
- Proper indexing
- Efficient queries

## Storage Configuration

The consolidated database setup includes three storage buckets:

### Avatars Bucket
- **Purpose**: User profile pictures
- **Visibility**: Public
- **Size Limit**: 5MB
- **File Types**: JPEG, PNG, WebP, GIF

### Property Images Bucket
- **Purpose**: Property photos and galleries
- **Visibility**: Public
- **Size Limit**: 10MB
- **File Types**: JPEG, PNG, WebP

### Documents Bucket
- **Purpose**: KYC documents, contracts, and private files
- **Visibility**: Private
- **Size Limit**: 20MB
- **File Types**: PDF, JPEG, PNG, DOC, DOCX

See `STORAGE_BUCKET_GUIDE.md` for detailed usage instructions.

## Troubleshooting

### If Signup Fails
1. Check browser console for errors
2. Verify database trigger function exists:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';
   ```
3. Check Supabase logs for any errors

### If Login Redirects Incorrectly
1. Verify the user profile was created correctly:
   ```sql
   SELECT * FROM profiles WHERE email = 'your_admin_email';
   ```
2. Check that user_type is set to 'admin'
3. Verify RLS policies are applied correctly

### If Database Setup Fails
1. Check for syntax errors in the SQL
2. Ensure you're using the latest version of `CONSOLIDATED_DATABASE_FIX.sql`
3. Try running the SQL in smaller chunks if the full file fails

### If Storage Buckets Are Missing
1. Verify the SQL was executed completely
2. Check the "Storage" section in Supabase dashboard
3. Manually create buckets if needed using the configuration in `CONSOLIDATED_DATABASE_FIX.sql`

## Next Steps

### 1. Configure Auth Settings
1. In Supabase dashboard, go to "Authentication"
2. Configure email templates
3. Set up email confirmation if needed
4. Configure sign-up restrictions

### 2. Set Up Storage
1. Go to "Storage" in Supabase dashboard
2. Verify the buckets were created correctly
3. Configure bucket permissions if needed

### 3. Test All User Roles
1. Create test accounts for each role:
   - Admin user
   - Agent user
   - Regular user
2. Verify each can log in and is redirected correctly
3. Test functionality specific to each role

### 4. Test Storage Functionality
1. Upload profile pictures
2. Upload property images (as agent)
3. Upload documents (private storage)
4. Verify access controls work correctly

### 5. Monitor for Issues
1. Check application logs for errors
2. Monitor database performance
3. Verify all features work as expected

## Rollback Plan

If issues occur with the new setup:
1. Revert to your old Supabase project
2. Restore the previous environment variables
3. Use the temporary fix pages if needed while investigating

The fresh setup should resolve all user type issues permanently, eliminating the need for workarounds or temporary fixes.