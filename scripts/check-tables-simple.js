// A simpler script to check if tables exist in Supabase
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

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

async function checkTable(tableName) {
  try {
    // Try to select a single row from the table
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    
    // If there's no error about the table not existing, the table exists
    if (!error || !error.message.includes('does not exist')) {
      console.log(`✅ Table "${tableName}" exists`)
      
      // Try to get column information
      if (data) {
        if (data.length > 0) {
          const columns = Object.keys(data[0])
          console.log(`  Columns: ${columns.join(', ')}`)
        } else {
          console.log(`  Table exists but is empty`)
        }
      }
      
      return true
    } else {
      console.log(`❌ Table "${tableName}" does not exist: ${error.message}`)
      return false
    }
  } catch (err) {
    console.log(`❌ Error checking table "${tableName}": ${err.message}`)
    return false
  }
}

async function checkRelationships() {
  console.log('\nChecking for relationships between tables...')
  
  // Check for property_images -> properties relationship
  if (await checkTable('property_images') && await checkTable('properties')) {
    try {
      const { data, error } = await supabase
        .from('property_images')
        .select('*, properties(*)')
        .limit(1)
      
      if (!error) {
        console.log('✅ Relationship exists: property_images -> properties')
      } else {
        console.log('❌ No relationship found: property_images -> properties')
      }
    } catch (err) {
      console.log(`❌ Error checking relationship: ${err.message}`)
    }
  }
  
  // Check for notifications -> profiles relationship
  if (await checkTable('notifications') && await checkTable('profiles')) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, profiles(*)')
        .limit(1)
      
      if (!error) {
        console.log('✅ Relationship exists: notifications -> profiles')
      } else {
        console.log('❌ No relationship found: notifications -> profiles')
      }
    } catch (err) {
      console.log(`❌ Error checking relationship: ${err.message}`)
    }
  }
  
  // Check for support_tickets -> profiles relationship
  if (await checkTable('support_tickets') && await checkTable('profiles')) {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*, profiles(*)')
        .limit(1)
      
      if (!error) {
        console.log('✅ Relationship exists: support_tickets -> profiles')
      } else {
        console.log('❌ No relationship found: support_tickets -> profiles')
      }
    } catch (err) {
      console.log(`❌ Error checking relationship: ${err.message}`)
    }
  }
}

async function main() {
  console.log('Checking tables in Supabase...\n')
  
  // Check each table
  for (const tableName of tablesToCheck) {
    await checkTable(tableName)
  }
  
  // Check relationships
  await checkRelationships()
}

main()
