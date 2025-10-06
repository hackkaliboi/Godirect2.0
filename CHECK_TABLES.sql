-- Check if property_viewings table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'property_viewings';

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

-- Check columns in property_viewings table (if it exists)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'property_viewings'
ORDER BY ordinal_position;