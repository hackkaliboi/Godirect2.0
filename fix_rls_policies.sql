-- =====================================================
-- FIX RLS POLICY INFINITE RECURSION
-- =====================================================
-- This fixes the infinite recursion in profiles table policies
-- that's preventing user signup and database access
-- =====================================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

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

-- Fix other potentially recursive policies
DROP POLICY IF EXISTS "Agents can manage own properties" ON properties;
CREATE POLICY "Agents can manage own properties" ON properties
    FOR ALL USING (
        auth.uid() = agent_id OR 
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Agents can insert properties" ON properties;
CREATE POLICY "Agents can insert properties" ON properties
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL OR 
        auth.role() = 'service_role'
    );

-- Fix property inquiries policies
DROP POLICY IF EXISTS "Users can view own inquiries" ON property_inquiries;
CREATE POLICY "Users can view own inquiries" ON property_inquiries
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Agents and admins can update inquiries" ON property_inquiries;
CREATE POLICY "Agents and admins can update inquiries" ON property_inquiries
    FOR UPDATE USING (auth.role() = 'service_role');

-- Fix other policies that reference profiles table
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Authors can manage own posts" ON blog_posts;
CREATE POLICY "Authors can manage own posts" ON blog_posts
    FOR ALL USING (
        auth.uid() = author_id OR 
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Admins can view all property views" ON property_views;
CREATE POLICY "Admins can view all property views" ON property_views
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage system settings" ON system_settings;
CREATE POLICY "Admins can manage system settings" ON system_settings
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage contact messages" ON contact_messages;
CREATE POLICY "Admins can manage contact messages" ON contact_messages
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON newsletter_subscribers;
CREATE POLICY "Admins can manage newsletter subscribers" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage currencies" ON supported_currencies;
CREATE POLICY "Admins can manage currencies" ON supported_currencies
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can view all user settings" ON user_settings;
CREATE POLICY "Admins can view all user settings" ON user_settings
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can manage own KYC documents" ON kyc_documents;
CREATE POLICY "Users can manage own KYC documents" ON kyc_documents
    FOR ALL USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Agents can view own revenue" ON revenue_records;
CREATE POLICY "Agents can view own revenue" ON revenue_records
    FOR SELECT USING (
        auth.uid() = agent_id OR 
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Admins can manage revenue records" ON revenue_records;
CREATE POLICY "Admins can manage revenue records" ON revenue_records
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Agents can view own commissions" ON agent_commissions;
CREATE POLICY "Agents can view own commissions" ON agent_commissions
    FOR SELECT USING (
        auth.uid() = agent_id OR 
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Admins can manage agent commissions" ON agent_commissions;
CREATE POLICY "Admins can manage agent commissions" ON agent_commissions
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own transactions" ON property_transactions;
CREATE POLICY "Users can view own transactions" ON property_transactions
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id OR 
        auth.uid() = agent_id OR
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Agents and admins can manage transactions" ON property_transactions;
CREATE POLICY "Agents and admins can manage transactions" ON property_transactions
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage subscription plans" ON subscription_plans;
CREATE POLICY "Admins can manage subscription plans" ON subscription_plans
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own subscriptions" ON user_subscriptions;
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Admins can manage user subscriptions" ON user_subscriptions;
CREATE POLICY "Admins can manage user subscriptions" ON user_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view property documents" ON property_documents;
CREATE POLICY "Users can view property documents" ON property_documents
    FOR SELECT USING (
        is_public = true OR
        auth.uid() = uploaded_by OR
        auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS "Agents can manage property documents" ON property_documents;
CREATE POLICY "Agents can manage property documents" ON property_documents
    FOR ALL USING (auth.role() = 'service_role');

-- Success message
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE '✅ RLS POLICIES FIXED!';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Fixed infinite recursion in profiles table policies';
    RAISE NOTICE 'User signup should now work correctly';
    RAISE NOTICE 'Test your signup functionality again';
    RAISE NOTICE '====================================================';
END $$;
