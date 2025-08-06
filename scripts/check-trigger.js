import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTrigger() {
  try {
    console.log('Checking if trigger function exists...');
    
    // Check if the handle_new_user function exists
    const { data: functions, error: funcError } = await supabase.rpc('sql', {
      query: `
        SELECT routine_name, routine_type 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
        AND routine_name = 'handle_new_user';
      `
    });
    
    if (funcError) {
      console.log('❌ Cannot check functions directly. This is normal with RLS.');
      console.log('Let me check the profiles table structure instead...');
      
      // Check profiles table structure
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (profileError) {
        console.error('❌ Error accessing profiles table:', profileError.message);
        if (profileError.code === '42P01') {
          console.log('\n🔧 SOLUTION: The profiles table does not exist.');
          console.log('Run the SQL from setup-profiles.js in your Supabase dashboard.');
        }
        return;
      }
      
      console.log('✅ Profiles table exists and is accessible.');
      
      // Check current profiles
      const { data: allProfiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, email, role, created_at')
        .order('created_at', { ascending: false });
        
      if (fetchError) {
        console.error('Error fetching profiles:', fetchError);
      } else {
        console.log(`\n📊 Found ${allProfiles.length} profiles in the database.`);
        
        if (allProfiles.length === 0) {
          console.log('\n🔍 DIAGNOSIS: No profiles found.');
          console.log('This could mean:');
          console.log('1. No users have registered yet');
          console.log('2. The trigger function is not working');
          console.log('3. Existing users were created before the trigger was set up');
          
          console.log('\n🔧 SOLUTIONS:');
          console.log('1. Try creating a new user account to test the trigger');
          console.log('2. Or manually sync existing users with this SQL:');
          console.log('   INSERT INTO public.profiles (id, email, role)');
          console.log('   SELECT id, email, \'user\'');
          console.log('   FROM auth.users');
          console.log('   WHERE id NOT IN (SELECT id FROM public.profiles);');
        } else {
          console.log('\n👥 Current profiles:');
          allProfiles.forEach(profile => {
            console.log(`   📧 ${profile.email} (${profile.role})`);
          });
          console.log('\n✅ Profiles are being created! The trigger is working.');
        }
      }
    } else {
      console.log('✅ Successfully checked database functions.');
      if (functions && functions.length > 0) {
        console.log('✅ handle_new_user function exists!');
      } else {
        console.log('❌ handle_new_user function not found.');
        console.log('\n🔧 SOLUTION: Run the SQL from setup-profiles.js to create the trigger.');
      }
    }
    
  } catch (error) {
    console.error('Error checking trigger:', error);
  }
}

checkTrigger();