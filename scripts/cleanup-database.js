const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jhzaeleoqhxvpzlicmtq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required for this operation');
  console.log('Please set the service role key in your environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Database Cleanup Script
 * 
 * This script removes all business data while preserving:
 * - Users (auth.users)
 * - User profiles (public.profiles)
 * 
 * Tables that will be CLEARED:
 * - properties (all property listings)
 * - property_images (property photos)
 * - property_views (view tracking)
 * - agents (agent data - will be regenerated from profiles)
 * - clients (client data)
 * - sales (transaction records)
 * - payments (payment records)
 * - inquiries (property inquiries)
 * - favorites (user favorites)
 * - testimonials (customer testimonials)
 * - activity_log (user activity tracking)
 * - dashboard_stats (dashboard statistics)
 * - market_trends (market data)
 * - revenue_metrics (revenue tracking)
 * - payment_methods (payment method configs)
 * - payment_method_stats (payment statistics)
 * - notifications (user notifications)
 * - support_tickets (support tickets)
 * - support_ticket_messages (support messages)
 * - knowledge_base_articles (help articles)
 */

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...');
  console.log('⚠️  This will remove ALL business data while preserving users!');
  console.log('');

  try {
    // Get current user count before cleanup
    const { data: usersBefore, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, user_type')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ Error checking users:', usersError);
      return;
    }

    console.log(`👥 Found ${usersBefore?.length || 0} users that will be preserved:`);
    usersBefore?.forEach(user => {
      console.log(`   - ${user.email} (${user.user_type})`);
    });
    console.log('');

    // Tables to clean up (order matters due to foreign key constraints)
    const tablesToCleanup = [
      // Dependent tables first
      'property_views',
      'property_images', 
      'favorites',
      'inquiries',
      'sales',
      'payments',
      'support_ticket_messages',
      'support_tickets',
      'notifications',
      'activity_log',
      
      // Main business tables
      'properties',
      'agents',
      'clients',
      'testimonials',
      
      // Statistics and analytics
      'dashboard_stats',
      'market_trends',
      'revenue_metrics',
      'payment_method_stats',
      'payment_methods',
      
      // Knowledge base
      'knowledge_base_articles'
    ];

    console.log('🗑️  Cleaning up tables...');
    
    for (const table of tablesToCleanup) {
      try {
        console.log(`   Clearing ${table}...`);
        
        // Get count before deletion
        const { count: beforeCount } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        // Delete all records
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
        
        if (error) {
          console.warn(`   ⚠️  Warning: Could not clear ${table}:`, error.message);
        } else {
          console.log(`   ✅ Cleared ${beforeCount || 0} records from ${table}`);
        }
      } catch (err) {
        console.warn(`   ⚠️  Warning: Error clearing ${table}:`, err.message);
      }
    }

    console.log('');
    console.log('🔄 Resetting dashboard statistics...');
    
    // Insert fresh dashboard stats with zero values
    const freshStats = [
      {
        stat_name: 'total_properties',
        stat_value: '0',
        stat_change: 0,
        trend: 'neutral',
        compare_text: 'vs last month'
      },
      {
        stat_name: 'total_sales',
        stat_value: '0',
        stat_change: 0,
        trend: 'neutral',
        compare_text: 'vs last month'
      },
      {
        stat_name: 'total_revenue',
        stat_value: '$0',
        stat_change: 0,
        trend: 'neutral',
        compare_text: 'vs last month'
      },
      {
        stat_name: 'active_agents',
        stat_value: usersBefore?.filter(u => u.user_type === 'agent').length.toString() || '0',
        stat_change: 0,
        trend: 'neutral',
        compare_text: 'vs last month'
      }
    ];

    const { error: statsError } = await supabase
      .from('dashboard_stats')
      .insert(freshStats);

    if (statsError) {
      console.warn('⚠️  Warning: Could not reset dashboard stats:', statsError.message);
    } else {
      console.log('✅ Reset dashboard statistics with fresh values');
    }

    console.log('');
    console.log('📊 Final verification...');
    
    // Verify users are still intact
    const { data: usersAfter, error: usersAfterError } = await supabase
      .from('profiles')
      .select('id, email, user_type')
      .order('created_at', { ascending: false });

    if (usersAfterError) {
      console.error('❌ Error verifying users:', usersAfterError);
    } else {
      console.log(`👥 Verified: ${usersAfter?.length || 0} users preserved`);
    }

    // Check a few key tables to confirm cleanup
    const verificationTables = ['properties', 'sales', 'payments', 'agents'];
    for (const table of verificationTables) {
      try {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        console.log(`📋 ${table}: ${count || 0} records remaining`);
      } catch (err) {
        console.log(`📋 ${table}: Could not verify (table may not exist)`);
      }
    }

    console.log('');
    console.log('🎉 Database cleanup completed successfully!');
    console.log('');
    console.log('✅ What was preserved:');
    console.log('   - All user accounts and authentication');
    console.log('   - User profiles and settings');
    console.log('');
    console.log('🗑️  What was cleaned:');
    console.log('   - All property listings and images');
    console.log('   - All sales and transaction records');
    console.log('   - All agent business data');
    console.log('   - All client and inquiry data');
    console.log('   - All analytics and statistics');
    console.log('   - All notifications and support tickets');
    console.log('');
    console.log('🚀 Your platform is now ready for fresh data!');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

// Confirmation prompt
function askForConfirmation() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('⚠️  WARNING: This will permanently delete ALL business data!');
  console.log('   Only user accounts and profiles will be preserved.');
  console.log('');
  
  rl.question('Are you sure you want to proceed? Type "YES" to continue: ', (answer) => {
    if (answer === 'YES') {
      rl.close();
      cleanupDatabase();
    } else {
      console.log('❌ Cleanup cancelled.');
      rl.close();
      process.exit(0);
    }
  });
}

// Run the script
if (require.main === module) {
  askForConfirmation();
}

module.exports = { cleanupDatabase };