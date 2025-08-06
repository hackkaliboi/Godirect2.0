-- Godirect Realty Database Schema Setup
-- This script creates all necessary tables for the real estate application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agent', 'admin')),
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create property_images table
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    user_id UUID REFERENCES profiles(id),
    agent_id UUID REFERENCES agents(id),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'converted')),
    property_type TEXT,
    budget TEXT,
    bedrooms TEXT,
    bathrooms TEXT,
    location TEXT,
    price_range TEXT,
    last_contact TIMESTAMP WITH TIME ZONE,
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

-- Create activity_log table
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    reference_table TEXT,
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_agent_id ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_clients_agent_id ON clients(agent_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_agent_id ON testimonials(agent_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
DROP POLICY IF EXISTS "Agents can insert properties" ON properties;
DROP POLICY IF EXISTS "Agents can update their own properties" ON properties;
DROP POLICY IF EXISTS "Property images are viewable by everyone" ON property_images;
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can create support tickets" ON support_tickets;
DROP POLICY IF EXISTS "Users can view their own activity" ON activity_log;
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON testimonials;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Properties policies (public read, agent/admin write)
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Agents can insert properties" ON properties
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('agent', 'admin')
        )
    );

CREATE POLICY "Agents can update their own properties" ON properties
    FOR UPDATE USING (
        agent_id IN (
            SELECT agents.id FROM agents 
            JOIN profiles ON profiles.email = agents.email 
            WHERE profiles.id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Property images policies
CREATE POLICY "Property images are viewable by everyone" ON property_images
    FOR SELECT USING (true);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Support tickets policies
CREATE POLICY "Users can view their own tickets" ON support_tickets
    FOR SELECT USING (
        auth.uid() = user_id 
        OR EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('agent', 'admin')
        )
    );

CREATE POLICY "Users can create support tickets" ON support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity log policies
CREATE POLICY "Users can view their own activity" ON activity_log
    FOR SELECT USING (auth.uid() = user_id);

-- Testimonials policies (public read)
CREATE POLICY "Testimonials are viewable by everyone" ON testimonials
    FOR SELECT USING (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to handle new user registration
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

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_trends_updated_at BEFORE UPDATE ON market_trends
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Sample agents
INSERT INTO agents (name, email, phone, title, bio, experience, specializations, listings, sales, reviews, ratings) VALUES
('Sarah Johnson', 'sarah.johnson@godirect.com', '(555) 123-4567', 'Senior Real Estate Agent', 'Experienced agent specializing in luxury homes and commercial properties.', 8, ARRAY['Luxury Homes', 'Commercial'], 45, 120, 89, 4.8),
('Michael Chen', 'michael.chen@godirect.com', '(555) 234-5678', 'Real Estate Specialist', 'Expert in residential properties and first-time home buyers.', 5, ARRAY['Residential', 'First-time Buyers'], 32, 85, 67, 4.6),
('Emily Rodriguez', 'emily.rodriguez@godirect.com', '(555) 345-6789', 'Property Consultant', 'Specializing in investment properties and rental management.', 6, ARRAY['Investment', 'Rentals'], 28, 95, 72, 4.7),
('David Thompson', 'david.thompson@godirect.com', '(555) 456-7890', 'Commercial Agent', 'Focus on commercial real estate and business properties.', 10, ARRAY['Commercial', 'Business'], 38, 110, 81, 4.9);

-- Sample properties
INSERT INTO properties (title, description, price, type, bedrooms, bathrooms, square_feet, address, city, state, zip_code, agent_id, is_featured) VALUES
('Modern Downtown Condo', 'Beautiful 2-bedroom condo in the heart of downtown with city views.', 450000, 'condo', 2, 2, 1200, '123 Main St', 'Seattle', 'WA', '98101', (SELECT id FROM agents WHERE email = 'sarah.johnson@godirect.com'), true),
('Family Home in Suburbs', 'Spacious 4-bedroom family home with large backyard and garage.', 650000, 'house', 4, 3, 2400, '456 Oak Ave', 'Bellevue', 'WA', '98004', (SELECT id FROM agents WHERE email = 'michael.chen@godirect.com'), true),
('Luxury Waterfront Villa', 'Stunning waterfront property with private dock and panoramic views.', 1200000, 'house', 5, 4, 3800, '789 Lake Dr', 'Kirkland', 'WA', '98033', (SELECT id FROM agents WHERE email = 'sarah.johnson@godirect.com'), true),
('Investment Duplex', 'Great investment opportunity with two rental units.', 550000, 'house', 6, 4, 2800, '321 Pine St', 'Tacoma', 'WA', '98402', (SELECT id FROM agents WHERE email = 'emily.rodriguez@godirect.com'), false),
('Commercial Office Space', 'Prime commercial space in business district.', 850000, 'commercial', 0, 2, 4000, '654 Business Blvd', 'Seattle', 'WA', '98102', (SELECT id FROM agents WHERE email = 'david.thompson@godirect.com'), false);

-- Sample testimonials
INSERT INTO testimonials (name, role, content, rating, agent_id, is_featured) VALUES
('John Smith', 'Home Buyer', 'Sarah helped us find our dream home! Her expertise and dedication made the process smooth and stress-free.', 5, (SELECT id FROM agents WHERE email = 'sarah.johnson@godirect.com'), true),
('Lisa Wang', 'First-time Buyer', 'Michael was incredibly patient and knowledgeable. He guided us through every step of buying our first home.', 5, (SELECT id FROM agents WHERE email = 'michael.chen@godirect.com'), true),
('Robert Davis', 'Investor', 'Emily found us an excellent investment property. Her market knowledge is outstanding.', 4, (SELECT id FROM agents WHERE email = 'emily.rodriguez@godirect.com'), true),
('Amanda Wilson', 'Business Owner', 'David helped us secure the perfect commercial space for our business. Highly recommended!', 5, (SELECT id FROM agents WHERE email = 'david.thompson@godirect.com'), false);

-- Sample market trends
INSERT INTO market_trends (title, value, change, trend, description) VALUES
('Average Home Price', '$725,000', 5.2, 'up', 'Home prices have increased 5.2% compared to last month'),
('Days on Market', '18 days', -2.1, 'down', 'Properties are selling 2.1% faster than last month'),
('Inventory Levels', '2.3 months', -8.5, 'down', 'Housing inventory has decreased by 8.5%'),
('Mortgage Rates', '6.8%', 0.3, 'up', 'Interest rates have increased slightly this month');

-- Sample dashboard stats
INSERT INTO dashboard_stats (stat_name, stat_value, stat_change, trend, compare_text) VALUES
('Total Properties', '1,247', 12.5, 'up', '+12.5% from last month'),
('Active Listings', '342', -5.2, 'down', '-5.2% from last month'),
('Properties Sold', '89', 18.7, 'up', '+18.7% from last month'),
('Average Price', '$725,000', 5.2, 'up', '+5.2% from last month');

COMMIT;