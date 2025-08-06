-- Database Cleanup Preview Script for GoDirect Realty
-- This script shows what data would be deleted WITHOUT making any changes
-- Safe to run - READ ONLY operations

-- Display what will be PRESERVED
SELECT '=== DATA THAT WILL BE PRESERVED ===' as section;

SELECT 'User Accounts' as table_name, COUNT(*) as record_count, 'PRESERVED' as status
FROM auth.users
UNION ALL
SELECT 'User Profiles' as table_name, COUNT(*) as record_count, 'PRESERVED' as status
FROM profiles;

-- Display what will be DELETED
SELECT '=== DATA THAT WILL BE DELETED ===' as section;

-- Show what will be deleted (business data) - only for tables that exist
SELECT '=== BUSINESS DATA TO BE DELETED ===' as section;

-- Show counts for existing tables only
WITH table_counts AS (
    SELECT 
        'properties' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'properties') 
             THEN (SELECT COUNT(*) FROM properties) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'agents' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'agents') 
             THEN (SELECT COUNT(*) FROM agents) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'clients' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'clients') 
             THEN (SELECT COUNT(*) FROM clients) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'sales' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sales') 
             THEN (SELECT COUNT(*) FROM sales) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'payments' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payments') 
             THEN (SELECT COUNT(*) FROM payments) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'property_views' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'property_views') 
             THEN (SELECT COUNT(*) FROM property_views) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'favorites' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'favorites') 
             THEN (SELECT COUNT(*) FROM favorites) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'inquiries' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'inquiries') 
             THEN (SELECT COUNT(*) FROM inquiries) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'testimonials' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'testimonials') 
             THEN (SELECT COUNT(*) FROM testimonials) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'notifications' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') 
             THEN (SELECT COUNT(*) FROM notifications) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'activity_log' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'activity_log') 
             THEN (SELECT COUNT(*) FROM activity_log) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'dashboard_stats' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dashboard_stats') 
             THEN (SELECT COUNT(*) FROM dashboard_stats) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'revenue_metrics' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'revenue_metrics') 
             THEN (SELECT COUNT(*) FROM revenue_metrics) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'market_trends' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'market_trends') 
             THEN (SELECT COUNT(*) FROM market_trends) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'payment_methods' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_methods') 
             THEN (SELECT COUNT(*) FROM payment_methods) ELSE NULL END as record_count
    UNION ALL
    SELECT 
        'payment_method_stats' as table_name,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_method_stats') 
             THEN (SELECT COUNT(*) FROM payment_method_stats) ELSE NULL END as record_count
)
SELECT 
    table_name,
    COALESCE(record_count, 0) as records_to_delete,
    CASE 
        WHEN record_count IS NULL THEN 'TABLE DOES NOT EXIST (WILL BE SKIPPED)'
        ELSE 'WILL BE DELETED'
    END as status
FROM table_counts
ORDER BY record_count DESC NULLS LAST;

-- Summary statistics
SELECT '=== CLEANUP SUMMARY ===' as section;

WITH cleanup_stats AS (
  SELECT 
    (SELECT COUNT(*) FROM properties) +
    (SELECT COUNT(*) FROM agents) +
    (SELECT COUNT(*) FROM clients) +
    (SELECT COUNT(*) FROM sales) +
    (SELECT COUNT(*) FROM payments) +
    (SELECT COUNT(*) FROM property_views) +
    (SELECT COUNT(*) FROM favorites) +
    (SELECT COUNT(*) FROM inquiries) +
    (SELECT COUNT(*) FROM testimonials) +
    (SELECT COUNT(*) FROM notifications) +
    (SELECT COUNT(*) FROM activity_log) +
    (SELECT COUNT(*) FROM dashboard_stats) +
    (SELECT COUNT(*) FROM revenue_metrics) +
    (SELECT COUNT(*) FROM market_trends) +
    (SELECT COUNT(*) FROM payment_methods) +
    (SELECT COUNT(*) FROM payment_method_stats) as total_records_to_delete,
    
    (SELECT COUNT(*) FROM auth.users) as users_preserved,
    (SELECT COUNT(*) FROM profiles) as profiles_preserved
)
SELECT 
  'Total records to be deleted: ' || total_records_to_delete as summary
FROM cleanup_stats
UNION ALL
SELECT 
  'User accounts preserved: ' || users_preserved as summary
FROM cleanup_stats
UNION ALL
SELECT 
  'User profiles preserved: ' || profiles_preserved as summary
FROM cleanup_stats;

SELECT 'Preview completed. No data was modified.' as result;