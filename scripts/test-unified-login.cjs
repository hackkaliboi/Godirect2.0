const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testUnifiedLogin() {
  console.log('🔍 TESTING UNIFIED LOGIN FUNCTIONALITY');
  console.log('=====================================\n');

  try {
    // Test users with different roles
    const testUsers = [
      { email: 'pastendro@gmail.com', expectedType: 'admin', expectedRedirect: '/dashboard/admin' },
      { email: 'nelsonekoh212@gmail.com', expectedType: 'agent', expectedRedirect: '/dashboard/agent' },
      { email: 'philkid59@gmail.com', expectedType: 'user', expectedRedirect: '/dashboard/user' },
      { email: 'test@example.com', expectedType: 'admin', expectedRedirect: '/dashboard/admin' },
    ];

    for (const testUser of testUsers) {
      console.log(`👤 Testing user: ${testUser.email}`);
      
      // Fetch user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type, full_name, email')
        .eq('email', testUser.email)
        .single();

      if (error) {
        console.log(`❌ Profile not found for ${testUser.email}:`, error.message);
        continue;
      }

      console.log(`   📋 Profile found:`);
      console.log(`   - Name: ${profile.full_name}`);
      console.log(`   - Email: ${profile.email}`);
      console.log(`   - Type: ${profile.user_type}`);
      console.log(`   - Expected redirect: ${testUser.expectedRedirect}`);
      
      if (profile.user_type === testUser.expectedType) {
        console.log(`   ✅ User type matches expected: ${testUser.expectedType}`);
      } else {
        console.log(`   ⚠️  User type mismatch! Expected: ${testUser.expectedType}, Got: ${profile.user_type}`);
      }
      
      console.log('');
    }

    console.log('🎯 UNIFIED LOGIN TEST INSTRUCTIONS:');
    console.log('===================================');
    console.log('1. Go to: http://localhost:8081/login');
    console.log('2. Try logging in with any of the test users above');
    console.log('3. Check browser console for debug logs');
    console.log('4. Verify you are redirected to the correct dashboard');
    console.log('');
    console.log('📝 Expected behavior:');
    console.log('- Admin users → /dashboard/admin');
    console.log('- Agent users → /dashboard/agent');
    console.log('- Regular users → /dashboard/user');
    console.log('');
    console.log('🔧 If redirection fails:');
    console.log('- Check browser console for JavaScript errors');
    console.log('- Verify the user\'s password is correct');
    console.log('- Check if the profile exists in the database');
    console.log('- Look for authentication errors in the console');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testUnifiedLogin();