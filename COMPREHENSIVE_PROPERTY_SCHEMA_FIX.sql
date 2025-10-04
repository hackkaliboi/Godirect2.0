-- =====================================================
-- COMPREHENSIVE PROPERTY SCHEMA FIX
-- =====================================================
-- This script ensures all columns expected by the application exist in the database
-- =====================================================

-- Add all missing columns that the application expects
DO $$ 
BEGIN
    -- Check and add id column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'id'
    ) THEN
        ALTER TABLE properties ADD COLUMN id UUID PRIMARY KEY DEFAULT uuid_generate_v4();
    END IF;
    
    -- Check and add title column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'title'
    ) THEN
        ALTER TABLE properties ADD COLUMN title VARCHAR(255) NOT NULL DEFAULT '';
    END IF;
    
    -- Check and add description column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'description'
    ) THEN
        ALTER TABLE properties ADD COLUMN description TEXT;
    END IF;
    
    -- Check and add price column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'price'
    ) THEN
        ALTER TABLE properties ADD COLUMN price DECIMAL(12,2) NOT NULL DEFAULT 0;
    END IF;
    
    -- Check and add property_type column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'property_type'
    ) THEN
        ALTER TABLE properties ADD COLUMN property_type VARCHAR(50) NOT NULL DEFAULT 'house';
    END IF;
    
    -- Check and add status column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'status'
    ) THEN
        ALTER TABLE properties ADD COLUMN status VARCHAR(20) DEFAULT 'available';
    END IF;
    
    -- Check and add bedrooms column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'bedrooms'
    ) THEN
        ALTER TABLE properties ADD COLUMN bedrooms INTEGER;
    END IF;
    
    -- Check and add bathrooms column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'bathrooms'
    ) THEN
        ALTER TABLE properties ADD COLUMN bathrooms DECIMAL(3,1);
    END IF;
    
    -- Check and add square_feet column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'square_feet'
    ) THEN
        ALTER TABLE properties ADD COLUMN square_feet INTEGER;
    END IF;
    
    -- Check and add lot_size column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'lot_size'
    ) THEN
        ALTER TABLE properties ADD COLUMN lot_size DECIMAL(10,2);
    END IF;
    
    -- Check and add year_built column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'year_built'
    ) THEN
        ALTER TABLE properties ADD COLUMN year_built INTEGER;
    END IF;
    
    -- Check and add street column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'street'
    ) THEN
        ALTER TABLE properties ADD COLUMN street TEXT;
    END IF;
    
    -- Check and add city column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'city'
    ) THEN
        ALTER TABLE properties ADD COLUMN city VARCHAR(100);
    END IF;
    
    -- Check and add state column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'state'
    ) THEN
        ALTER TABLE properties ADD COLUMN state VARCHAR(50);
    END IF;
    
    -- Check and add zip_code column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'zip_code'
    ) THEN
        ALTER TABLE properties ADD COLUMN zip_code VARCHAR(20);
    END IF;
    
    -- Check and add country column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'country'
    ) THEN
        ALTER TABLE properties ADD COLUMN country VARCHAR(50) DEFAULT 'USA';
    END IF;
    
    -- Check and add latitude column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'latitude'
    ) THEN
        ALTER TABLE properties ADD COLUMN latitude DECIMAL(10, 8);
    END IF;
    
    -- Check and add longitude column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'longitude'
    ) THEN
        ALTER TABLE properties ADD COLUMN longitude DECIMAL(11, 8);
    END IF;
    
    -- Check and add images column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'images'
    ) THEN
        ALTER TABLE properties ADD COLUMN images TEXT[];
    END IF;
    
    -- Check and add features column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'features'
    ) THEN
        ALTER TABLE properties ADD COLUMN features TEXT[];
    END IF;
    
    -- Check and add amenities column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'amenities'
    ) THEN
        ALTER TABLE properties ADD COLUMN amenities TEXT[];
    END IF;
    
    -- Check and add virtual_tour_url column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'virtual_tour_url'
    ) THEN
        ALTER TABLE properties ADD COLUMN virtual_tour_url TEXT;
    END IF;
    
    -- Check and add is_featured column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'is_featured'
    ) THEN
        ALTER TABLE properties ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Check and add views_count column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'views_count'
    ) THEN
        ALTER TABLE properties ADD COLUMN views_count INTEGER DEFAULT 0;
    END IF;
    
    -- Check and add owner_id column if missing
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
    
    -- Check and add created_at column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE properties ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Check and add updated_at column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE properties ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create necessary indexes
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_state ON properties(state);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON properties(is_featured);

-- Add constraints if they don't exist
DO $$ 
BEGIN
    -- Add property_type constraint
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'properties_property_type_check'
    ) THEN
        ALTER TABLE properties ADD CONSTRAINT properties_property_type_check 
        CHECK (property_type IN ('house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'));
    END IF;
    
    -- Add status constraint
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'properties_status_check'
    ) THEN
        ALTER TABLE properties ADD CONSTRAINT properties_status_check 
        CHECK (status IN ('available', 'pending', 'sold', 'rented', 'withdrawn'));
    END IF;
END $$;