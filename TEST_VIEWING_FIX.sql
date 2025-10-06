-- Test script to verify the property_viewings table fix
-- This script will help verify that the table was created correctly

-- Check if property_viewings table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'property_viewings';

-- Check columns in property_viewings table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'property_viewings'
ORDER BY ordinal_position;

-- Check if property_views table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'property_views';

-- Check columns in property_views table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'property_views'
ORDER BY ordinal_position;

-- Test inserting a sample viewing record (this should work if the fix is successful)
-- Note: You'll need to replace the UUIDs with actual IDs from your database
/*
INSERT INTO property_viewings (
    property_id,
    user_id,
    viewing_date,
    viewing_type,
    status,
    notes
) VALUES (
    '00000000-0000-0000-0000-000000000000',  -- Replace with actual property ID
    '00000000-0000-0000-0000-000000000000',  -- Replace with actual user ID
    NOW() + INTERVAL '1 day',
    'in_person',
    'scheduled',
    'Test viewing appointment'
);
*/