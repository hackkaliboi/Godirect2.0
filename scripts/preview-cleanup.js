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
 * Database Cleanup Preview Script
 * 
 * This script shows what would be deleted without actually deleting anything.
 * Use this to preview the cleanup operation before running the actual cleanup.
 */

async function previewCleanup() {
  console.log('🔍 Database Cleanup Preview');
  console.log('This shows what WOULD be deleted (no actual changes will be made)');
  console.log('=' .repeat(60));
  console.log('');

  try {
    // Get current user count
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, user_type, first_name, last_name')
      .order('created_at', { ascending: false });

    if (usersError) {
      console.error('❌ Error checking users:', usersError);
      return;
    }

    console.log('✅ USERS THAT WILL BE PRESERVED:');
    console.log(`   Total: ${users?.length || 0} users\n`);
    
    if (users && users.length > 0) {
      const usersByType = users.reduce((acc, user) => {
        acc[user.user_type] = (acc[user.user_type] || 0) + 1;
        return acc;
      }, {});

      Object.entries(usersByType).forEach(([type, count]) => {
        console.log(`   ${type.toUpperCase()}: ${count} users`);
      });
      
      console.log('');
      console.log('   User Details:');
      users.forEach(user => {
        const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'No name';
        console.log(`   - ${user.email} (${name}) - ${user.user_type}`);
      });
    } else {
      console.log('   No users found!');
    }

    console.log('');
    console.log('🗑️  DATA THAT WILL BE DELETED:');
    console.log('');

    // Tables to check (same order as cleanup script)
    const tablesToCheck = [
      { name: 'properties', description: 'Property listings' },
      { name: 'property_images', description: 'Property photos' },
      { name: 'property_views', description: 'Property view tracking' },
      { name: 'agents', description: 'Agent business profiles' },
      { name: 'clients', description: 'Client and lead data' },
      { name: 'sales', description: 'Sales transactions' },
      { name: 'payments', description: 'Payment records' },
      { name: 'inquiries', description: 'Property inquiries' },
      { name: 'favorites', description: 'User favorites' },
      { name: 'testimonials', description: 'Customer testimonials' },
      { name: 'activity_log', description: 'User activity logs' },
      { name: 'dashboard_stats', description: 'Dashboard statistics' },
      { name: 'market_trends', description: 'Market trend data' },
      { name: 'revenue_metrics', description: 'Revenue analytics' },
      { name: 'payment_methods', description: 'Payment method configs' },
      { name: 'payment_method_stats', description: 'Payment statistics' },
      { name: 'notifications', description: 'User notifications' },
      { name: 'support_tickets', description: 'Support tickets' },
      { name: 'support_ticket_messages', description: 'Support messages' },
      { name: 'knowledge_base_articles', description: 'Help articles' }
    ];

    let totalRecordsToDelete = 0;
    const tableStats = [];

    for (const table of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(table.name)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          tableStats.push({
            name: table.name,
            description: table.description,
            count: 'N/A',
            status: 'Table not found or inaccessible'
          });
        } else {
          const recordCount = count || 0;
          totalRecordsToDelete += recordCount;
          tableStats.push({
            name: table.name,
            description: table.description,
            count: recordCount,
            status: recordCount > 0 ? 'Will be cleared' : 'Already empty'
          });
        }
      } catch (err) {
        tableStats.push({
          name: table.name,
          description: table.description,
          count: 'Error',
          status: err.message
        });
      }
    }

    // Display results in a nice format
    console.log('   Table Name'.padEnd(25) + 'Records'.padEnd(10) + 'Description');
    console.log('   ' + '-'.repeat(70));
    
    tableStats.forEach(stat => {
      const countStr = stat.count === 'N/A' || stat.count === 'Error' ? stat.count : stat.count.toString();
      const statusIcon = stat.count > 0 ? '🗑️ ' : stat.count === 0 ? '✅ ' : '⚠️  ';
      console.log(`   ${statusIcon}${stat.name.padEnd(23)}${countStr.padEnd(10)}${stat.description}`);
    });

    console.log('');
    console.log('📊 SUMMARY:');
    console.log(`   Total records to be deleted: ${totalRecordsToDelete.toLocaleString()}`);
    console.log(`   Users to be preserved: ${users?.length || 0}`);
    
    const tablesWithData = tableStats.filter(s => s.count > 0).length;
    const emptyTables = tableStats.filter(s => s.count === 0).length;
    const errorTables = tableStats.filter(s => s.count === 'N/A' || s.count === 'Error').length;
    
    console.log(`   Tables with data: ${tablesWithData}`);
    console.log(`   Empty tables: ${emptyTables}`);
    if (errorTables > 0) {
      console.log(`   Tables with errors: ${errorTables}`);
    }

    console.log('');
    console.log('🚀 NEXT STEPS:');
    if (totalRecordsToDelete > 0) {
      console.log('   To proceed with the actual cleanup, run:');
      console.log('   node cleanup-database.js');
    } else {
      console.log('   No data to clean up! Your database is already clean.');
    }
    
    console.log('');
    console.log('⚠️  REMINDER: The actual cleanup is irreversible!');
    console.log('   Make sure you have backups if you need to recover data.');
    
  } catch (error) {
    console.error('❌ Preview failed:', error);
    process.exit(1);
  }
}

// Run the preview
if (require.main === module) {
  previewCleanup();
}

module.exports = { previewCleanup };