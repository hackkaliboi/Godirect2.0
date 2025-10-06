# Fix for "column property_views.viewing_date does not exist" Error

## Problem
The application was throwing the error "column property_views.viewing_date does not exist" when trying to load dashboard data. This occurred because:

1. The code was trying to access a `viewing_date` column in the `property_views` table
2. The `property_views` table is designed for tracking page views and has a `viewed_at` column instead
3. Scheduled property viewings (appointments) should be stored in a separate `property_viewings` table with a `viewing_date` column

## Solution
We've implemented a two-part fix:

### 1. Database Schema Fix
Created the missing `property_viewings` table using the FIX_TABLE_NAMES.sql script. This script:

- Creates the `property_viewings` table for scheduled property appointments with the correct `viewing_date` column
- Ensures all required tables exist with proper schema
- Sets up appropriate indexes and Row Level Security (RLS) policies

### 2. Code Fix
Updated the application code in `src/utils/supabaseData.ts` to:

- Use the correct `property_viewings` table when fetching scheduled viewings
- Use the correct `property_views` table when fetching page view statistics
- Maintain proper separation between page views and scheduled appointments

## Implementation Steps

1. Run the FIX_TABLE_NAMES.sql script in your Supabase SQL Editor
2. The code changes have already been applied to fix the TypeScript references

## Tables and Their Purposes

- `property_views`: Tracks when users view property listings (page views)
  - Uses `viewed_at` column for timestamps
  
- `property_viewings`: Stores scheduled property viewing appointments
  - Uses `viewing_date` column for appointment times

This separation ensures proper data modeling and eliminates the column reference errors.