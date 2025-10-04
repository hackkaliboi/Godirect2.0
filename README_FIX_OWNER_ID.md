# Fix for "owner_id column not found" Error

This document provides instructions to fix the "could not find the 'owner_id' column of 'properties' in the schema cache" error.

## Problem

The application code expects an `owner_id` column in the `properties` table, but the database schema still has an `agent_id` column. This mismatch causes the error when trying to list a property.

## Solution

Run the SQL migration script to rename the column and update related policies.

## Instructions

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `FIX_OWNER_ID_COLUMN.sql` into the editor
4. Run the script
5. Refresh your Supabase schema cache

## What the Script Does

- Renames the `agent_id` column to `owner_id` in the `properties` table
- Updates Row Level Security (RLS) policies to use `owner_id`
- Updates database indexes to use `owner_id`
- Preserves existing data during the column rename

## After Running the Script

Once the script has been executed successfully, you should be able to list properties without encountering the schema cache error.