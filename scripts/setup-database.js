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

async function insertSampleData() {
  console.log('🚀 Starting to insert sample data...')
  
  // Sample agents
  const agents = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@godirect.com',
      phone: '(555) 123-4567',
      title: 'Senior Real Estate Agent',
      bio: 'Experienced agent specializing in luxury homes and commercial properties.',
      experience: 8,
      specializations: ['Luxury Homes', 'Commercial'],
      listings: 45,
      sales: 120,
      reviews: 89,
      ratings: 4.8
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@godirect.com',
      phone: '(555) 234-5678',
      title: 'Real Estate Specialist',
      bio: 'Expert in residential properties and first-time home buyers.',
      experience: 5,
      specializations: ['Residential', 'First-time Buyers'],
      listings: 32,
      sales: 85,
      reviews: 67,
      ratings: 4.6
    },
    {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@godirect.com',
      phone: '(555) 345-6789',
      title: 'Property Consultant',
      bio: 'Specializing in investment properties and rental management.',
      experience: 6,
      specializations: ['Investment', 'Rentals'],
      listings: 28,
      sales: 95,
      reviews: 72,
      ratings: 4.7
    },
    {
      name: 'David Thompson',
      email: 'david.thompson@godirect.com',
      phone: '(555) 456-7890',
      title: 'Commercial Agent',
      bio: 'Focus on commercial real estate and business properties.',
      experience: 10,
      specializations: ['Commercial', 'Business'],
      listings: 38,
      sales: 110,
      reviews: 81,
      ratings: 4.9
    }
  ]
  
  console.log('Inserting agents...')
  try {
    const { data: agentsData, error: agentsError } = await supabase.from('agents').insert(agents).select()
    if (agentsError) {
      console.error('Error inserting agents:', agentsError.message)
      return false
    } else {
      console.log('✅ Sample agents inserted successfully')
      console.log(`   Inserted ${agentsData.length} agents`)
    }
  } catch (err) {
    console.error('Error inserting agents:', err.message)
    return false
  }
  
  // Get agent IDs for properties
  const { data: agentData } = await supabase.from('agents').select('id, email')
  const agentMap = {}
  agentData?.forEach(agent => {
    agentMap[agent.email] = agent.id
  })
  
  // Sample properties
  const properties = [
    {
      title: 'Modern Downtown Condo',
      description: 'Beautiful 2-bedroom condo in the heart of downtown with city views.',
      price: 450000,
      type: 'condo',
      bedrooms: 2,
      bathrooms: 2,
      square_feet: 1200,
      address: '123 Main St',
      city: 'Seattle',
      state: 'WA',
      zip_code: '98101',
      agent_id: agentMap['sarah.johnson@godirect.com'],
      is_featured: true
    },
    {
      title: 'Family Home in Suburbs',
      description: 'Spacious 4-bedroom family home with large backyard and garage.',
      price: 650000,
      type: 'house',
      bedrooms: 4,
      bathrooms: 3,
      square_feet: 2400,
      address: '456 Oak Ave',
      city: 'Bellevue',
      state: 'WA',
      zip_code: '98004',
      agent_id: agentMap['michael.chen@godirect.com'],
      is_featured: true
    },
    {
      title: 'Luxury Waterfront Villa',
      description: 'Stunning waterfront property with private dock and panoramic views.',
      price: 1200000,
      type: 'house',
      bedrooms: 5,
      bathrooms: 4,
      square_feet: 3800,
      address: '789 Lake Dr',
      city: 'Kirkland',
      state: 'WA',
      zip_code: '98033',
      agent_id: agentMap['sarah.johnson@godirect.com'],
      is_featured: true
    },
    {
      title: 'Investment Duplex',
      description: 'Great investment opportunity with two rental units.',
      price: 550000,
      type: 'house',
      bedrooms: 6,
      bathrooms: 4,
      square_feet: 2800,
      address: '321 Pine St',
      city: 'Tacoma',
      state: 'WA',
      zip_code: '98402',
      agent_id: agentMap['emily.rodriguez@godirect.com'],
      is_featured: false
    },
    {
      title: 'Cozy Starter Home',
      description: 'Perfect first home with updated kitchen and hardwood floors.',
      price: 385000,
      type: 'house',
      bedrooms: 3,
      bathrooms: 2,
      square_feet: 1600,
      address: '987 Elm St',
      city: 'Renton',
      state: 'WA',
      zip_code: '98055',
      agent_id: agentMap['michael.chen@godirect.com'],
      is_featured: false
    },
    {
      title: 'Executive Penthouse',
      description: 'Luxury penthouse with panoramic city and mountain views.',
      price: 950000,
      type: 'condo',
      bedrooms: 3,
      bathrooms: 3,
      square_feet: 2200,
      address: '555 Tower Ave',
      city: 'Seattle',
      state: 'WA',
      zip_code: '98101',
      agent_id: agentMap['sarah.johnson@godirect.com'],
      is_featured: true
    }
  ]
  
  console.log('Inserting properties...')
  try {
    const { data: propertiesData, error: propertiesError } = await supabase.from('properties').insert(properties).select()
    if (propertiesError) {
      console.error('Error inserting properties:', propertiesError.message)
      return false
    } else {
      console.log('✅ Sample properties inserted successfully')
      console.log(`   Inserted ${propertiesData.length} properties`)
    }
  } catch (err) {
    console.error('Error inserting properties:', err.message)
    return false
  }
  
  // Sample testimonials
  const testimonials = [
    {
      name: 'John Smith',
      role: 'Home Buyer',
      content: 'Sarah helped us find our dream home! Her expertise and dedication made the process smooth and stress-free.',
      rating: 5,
      agent_id: agentMap['sarah.johnson@godirect.com'],
      is_featured: true
    },
    {
      name: 'Lisa Wang',
      role: 'First-time Buyer',
      content: 'Michael was incredibly patient and knowledgeable. He guided us through every step of buying our first home.',
      rating: 5,
      agent_id: agentMap['michael.chen@godirect.com'],
      is_featured: true
    },
    {
      name: 'Robert Davis',
      role: 'Investor',
      content: 'Emily found us an excellent investment property. Her market knowledge is outstanding.',
      rating: 4,
      agent_id: agentMap['emily.rodriguez@godirect.com'],
      is_featured: true
    },
    {
      name: 'Amanda Wilson',
      role: 'Business Owner',
      content: 'David helped us secure the perfect commercial space for our business. Highly recommended!',
      rating: 5,
      agent_id: agentMap['david.thompson@godirect.com'],
      is_featured: false
    },
    {
      name: 'Carlos Martinez',
      role: 'Home Seller',
      content: 'Sarah sold our house in just 10 days! Her marketing strategy and negotiation skills are top-notch.',
      rating: 5,
      agent_id: agentMap['sarah.johnson@godirect.com'],
      is_featured: true
    },
    {
      name: 'Jennifer Lee',
      role: 'Property Investor',
      content: 'Emily has helped me build a successful rental portfolio. Her insights into the market are invaluable.',
      rating: 5,
      agent_id: agentMap['emily.rodriguez@godirect.com'],
      is_featured: false
    }
  ]
  
  console.log('Inserting testimonials...')
  try {
    const { data: testimonialsData, error: testimonialsError } = await supabase.from('testimonials').insert(testimonials).select()
    if (testimonialsError) {
      console.error('Error inserting testimonials:', testimonialsError.message)
      return false
    } else {
      console.log('✅ Sample testimonials inserted successfully')
      console.log(`   Inserted ${testimonialsData.length} testimonials`)
    }
  } catch (err) {
    console.error('Error inserting testimonials:', err.message)
    return false
  }
  
  // Sample market trends
  const marketTrends = [
    {
      title: 'Average Home Price',
      value: '$725,000',
      change: 5.2,
      trend: 'up',
      description: 'Home prices have increased 5.2% compared to last month'
    },
    {
      title: 'Days on Market',
      value: '18 days',
      change: -2.1,
      trend: 'down',
      description: 'Properties are selling 2.1% faster than last month'
    },
    {
      title: 'Inventory Levels',
      value: '2.3 months',
      change: -8.5,
      trend: 'down',
      description: 'Housing inventory has decreased by 8.5%'
    },
    {
      title: 'Mortgage Rates',
      value: '6.8%',
      change: 0.3,
      trend: 'up',
      description: 'Interest rates have increased slightly this month'
    }
  ]
  
  console.log('Inserting market trends...')
  try {
    const { data: trendsData, error: trendsError } = await supabase.from('market_trends').insert(marketTrends).select()
    if (trendsError) {
      console.error('Error inserting market trends:', trendsError.message)
      return false
    } else {
      console.log('✅ Sample market trends inserted successfully')
      console.log(`   Inserted ${trendsData.length} market trends`)
    }
  } catch (err) {
    console.error('Error inserting market trends:', err.message)
    return false
  }
  
  // Sample dashboard stats
  const dashboardStats = [
    {
      stat_name: 'Total Properties',
      stat_value: '1,247',
      stat_change: 12.5,
      trend: 'up',
      compare_text: '+12.5% from last month'
    },
    {
      stat_name: 'Active Listings',
      stat_value: '342',
      stat_change: -5.2,
      trend: 'down',
      compare_text: '-5.2% from last month'
    },
    {
      stat_name: 'Properties Sold',
      stat_value: '89',
      stat_change: 18.7,
      trend: 'up',
      compare_text: '+18.7% from last month'
    },
    {
      stat_name: 'Average Price',
      stat_value: '$725,000',
      stat_change: 5.2,
      trend: 'up',
      compare_text: '+5.2% from last month'
    }
  ]
  
  console.log('Inserting dashboard stats...')
  try {
    const { data: statsData, error: statsError } = await supabase.from('dashboard_stats').insert(dashboardStats).select()
    if (statsError) {
      console.error('Error inserting dashboard stats:', statsError.message)
      return false
    } else {
      console.log('✅ Sample dashboard stats inserted successfully')
      console.log(`   Inserted ${statsData.length} dashboard stats`)
    }
  } catch (err) {
    console.error('Error inserting dashboard stats:', err.message)
    return false
  }
  
  return true
}

async function checkTables() {
  console.log('\n🔍 Checking if tables exist and have data...')
  
  const tables = ['agents', 'properties', 'testimonials', 'market_trends', 'dashboard_stats']
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1)
      
      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`)
      } else {
        console.log(`✅ Table '${table}': ${count || 0} records`)
      }
    } catch (err) {
      console.log(`❌ Table '${table}': ${err.message}`)
    }
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting database setup...')
    
    // First check if tables exist
    await checkTables()
    
    // If tables exist, try to insert sample data
    const success = await insertSampleData()
    
    if (success) {
      console.log('\n🎉 Database setup completed successfully!')
      console.log('\n📊 Final verification:')
      await checkTables()
      console.log('\n🌟 Your Godirect Realty application is now ready to use with real Supabase data!')
      console.log('\n🔗 You can now:')
      console.log('   • View properties on the home page')
      console.log('   • Browse agent profiles')
      console.log('   • Read customer testimonials')
      console.log('   • Check market trends')
      console.log('   • Access dashboard statistics')
    } else {
      console.log('\n❌ Database setup encountered some issues.')
      console.log('\nℹ️  This might be because:')
      console.log('   • Tables don\'t exist yet (need to be created in Supabase dashboard)')
      console.log('   • Data already exists in the tables')
      console.log('   • Permission issues with the database')
    }
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
  }
}

main()