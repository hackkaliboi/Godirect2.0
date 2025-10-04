# Comprehensive Property Schema Fix

This document provides instructions to fix all column mismatches between the application code and database schema that are causing "could not find the 'X' column of 'properties' in the schema cache" errors.

## Problems Identified

1. **Missing Columns**: The database may be missing columns that the application expects
2. **Column Name Mismatches**: Agent-related columns need to be updated to owner-related columns
3. **Incomplete Schema**: Some installations may have an incomplete database schema

## Solution

Run the comprehensive SQL migration script to ensure all required columns exist and are properly configured.

## Instructions

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `COMPREHENSIVE_PROPERTY_SCHEMA_FIX.sql` into the editor
4. Run the script
5. Refresh your Supabase schema cache

## What the Script Does

- Checks for and adds all missing columns that the application expects
- Renames agent_id to owner_id if necessary
- Creates necessary indexes for performance
- Adds constraints to ensure data integrity
- Preserves existing data
- Works with both complete and incomplete database schemas

## Columns Added/Verified

The script ensures the following columns exist in the properties table:
- id (UUID)
- title (VARCHAR)
- description (TEXT)
- price (DECIMAL)
- property_type (VARCHAR)
- status (VARCHAR)
- bedrooms (INTEGER)
- bathrooms (DECIMAL)
- square_feet (INTEGER)
- lot_size (DECIMAL)
- year_built (INTEGER)
- street (TEXT)
- city (VARCHAR)
- state (VARCHAR)
- zip_code (VARCHAR)
- country (VARCHAR)
- latitude (DECIMAL)
- longitude (DECIMAL)
- images (TEXT[])
- features (TEXT[])
- amenities (TEXT[])
- virtual_tour_url (TEXT)
- is_featured (BOOLEAN)
- views_count (INTEGER)
- owner_id (UUID)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## After Running the Script

Once the script has been executed successfully, you should be able to list properties without encountering schema cache errors for any of the property columns.