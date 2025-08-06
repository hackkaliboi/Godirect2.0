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

async function syncUsers() {
  try {
    console.log('🔄 Syncing existing users to profiles table...');
    
    // First, let's see what we're working with
    console.log('\n=== STEP 1: Checking current state ===');
    
    // Check profiles table
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .order('created_at', { ascending: false });
      
    if (profileError) {
      console.error('❌ Error accessing profiles table:', profileError);
      return;
    }
    
    console.log(`📊 Current profiles in database: ${profiles.length}`);
    
    if (profiles.length > 0) {
      console.log('\n👥 Existing profiles:');
      profiles.forEach(profile => {
        console.log(`   📧 ${profile.email} (${profile.role})`);
      });
    }
    
    console.log('\n=== STEP 2: Manual Setup Required ===');
    console.log('\nSince we cannot directly access auth.users table with the current permissions,');
    console.log('you need to manually run this SQL in your Supabase dashboard:');
    console.log('\n--- COPY THIS SQL TO SUPABASE DASHBOARD ---');
    
    const syncSQL = `-- First, ensure the trigger function exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger (this will handle future user registrations)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync existing users (run this once to catch up)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
  'user' as role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Show results
SELECT 
  'Total users synced:' as message,
  COUNT(*) as count
FROM public.profiles;`;
    
    console.log(syncSQL);
    console.log('\n--- END SQL ---');
    
    console.log('\n=== STEP 3: How to run this ===');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Paste the SQL above');
    console.log('5. Click "Run"');
    console.log('6. Run this script again to verify the sync worked');
    
    console.log('\n=== STEP 4: Test the trigger ===');
    console.log('After running the SQL:');
    console.log('1. Try creating a new user account');
    console.log('2. The profile should be created automatically');
    console.log('3. You can check by running this script again');
    
    console.log('\n=== STEP 5: Manage user roles ===');
    console.log('To change user roles:');
    console.log('1. Go to Table Editor > profiles in Supabase dashboard');
    console.log('2. Edit the "role" column for each user');
    console.log('3. Available values: user, agent, admin');
    
  } catch (error) {
    console.error('Error in syncUsers:', error);
  }
}

syncUsers();