# Merged Database Setup for Godirect Realty

## Overview

This directory contains a single comprehensive SQL file that consolidates all database setup and configuration for the Godirect Realty platform:

- **[MERGED_DATABASE_SETUP.sql](MERGED_DATABASE_SETUP.sql)** - Complete database setup in one file

## What's Included

The merged SQL file contains everything needed to set up the Godirect Realty database:

1. **Complete table structure** - All tables with proper relationships
2. **Performance indexes** - Optimized database indexes for faster queries
3. **Improved triggers** - Enhanced user profile creation trigger with better error handling
4. **Fixed RLS policies** - Row Level Security policies without recursion issues
5. **Storage bucket configuration** - Proper setup for property images, avatars, and documents
6. **Essential configuration data** - Default settings, currencies, and system values

## Key Features

### Tables
- User profiles and authentication
- Property listings with all details
- Property inquiries and applications
- Messaging system (conversations and messages)
- Testimonials and blog posts
- Financial tracking (revenue, commissions, transactions)
- User preferences and settings
- KYC verification system
- Search and comparison features
- Notification system
- Subscription management

### Storage Buckets
- `property-images` - Public storage for property images
- `avatars` - Public storage for user profile pictures
- `documents` - Private storage for sensitive documents

### Security
- Row Level Security (RLS) policies for all tables
- Proper access controls for different user types
- Secure storage policies with appropriate permissions

## How to Use

1. **Prerequisites**
   - A Supabase project
   - Service role key (not anon key) for running the script

2. **Setup Steps**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Make sure you're using the SERVICE ROLE KEY (not anon key)
     - Project Settings > API > Service Role Key
   - Copy and paste the entire contents of [MERGED_DATABASE_SETUP.sql](MERGED_DATABASE_SETUP.sql)
   - Click "Run" to execute the script

3. **Verification**
   - Check that all tables were created
   - Verify storage buckets exist with correct settings
   - Confirm RLS policies are applied
   - Test user signup functionality

## Benefits

- **Single Execution**: Run once to set up the entire database
- **No Dependencies**: All required components in one file
- **Latest Fixes**: Includes all the latest database improvements
- **Easy Deployment**: Simplifies setup for new environments
- **Consistent State**: Ensures all database elements are properly configured together

## Troubleshooting

If you encounter issues:

1. **"must be owner of table objects" error**
   - Make sure you're using the service role key
   - Verify you're running in the Supabase SQL Editor

2. **Policy conflicts**
   - The script automatically drops existing policies before creating new ones

3. **Table already exists**
   - The script uses `IF NOT EXISTS` clauses to handle existing tables gracefully

## Maintenance

This merged file should be updated whenever significant database changes are made to ensure:
- New deployments have the latest schema
- All environments stay in sync
- Setup process remains simple and reliable

For questions or issues, please refer to the main project documentation or contact the development team.