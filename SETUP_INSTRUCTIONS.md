# Godirect Realty - Database Setup Instructions

Since the tables don't exist yet in your Supabase database, you'll need to create them manually through the Supabase dashboard. Follow these steps:

## Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `fygfhqjchughbwvytybx`

## Step 2: Create Database Tables

1. In your Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy and paste the following SQL code:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    title TEXT,
    bio TEXT,
    image TEXT,
    experience INTEGER DEFAULT 0,
    specializations TEXT[] DEFAULT '{}',
    listings INTEGER DEFAULT 0,
    sales INTEGER DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    ratings DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('house', 'apartment', 'condo', 'townhouse', 'land', 'commercial')),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'pending', 'sold', 'rented')),
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    square_feet INTEGER,
    lot_size DECIMAL(10,2),
    year_built INTEGER,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    agent_id UUID REFERENCES agents(id),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    image TEXT,
    property_id UUID REFERENCES properties(id),
    agent_id UUID REFERENCES agents(id),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market_trends table
CREATE TABLE IF NOT EXISTS public.market_trends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    value TEXT NOT NULL,
    change DECIMAL(5,2),
    trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
    description TEXT,
    period TEXT DEFAULT 'monthly',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create dashboard_stats table
CREATE TABLE IF NOT EXISTS public.dashboard_stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    stat_name TEXT NOT NULL,
    stat_value TEXT NOT NULL,
    stat_change DECIMAL(5,2),
    trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
    compare_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_agent_id ON testimonials(agent_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
```

4. Click **"Run"** to execute the SQL
5. You should see a success message

## Step 3: Insert Sample Data

After creating the tables, run this command in your terminal:

```bash
cd scripts
node setup-database.js
```

This will populate your database with sample data including:
- 4 real estate agents
- 6 properties
- 6 customer testimonials
- 4 market trends
- 4 dashboard statistics

## Step 4: Verify Setup

1. In Supabase dashboard, go to **"Table Editor"**
2. You should see all the tables listed on the left
3. Click on each table to verify the data was inserted

## Step 5: Test Your Application

Your React application should now be fully functional with real Supabase data!

### What You Can Do Now:

✅ **Home Page**: View featured properties, agent showcase, testimonials, and market trends
✅ **Properties**: Browse all properties with real data
✅ **Agents**: View agent profiles with their listings and reviews
✅ **Dashboards**: Access admin, agent, and user dashboards with real statistics

## Troubleshooting

If you encounter any issues:

1. **Permission Errors**: Make sure your Supabase project has the correct permissions
2. **Table Creation Fails**: Check that you're using the SQL Editor in the correct project
3. **Data Insertion Fails**: Verify that all tables were created successfully first

## Next Steps

Once your database is set up:

1. **Authentication**: Set up user authentication in Supabase Auth
2. **File Storage**: Configure Supabase Storage for property images
3. **Real-time**: Enable real-time subscriptions for live updates
4. **Production**: Deploy your application to production

---

**Need Help?** Check the Supabase documentation at [https://supabase.com/docs](https://supabase.com/docs)