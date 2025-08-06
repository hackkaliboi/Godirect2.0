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

async function setupProfiles() {
  try {
    console.log('Setting up profiles table...');
    
    // Check if profiles table exists
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError && profilesError.code === '42P01') {
      console.log('\n❌ Profiles table does not exist.');
      console.log('\n=== MANUAL SETUP REQUIRED ===\n');
      console.log('Please follow these steps:');
      console.log('\n1. Go to your Supabase dashboard: https://supabase.com/dashboard');
      console.log('2. Select your project: fygfhqjchughbwvytybx');
      console.log('3. Go to SQL Editor');
      console.log('4. Copy and paste the following SQL:');
      console.log('\n--- START SQL ---');
      
      const createProfilesSQL = `-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agent', 'admin')),
    user_type TEXT DEFAULT 'user' CHECK (user_type IN ('user', 'agent', 'admin')),
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
CREATE POLICY "Enable insert for authenticated users only" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync existing users (you'll need to run this manually for each existing user)
-- Replace the email addresses with your actual user emails
-- INSERT INTO public.profiles (id, email, full_name, role, user_type)
-- SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email), 'user', 'user'
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM public.profiles);
`;
      
      console.log(createProfilesSQL);
      console.log('--- END SQL ---\n');
      console.log('5. Click "Run" to execute the SQL');
      console.log('6. After running the SQL, run this script again to verify setup');
      console.log('\n=== IMPORTANT ===');
      console.log('After creating the table, you can manage user roles by:');
      console.log('1. Going to Table Editor > profiles in your Supabase dashboard');
      console.log('2. Editing the role column for each user');
      console.log('3. Available values: user, agent, admin');
      
      return;
    }
    
    if (profilesError) {
      console.error('Error checking profiles table:', profilesError);
      return;
    }
    
    console.log('✅ Profiles table exists!');
    
    // Display current profiles
     const { data: allProfiles, error: fetchError } = await supabase
       .from('profiles')
       .select('id, email, full_name, user_type, created_at')
       .order('created_at', { ascending: false });
    
    if (fetchError) {
      console.error('Error fetching profiles:', fetchError);
    } else {
      console.log('\n=== CURRENT PROFILES ===');
      if (allProfiles.length === 0) {
        console.log('No profiles found. This means:');
        console.log('1. The trigger might not be working');
        console.log('2. Or no users have been created since the table was set up');
        console.log('\nTo manually sync existing users, run this SQL in Supabase:');
        console.log('INSERT INTO public.profiles (id, email, full_name, role)');
         console.log('SELECT id, email, COALESCE(raw_user_meta_data->"full_name", email), "user"');
        console.log('FROM auth.users');
        console.log('WHERE id NOT IN (SELECT id FROM public.profiles);');
      } else {
        allProfiles.forEach(profile => {
           console.log(`📧 ${profile.email}`);
           console.log(`   Role: ${profile.user_type}`);
           console.log(`   Name: ${profile.full_name || 'Not set'}`);
           console.log(`   Created: ${new Date(profile.created_at).toLocaleDateString()}`);
           console.log('');
         });
      }
    }
    
    console.log('\n=== NEXT STEPS ===');
    console.log('1. Go to Supabase Dashboard > Table Editor > profiles');
    console.log('2. Edit user_type as needed (user/agent/admin)');
    console.log('3. The application will now recognize user roles!');
    console.log('4. Users can log in and access their appropriate dashboards');
    
  } catch (error) {
    console.error('Error in setupProfiles:', error);
  }
}

setupProfiles();