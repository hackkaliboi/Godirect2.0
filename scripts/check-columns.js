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

async function checkColumns() {
  try {
    console.log('Checking profiles table columns...');
    
    // Try to select all columns to see what exists
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Error accessing profiles table:', error);
      
      // Try selecting specific columns to see which ones exist
      console.log('\nTrying individual columns...');
      
      const columns = ['id', 'email', 'role', 'user_type', 'full_name', 'created_at'];
      
      for (const col of columns) {
        try {
          const { error: colError } = await supabase
            .from('profiles')
            .select(col)
            .limit(1);
            
          if (colError) {
            console.log(`❌ Column '${col}': ${colError.message}`);
          } else {
            console.log(`✅ Column '${col}': exists`);
          }
        } catch (e) {
          console.log(`❌ Column '${col}': ${e.message}`);
        }
      }
      
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Profiles table accessible!');
      console.log('📋 Available columns:', Object.keys(data[0]).join(', '));
    } else {
      console.log('✅ Profiles table exists but no data found.');
      console.log('Let me try to get the table structure...');
      
      // Try to check individual columns
      const columns = ['id', 'email', 'role', 'user_type', 'full_name', 'created_at'];
      
      for (const col of columns) {
        try {
          const { error: colError } = await supabase
            .from('profiles')
            .select(col)
            .limit(1);
            
          if (colError) {
            console.log(`❌ Column '${col}': ${colError.message}`);
          } else {
            console.log(`✅ Column '${col}': exists`);
          }
        } catch (e) {
          console.log(`❌ Column '${col}': ${e.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error('Error checking columns:', error);
  }
}

checkColumns();