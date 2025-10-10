-- Allow public read access to avatars
CREATE POLICY "Public read access to avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- DOCUMENTS POLICIES
-- Allow authenticated users to upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

-- Allow users to read their own documents only
CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to update their own documents
CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
);

-- 4. ENABLE RLS ON storage.objects
-- Ensure Row Level Security is enabled for storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE supported_currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_viewings ENABLE ROW LEVEL SECURITY;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Agents can manage own properties" ON properties;
DROP POLICY IF EXISTS "Agents can insert properties" ON properties;
DROP POLICY IF EXISTS "Users can view own inquiries" ON property_inquiries;
DROP POLICY IF EXISTS "Agents and admins can update inquiries" ON property_inquiries;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authors can manage own posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can view all property views" ON property_views;
DROP POLICY IF EXISTS "Admins can manage system settings" ON system_settings;
DROP POLICY IF EXISTS "Admins can manage contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage currencies" ON supported_currencies;
DROP POLICY IF EXISTS "Admins can view all user settings" ON user_settings;
DROP POLICY IF EXISTS "Users can manage own KYC documents" ON kyc_documents;
DROP POLICY IF EXISTS "Agents can view own revenue" ON revenue_records;
DROP POLICY IF EXISTS "Admins can manage revenue records" ON revenue_records;
DROP POLICY IF EXISTS "Agents can view own commissions" ON agent_commissions;
DROP POLICY IF EXISTS "Admins can manage agent commissions" ON agent_commissions;
DROP POLICY IF EXISTS "Users can view own transactions" ON property_transactions;
DROP POLICY IF EXISTS "Agents and admins can manage transactions" ON property_transactions;
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Admins can manage subscription plans" ON subscription_plans;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Admins can manage user subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Users can view property documents" ON property_documents;
DROP POLICY IF EXISTS "Agents can manage property documents" ON property_documents;
DROP POLICY IF EXISTS "Users can manage own applications" ON property_applications;
DROP POLICY IF EXISTS "Users can create applications" ON property_applications;
DROP POLICY IF EXISTS "Users can update own applications" ON property_applications;
DROP POLICY IF EXISTS "Service role can manage all applications" ON property_applications;
DROP POLICY IF EXISTS "Users can view own viewings" ON property_viewings;
DROP POLICY IF EXISTS "Users can create viewings" ON property_viewings;
DROP POLICY IF EXISTS "Users can update own viewings" ON property_viewings;
DROP POLICY IF EXISTS "Admins can delete viewings" ON property_viewings;

-- Recreate profiles policies without recursion
-- Simple policy that allows users to view all profiles
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

-- Policy that allows users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policy that allows profile creation (needed for signup trigger)
CREATE POLICY "Allow profile creation" ON profiles
    FOR INSERT WITH CHECK (true);

-- Simple admin policy without recursion
CREATE POLICY "Service role can manage all profiles" ON profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Properties policies
CREATE POLICY "Anyone can view published properties" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Owners can manage own properties" ON properties
    FOR ALL USING (
        auth.uid() = owner_id OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "Owners can insert properties" ON properties
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL OR 
        auth.role() = 'service_role'
    );

-- Property inquiries policies
CREATE POLICY "Users can view own inquiries" ON property_inquiries
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "Anyone can create inquiries" ON property_inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Agents and admins can update inquiries" ON property_inquiries
    FOR UPDATE USING (auth.role() = 'service_role');

-- Testimonials policies
CREATE POLICY "Anyone can view approved testimonials" ON testimonials
    FOR SELECT USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can create testimonials" ON testimonials
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can manage testimonials" ON testimonials
    FOR ALL USING (auth.role() = 'service_role');

-- Blog posts policies
CREATE POLICY "Anyone can view published posts" ON blog_posts
    FOR SELECT USING (status = 'published' OR auth.uid() = author_id);

CREATE POLICY "Authors can manage own posts" ON blog_posts
    FOR ALL USING (
        auth.uid() = author_id OR 
        auth.role() = 'service_role'
    );

-- Property favorites policies
CREATE POLICY "Users can manage own favorites" ON property_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Property views policies (for analytics)
CREATE POLICY "Anyone can create property views" ON property_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can view all property views" ON property_views
    FOR SELECT USING (auth.role() = 'service_role');

-- System settings policies
CREATE POLICY "Service role can manage system settings" ON system_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access for certain settings
CREATE POLICY "Anyone can view public settings" ON system_settings
    FOR SELECT USING (key LIKE 'public_%');

-- Contact messages and newsletter policies
CREATE POLICY "Anyone can create contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can manage contact messages" ON contact_messages
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can manage newsletter subscribers" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'service_role');

-- Supported currencies policies
CREATE POLICY "Anyone can view currencies" ON supported_currencies
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage currencies" ON supported_currencies
    FOR ALL USING (auth.role() = 'service_role');

-- User settings policies (including theme preferences)
CREATE POLICY "Users can manage own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can view all user settings" ON user_settings
    FOR SELECT USING (auth.role() = 'service_role');

-- KYC documents policies
CREATE POLICY "Users can manage own KYC documents" ON kyc_documents
    FOR ALL USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- Revenue records policies
CREATE POLICY "Agents can view own revenue" ON revenue_records
    FOR SELECT USING (
        auth.uid() = agent_id OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "Service role can manage revenue records" ON revenue_records
    FOR ALL USING (auth.role() = 'service_role');

-- Agent commissions policies
CREATE POLICY "Agents can view own commissions" ON agent_commissions
    FOR SELECT USING (
        auth.uid() = agent_id OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "Service role can manage agent commissions" ON agent_commissions
    FOR ALL USING (auth.role() = 'service_role');

-- Property transactions policies
CREATE POLICY "Users can view own transactions" ON property_transactions
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id OR 
        auth.uid() = agent_id OR
        auth.role() = 'service_role'
    );

CREATE POLICY "Agents and service role can manage transactions" ON property_transactions
    FOR ALL USING (auth.role() = 'service_role');

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- Audit logs policies (service role only)
CREATE POLICY "Service role can view audit logs" ON audit_logs
    FOR SELECT USING (auth.role() = 'service_role');

-- Subscription plans policies
CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
    FOR SELECT USING (is_active = true);

CREATE POLICY "Service role can manage subscription plans" ON subscription_plans
    FOR ALL USING (auth.role() = 'service_role');

-- User subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

CREATE POLICY "Service role can manage user subscriptions" ON user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Property documents policies
CREATE POLICY "Users can view property documents" ON property_documents
    FOR SELECT USING (
        is_public = true OR
        auth.uid() = uploaded_by OR
        auth.role() = 'service_role'
    );

CREATE POLICY "Owners and service role can manage property documents" ON property_documents
    FOR ALL USING (auth.role() = 'service_role');

-- Saved searches policies
CREATE POLICY "Users can manage own saved searches" ON saved_searches
    FOR ALL USING (auth.uid() = user_id);

-- Property comparisons policies
CREATE POLICY "Users can manage own comparisons" ON property_comparisons
    FOR ALL USING (auth.uid() = user_id);

-- RLS policies for conversations and messages
CREATE POLICY "Users can view own conversations" ON conversations
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create conversations" ON conversations
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations" ON conversations
    FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete own conversations" ON conversations
    FOR DELETE
    USING (user_id = auth.uid());

CREATE POLICY "Users can view messages in own conversations" ON messages
    FOR SELECT
    USING (conversation_id IN (
        SELECT id FROM conversations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can create messages in own conversations" ON messages
    FOR INSERT
    WITH CHECK (conversation_id IN (
        SELECT id FROM conversations WHERE user_id = auth.uid()
    ));

CREATE POLICY "Service role can manage all conversations" ON conversations
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage all messages" ON messages
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS policies for property applications
CREATE POLICY "Users can view own applications" ON property_applications
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create applications" ON property_applications
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own applications" ON property_applications
    FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all applications" ON property_applications
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS policies for property viewings
CREATE POLICY "Users can view own viewings" ON property_viewings
    FOR SELECT
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Users can create viewings" ON property_viewings
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Users can update their own viewings" ON property_viewings
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Admins can delete viewings" ON property_viewings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );

-- =====================================================
-- ESSENTIAL CONFIGURATION DATA
-- =====================================================

-- Insert supported currencies
INSERT INTO supported_currencies (code, name, symbol, exchange_rate, is_default, is_active) VALUES
    ('USD', 'US Dollar', '$', 1.0, true, true),
    ('EUR', 'Euro', '€', 0.85, false, true),
    ('GBP', 'British Pound', '£', 0.73, false, true),
    ('CAD', 'Canadian Dollar', 'C$', 1.25, false, true),
    ('AUD', 'Australian Dollar', 'A$', 1.35, false, true)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    symbol = EXCLUDED.symbol,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
    ('site_name', '"GODIRECT Realty"', 'Name of the website'),
    ('site_description', '"Your trusted partner in real estate"', 'Website description'),
    ('contact_email', '"info@godirectrealty.com"', 'Main contact email'),
    ('contact_phone', '"+1 (555) 123-4567"', 'Main contact phone'),
    ('office_address', '"123 Real Estate Ave, City, State 12345"', 'Office address'),
    ('public_max_properties_per_page', '12', 'Number of properties to show per page'),
    ('public_featured_properties_count', '6', 'Number of featured properties to show on homepage'),
    ('public_testimonials_count', '3', 'Number of testimonials to show on homepage'),
    ('public_blog_posts_per_page', '9', 'Number of blog posts per page'),
    ('public_enable_property_inquiry', 'true', 'Enable property inquiry form'),
    ('public_enable_newsletter', 'true', 'Enable newsletter subscription'),
    ('public_enable_testimonials', 'true', 'Enable testimonials feature'),
    ('currency_default', '"USD"', 'Default currency code'),
    ('timezone', '"America/New_York"', 'Default timezone'),
    ('date_format', '"MM/DD/YYYY"', 'Default date format'),
    ('public_social_facebook', '""', 'Facebook page URL'),
    ('public_social_twitter', '""', 'Twitter profile URL'),
    ('public_social_instagram', '""', 'Instagram profile URL'),
    ('public_social_linkedin', '""', 'LinkedIn profile URL'),
    ('public_social_youtube', '""', 'YouTube channel URL'),
    ('email_notifications_enabled', 'true', 'Enable email notifications'),
    ('maintenance_mode', 'false', 'Site maintenance mode'),
    ('default_theme', '"light"', 'Default theme for new users'),
    ('available_themes', '["light", "dark", "system"]', 'Available theme options'),
    ('public_theme_customization_enabled', 'true', 'Allow users to customize themes')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Insert default user preference templates
INSERT INTO system_settings (key, value, description) VALUES
    ('default_user_theme_settings', '{
        "theme": "light",
        "primary_color": "#1e40af",
        "accent_color": "#f59e0b",
        "font_size": "medium",
        "compact_mode": false,
        "sidebar_collapsed": false,
        "animations_enabled": true
    }', 'Default theme settings for new users'),
    ('default_agent_theme_settings', '{
        "theme": "light",
        "primary_color": "#059669",
        "accent_color": "#dc2626",
        "font_size": "medium",
        "compact_mode": false,
        "sidebar_collapsed": false,
        "animations_enabled": true,
        "dashboard_layout": "grid",
        "property_card_style": "detailed"
    }', 'Default theme settings for new agents'),
    ('default_admin_theme_settings', '{
        "theme": "dark",
        "primary_color": "#7c3aed",
        "accent_color": "#f59e0b",
        "font_size": "medium",
        "compact_mode": true,
        "sidebar_collapsed": false,
        "animations_enabled": false,
        "dashboard_layout": "table",
        "data_density": "compact"
    }', 'Default theme settings for new admins')
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE '✅ GODIRECT REALTY DATABASE SETUP COMPLETE!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Created:';
    RAISE NOTICE '• All tables with proper relationships';
    RAISE NOTICE '• Performance indexes';
    RAISE NOTICE '• User signup trigger';
    RAISE NOTICE '• Row Level Security policies';
    RAISE NOTICE '• Storage bucket configuration';
    RAISE NOTICE '• Essential configuration data';
    RAISE NOTICE '';
    RAISE NOTICE 'Your database is ready for use!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update your app with new Supabase credentials';
    RAISE NOTICE '2. Test user signup functionality';
    RAISE NOTICE '3. Verify all features work correctly';
    RAISE NOTICE '=====================================================';
END $$;