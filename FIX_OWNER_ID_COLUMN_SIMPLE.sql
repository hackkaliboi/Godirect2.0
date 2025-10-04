-- =====================================================
-- FIX OWNER_ID COLUMN IN PROPERTIES TABLE (SIMPLIFIED)
-- =====================================================
-- This script fixes the mismatch between the application code and database schema
-- by renaming agent_id to owner_id in the properties table
-- =====================================================

-- First, check if the agent_id column exists and owner_id doesn't
DO $$ 
BEGIN
    -- Check if agent_id column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'agent_id'
    ) THEN
        -- Check if owner_id column doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'properties' AND column_name = 'owner_id'
        ) THEN
            -- Rename agent_id to owner_id
            ALTER TABLE properties RENAME COLUMN agent_id TO owner_id;
        END IF;
    END IF;
END $$;

-- Add owner_id column if it doesn't exist (as a fallback)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE properties ADD COLUMN owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Update RLS policies to use owner_id instead of agent_id
DROP POLICY IF EXISTS "Agents can manage own properties" ON properties;
CREATE POLICY "Owners can manage own properties" ON properties
    FOR ALL USING (
        auth.uid() = owner_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

DROP POLICY IF EXISTS "Agents can insert properties" ON properties;
CREATE POLICY "Owners can insert properties" ON properties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND user_type IN ('admin', 'user')
        )
    );

-- Update indexes to use owner_id
DROP INDEX IF EXISTS idx_properties_agent_id;
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);

-- Update property documents policies to use owner_id
DROP POLICY IF EXISTS "Agents can manage property documents" ON property_documents;
CREATE POLICY "Owners can manage property documents" ON property_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM properties p 
            WHERE p.id = property_id AND p.owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- Update property documents view policy to use owner_id
DROP POLICY IF EXISTS "Users can view property documents" ON property_documents;
CREATE POLICY "Users can view property documents" ON property_documents
    FOR SELECT USING (
        is_public = true OR
        auth.uid() = uploaded_by OR
        EXISTS (
            SELECT 1 FROM properties p 
            WHERE p.id = property_id AND p.owner_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );