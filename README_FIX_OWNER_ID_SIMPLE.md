# Fix for "owner_id column not found" Error (Simple Version)

This document provides instructions to fix the "could not find the 'owner_id' column of 'properties' in the schema cache" error using a simplified SQL script.

## Problem

The application code expects an `owner_id` column in the `properties` table, but the database schema still has an `agent_id` column. This mismatch causes the error when trying to list a property.

## Solution

Run the simplified SQL migration script to rename the column and update related policies.

## Instructions

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `FIX_OWNER_ID_COLUMN_SIMPLE.sql` into the editor
4. Run the script
5. Refresh your Supabase schema cache

## What the Script Does

- Checks if the `agent_id` column exists and renames it to `owner_id` in the `properties` table
- Adds the `owner_id` column as a fallback if it doesn't exist
- Updates Row Level Security (RLS) policies to use `owner_id`
- Updates database indexes to use `owner_id`
- Updates policies for property documents to use `owner_id`
- Preserves existing data during the column rename

## After Running the Script

Once the script has been executed successfully, you should be able to list properties without encountering the schema cache error.