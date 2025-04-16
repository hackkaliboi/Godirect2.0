// Script to check if tables exist in Supabase and their relationships
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or key not found in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Tables to check
const tablesToCheck = [
  'notifications',
  'property_images',
  'support_tickets',
  'support_ticket_messages',
  'knowledge_base_articles',
  'properties',
  'profiles',
  'payments',
  'activity_log'
]

async function checkTables() {
  console.log('Checking tables in Supabase...\n')
  
  // Get list of all tables
  const { data: tables, error: tablesError } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public')
  
  if (tablesError) {
    console.error('Error fetching tables:', tablesError.message)
    return
  }
  
  const existingTables = tables.map(t => t.tablename)
  console.log('Existing tables in the "public" schema:')
  console.log(existingTables.join(', '))
  console.log('\n')
  
  // Check each table
  for (const tableName of tablesToCheck) {
    const exists = existingTables.includes(tableName)
    console.log(`Table "${tableName}": ${exists ? '✅ EXISTS' : '❌ DOES NOT EXIST'}`)
    
    if (exists) {
      // Get table structure
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_table_info', { table_name: tableName })
      
      if (columnsError) {
        console.error(`Error fetching columns for ${tableName}:`, columnsError.message)
        continue
      }
      
      console.log(`  Columns: ${columns.length}`)
      
      // Check for foreign keys (relationships)
      const { data: foreignKeys, error: fkError } = await supabase
        .rpc('get_foreign_keys', { table_name: tableName })
      
      if (fkError) {
        console.error(`Error fetching foreign keys for ${tableName}:`, fkError.message)
        continue
      }
      
      if (foreignKeys && foreignKeys.length > 0) {
        console.log('  Relationships:')
        foreignKeys.forEach(fk => {
          console.log(`    → ${fk.column_name} references ${fk.foreign_table}.${fk.foreign_column}`)
        })
      } else {
        console.log('  No relationships found')
      }
    }
    
    console.log('')
  }
}

// Create the stored procedures if they don't exist
async function createHelperFunctions() {
  // Function to get table information
  const { error: infoError } = await supabase.rpc('get_table_info', { table_name: 'profiles' })
  
  if (infoError && infoError.message.includes('does not exist')) {
    console.log('Creating helper function for table info...')
    
    const { error } = await supabase.sql(`
      CREATE OR REPLACE FUNCTION get_table_info(table_name text)
      RETURNS TABLE (
        column_name text,
        data_type text,
        is_nullable boolean
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          c.column_name::text,
          c.data_type::text,
          (c.is_nullable = 'YES')::boolean
        FROM 
          information_schema.columns c
        WHERE 
          c.table_schema = 'public' AND
          c.table_name = table_name;
      END;
      $$;
    `)
    
    if (error) {
      console.error('Error creating table info function:', error.message)
    }
  }
  
  // Function to get foreign keys
  const { error: fkError } = await supabase.rpc('get_foreign_keys', { table_name: 'profiles' })
  
  if (fkError && fkError.message.includes('does not exist')) {
    console.log('Creating helper function for foreign keys...')
    
    const { error } = await supabase.sql(`
      CREATE OR REPLACE FUNCTION get_foreign_keys(table_name text)
      RETURNS TABLE (
        column_name text,
        foreign_table text,
        foreign_column text
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          kcu.column_name::text,
          ccu.table_name::text AS foreign_table,
          ccu.column_name::text AS foreign_column
        FROM
          information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE
          tc.constraint_type = 'FOREIGN KEY' AND
          tc.table_schema = 'public' AND
          tc.table_name = table_name;
      END;
      $$;
    `)
    
    if (error) {
      console.error('Error creating foreign keys function:', error.message)
    }
  }
}

// Main execution
async function main() {
  try {
    await createHelperFunctions()
    await checkTables()
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

main()
