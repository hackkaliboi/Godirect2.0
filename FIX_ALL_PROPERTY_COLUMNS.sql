-- =====================================================
-- FIX ALL PROPERTY COLUMN MISMATCHES
-- =====================================================
-- This script fixes all column mismatches between the application code and database schema
-- =====================================================

-- Check if the address column exists and the separate address columns don't exist
DO $$ 
BEGIN
    -- Check if address column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'address'
    ) THEN
        -- Check if street column doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'properties' AND column_name = 'street'
        ) THEN
            -- Add the missing address columns
            ALTER TABLE properties ADD COLUMN street TEXT;
            ALTER TABLE properties ADD COLUMN city VARCHAR(100);
            ALTER TABLE properties ADD COLUMN state VARCHAR(50);
            ALTER TABLE properties ADD COLUMN zip_code VARCHAR(20);
            ALTER TABLE properties ADD COLUMN country VARCHAR(50) DEFAULT 'USA';
        END IF;
    END IF;
END $$;

-- Check if the separate address columns exist but the address column doesn't
DO $$ 
BEGIN
    -- Check if street column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'street'
    ) THEN
        -- Check if address column doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'properties' AND column_name = 'address'
        ) THEN
            -- Add the address column
            ALTER TABLE properties ADD COLUMN address TEXT;
        END IF;
    END IF;
END $$;

-- Ensure all required columns exist
DO $$ 
BEGIN
    -- Add any missing columns that the application expects
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'street'
    ) THEN
        ALTER TABLE properties ADD COLUMN street TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'city'
    ) THEN
        ALTER TABLE properties ADD COLUMN city VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'state'
    ) THEN
        ALTER TABLE properties ADD COLUMN state VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'zip_code'
    ) THEN
        ALTER TABLE properties ADD COLUMN zip_code VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'country'
    ) THEN
        ALTER TABLE properties ADD COLUMN country VARCHAR(50) DEFAULT 'USA';
    END IF;
    
    -- Ensure owner_id exists (in case it was renamed from agent_id)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'owner_id'
    ) THEN
        -- Check if agent_id exists and rename it
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'properties' AND column_name = 'agent_id'
        ) THEN
            ALTER TABLE properties RENAME COLUMN agent_id TO owner_id;
        ELSE
            -- Add owner_id column as fallback
            ALTER TABLE properties ADD COLUMN owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
        END IF;
    END IF;
END $$;

-- Update any missing indexes
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_state ON properties(state);

-- Update RLS policies if they don't reference the correct columns
-- (This is just for documentation - policies would need to be updated separately if needed)