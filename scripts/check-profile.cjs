const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfile() {
  try {
    console.log('🔍 Checking user profiles in database...');
    console.log('=' .repeat(50));
    
    // Get all profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, user_type, full_name, created_at')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('❌ Error accessing profiles table:', error);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('📭 No profiles found in database');
      console.log('\n💡 This means:');
      console.log('   1. No users have registered yet');
      console.log('   2. The signup trigger might not be working');
      console.log('\n🔧 To fix this:');
      console.log('   1. Try registering a new user');
      console.log('   2. Or manually create a profile in Supabase dashboard');
      return;
    }
    
    console.log(`👥 Found ${profiles.length} user profile(s):\n`);
    
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. 📧 Email: ${profile.email}`);
      console.log(`   👤 Name: ${profile.full_name || 'Not set'}`);
      console.log(`   🏷️  Type: ${profile.user_type}`);
      console.log(`   📅 Created: ${new Date(profile.created_at).toLocaleDateString()}`);
      console.log(`   🆔 ID: ${profile.id}`);
      console.log('');
    });
    
    console.log('🔐 LOGIN INSTRUCTIONS:');
    console.log('=' .repeat(50));
    console.log('\nTo access different dashboards, use these URLs:');
    console.log('\n👤 USER LOGIN:');
    console.log('   URL: http://localhost:8081/user-login');
    console.log('   Dashboard: http://localhost:8081/dashboard/user');
    console.log('\n🏢 AGENT LOGIN:');
    console.log('   URL: http://localhost:8081/agent-login');
    console.log('   Dashboard: http://localhost:8081/dashboard/agent');
    console.log('\n⚡ ADMIN LOGIN:');
    console.log('   URL: http://localhost:8081/admin-login');
    console.log('   Dashboard: http://localhost:8081/dashboard/admin');
    
    console.log('\n📝 IMPORTANT NOTES:');
    console.log('   • Use the SAME email/password for all login pages');
    console.log('   • The system will redirect you based on your user_type in the database');
    console.log('   • If you want to access agent dashboard, your user_type must be "agent"');
    
    // Check if any profiles need user_type updates
    const needsUpdate = profiles.filter(p => !p.user_type || p.user_type === 'user');
    if (needsUpdate.length > 0) {
      console.log('\n🔧 TO CHANGE USER TYPE TO AGENT:');
      console.log('   Run this SQL in your Supabase dashboard:');
      needsUpdate.forEach(profile => {
        console.log(`   UPDATE profiles SET user_type = 'agent' WHERE email = '${profile.email}';`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProfile();