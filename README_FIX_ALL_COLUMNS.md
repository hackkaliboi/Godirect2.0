# Fix for All Property Column Mismatches

This document provides instructions to fix all column mismatches between the application code and database schema that are causing "could not find the 'X' column of 'properties' in the schema cache" errors.

## Problems Identified

1. **Address Column Confusion**: The database schema has both separate address columns (street, city, state, zip_code, country) AND a combined address column, causing confusion.

2. **Missing Columns**: Some expected columns may be missing from the database schema.

3. **Owner ID Issue**: The agent_id column needs to be renamed to owner_id.

## Solution

Run the comprehensive SQL migration script to ensure all required columns exist and are properly configured.

## Instructions

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `FIX_ALL_PROPERTY_COLUMNS.sql` into the editor
4. Run the script
5. Refresh your Supabase schema cache

## What the Script Does

- Checks if all required address columns exist (street, city, state, zip_code, country)
- Adds any missing columns
- Ensures the owner_id column exists (renaming agent_id if necessary)
- Creates necessary indexes
- Preserves existing data

## After Running the Script

Once the script has been executed successfully, you should be able to list properties without encountering schema cache errors for any of the property columns.