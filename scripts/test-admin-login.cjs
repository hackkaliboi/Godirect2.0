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

async function testAdminLogin() {
  try {
    console.log('🔐 Testing Admin Login Flow...');
    console.log('===============================\n');
    
    // Test with known admin credentials
    const adminEmail = 'pastendro@gmail.com'; // Benjamin Chukwuma - admin
    console.log(`📧 Testing login for: ${adminEmail}`);
    
    // Note: We can't actually test login without password, but we can check the profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, user_type, created_at')
      .eq('email', adminEmail)
      .single();
    
    if (profileError) {
      console.error('❌ Error fetching admin profile:', profileError);
      return;
    }
    
    if (!profileData) {
      console.error('❌ Admin profile not found');
      return;
    }
    
    console.log('✅ Admin Profile Found:');
    console.log(`   📧 Email: ${profileData.email}`);
    console.log(`   👤 Name: ${profileData.full_name}`);
    console.log(`   🏷️  Type: ${profileData.user_type}`);
    console.log(`   🆔 ID: ${profileData.id}`);
    console.log(`   📅 Created: ${new Date(profileData.created_at).toLocaleDateString()}`);
    
    // Test the redirection logic
    console.log('\n🔄 Testing Redirection Logic:');
    if (profileData.user_type === "admin") {
      console.log('✅ Should redirect to: /dashboard/admin');
    } else if (profileData.user_type === "agent") {
      console.log('✅ Should redirect to: /dashboard/agent');
    } else {
      console.log('✅ Should redirect to: /dashboard/user');
    }
    
    console.log('\n📝 DEBUGGING STEPS:');
    console.log('===================');
    console.log('1. Go to: http://localhost:8081/admin-login');
    console.log(`2. Login with: ${adminEmail}`);
    console.log('3. Check browser console for any errors');
    console.log('4. Check if you\'re redirected to /dashboard/admin');
    console.log('\n💡 If you\'re still redirected to user dashboard:');
    console.log('   • Check browser console for JavaScript errors');
    console.log('   • Verify the password is correct');
    console.log('   • Check if there are any authentication errors');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAdminLogin();