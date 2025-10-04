-- Add 'rejected' status to properties table constraint
-- First drop the existing constraint
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;

-- Add the new constraint with 'rejected' status included
ALTER TABLE properties ADD CONSTRAINT properties_status_check 
CHECK (status IN ('available', 'pending', 'sold', 'rented', 'withdrawn', 'rejected'));