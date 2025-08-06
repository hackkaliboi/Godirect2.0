-- Database Cleanup Script for GoDirect Realty
-- This script removes all business data while preserving user accounts
-- WARNING: This operation is IRREVERSIBLE!

-- Start transaction to ensure atomicity
BEGIN;

-- Display current user count before cleanup
SELECT 'Current user count:' as info, COUNT(*) as count FROM auth.users;
SELECT 'Current profile count:' as info, COUNT(*) as count FROM profiles;

-- Clean up business data tables (in order to respect foreign key constraints)
-- Using DO blocks to handle tables that may not exist yet

-- 1. Clean up dependent tables first
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'property_views') THEN
        DELETE FROM property_views;
        RAISE NOTICE 'Cleaned property_views table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') THEN
        DELETE FROM favorites;
        RAISE NOTICE 'Cleaned favorites table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'inquiries') THEN
        DELETE FROM inquiries;
        RAISE NOTICE 'Cleaned inquiries table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sales') THEN
        DELETE FROM sales;
        RAISE NOTICE 'Cleaned sales table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') THEN
        DELETE FROM payments;
        RAISE NOTICE 'Cleaned payments table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'testimonials') THEN
        DELETE FROM testimonials;
        RAISE NOTICE 'Cleaned testimonials table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN
        DELETE FROM notifications;
        RAISE NOTICE 'Cleaned notifications table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'activity_log') THEN
        DELETE FROM activity_log;
        RAISE NOTICE 'Cleaned activity_log table';
    END IF;
END $$;

-- 2. Clean up main business entities
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'properties') THEN
        DELETE FROM properties;
        RAISE NOTICE 'Cleaned properties table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'agents') THEN
        DELETE FROM agents;
        RAISE NOTICE 'Cleaned agents table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'clients') THEN
        DELETE FROM clients;
        RAISE NOTICE 'Cleaned clients table';
    END IF;
END $$;

-- 3. Clean up analytics and metrics
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dashboard_stats') THEN
        DELETE FROM dashboard_stats;
        RAISE NOTICE 'Cleaned dashboard_stats table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'revenue_metrics') THEN
        DELETE FROM revenue_metrics;
        RAISE NOTICE 'Cleaned revenue_metrics table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'market_trends') THEN
        DELETE FROM market_trends;
        RAISE NOTICE 'Cleaned market_trends table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_method_stats') THEN
        DELETE FROM payment_method_stats;
        RAISE NOTICE 'Cleaned payment_method_stats table';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_methods') THEN
        DELETE FROM payment_methods;
        RAISE NOTICE 'Cleaned payment_methods table';
    END IF;
END $$;

-- 4. Reset any auto-increment sequences (if using SERIAL columns)
-- Note: Supabase uses UUID by default, but including for completeness
ALTER SEQUENCE IF EXISTS properties_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS agents_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS clients_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS sales_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS payments_id_seq RESTART WITH 1;

-- 5. Insert fresh dashboard stats with zero values
-- Based on actual dashboard_stats schema: stat_name, stat_value, trend, stat_change, compare_text
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dashboard_stats') THEN
        -- Insert basic dashboard statistics with zero values
        INSERT INTO dashboard_stats (id, stat_name, stat_value, trend, stat_change, compare_text, updated_at)
        VALUES 
            (gen_random_uuid(), 'Total Properties', '0', 'stable', 0, 'vs last month', NOW()),
            (gen_random_uuid(), 'Total Sales', '0', 'stable', 0, 'vs last month', NOW()),
            (gen_random_uuid(), 'Total Revenue', '$0', 'stable', 0, 'vs last month', NOW()),
            (gen_random_uuid(), 'Active Agents', '0', 'stable', 0, 'vs last month', NOW());
        RAISE NOTICE 'Reset dashboard_stats with zero values';
    END IF;
END $$;

-- Display final counts
SELECT 'Cleanup completed. Remaining user count:' as info, COUNT(*) as count FROM auth.users;
SELECT 'Remaining profile count:' as info, COUNT(*) as count FROM profiles;

-- Show remaining counts for business tables (only if they exist)
DO $$
DECLARE
    table_exists boolean;
    record_count integer;
BEGIN
    RAISE NOTICE '=== FINAL COUNTS AFTER CLEANUP ===';
    
    -- Check properties table
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'properties') INTO table_exists;
    IF table_exists THEN
        SELECT COUNT(*) FROM properties INTO record_count;
        RAISE NOTICE 'Properties remaining: %', record_count;
    ELSE
        RAISE NOTICE 'Properties table does not exist';
    END IF;
    
    -- Check agents table
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'agents') INTO table_exists;
    IF table_exists THEN
        SELECT COUNT(*) FROM agents INTO record_count;
        RAISE NOTICE 'Agents remaining: %', record_count;
    ELSE
        RAISE NOTICE 'Agents table does not exist';
    END IF;
    
    -- Check sales table
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sales') INTO table_exists;
    IF table_exists THEN
        SELECT COUNT(*) FROM sales INTO record_count;
        RAISE NOTICE 'Sales remaining: %', record_count;
    ELSE
        RAISE NOTICE 'Sales table does not exist';
    END IF;
END $$;

-- Commit the transaction
COMMIT;

-- Success message
SELECT 'Database cleanup completed successfully! All business data removed, user accounts preserved.' as result;