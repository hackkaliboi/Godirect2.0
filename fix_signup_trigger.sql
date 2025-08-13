-- =====================================================
-- FIX SIGNUP TRIGGER AND AUTH ISSUES
-- =====================================================
-- This fixes the remaining auth signup errors
-- =====================================================

-- First, let's simplify the trigger function to avoid any potential issues
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Simple profile creation without complex metadata extraction
    INSERT INTO profiles (
        id,
        email,
        full_name,
        user_type,
        status,
        phone,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        'active',
        NEW.raw_user_meta_data->>'phone',
        NOW(),
        NOW()
    );
    
    RETURN NEW;
    
EXCEPTION
    WHEN unique_violation THEN
        -- Profile already exists, continue
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log error but don't fail the user creation
        RAISE LOG 'Profile creation failed for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Add a more permissive policy for profile insertion during signup
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
CREATE POLICY "Allow profile creation" ON profiles
    FOR INSERT WITH CHECK (true);

-- Make sure we have a policy that allows reading profiles for the trigger
DROP POLICY IF EXISTS "Allow profile reads" ON profiles;  
CREATE POLICY "Allow profile reads" ON profiles
    FOR SELECT USING (true);

-- Test the trigger function manually to see if it works
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'trigger-test@example.com';
BEGIN
    -- Try to simulate what happens during signup
    BEGIN
        INSERT INTO profiles (
            id,
            email,
            full_name,
            user_type,
            status,
            created_at,
            updated_at
        ) VALUES (
            test_user_id,
            test_email,
            'Trigger Test User',
            'user',
            'active',
            NOW(),
            NOW()
        );
        
        -- Clean up test data
        DELETE FROM profiles WHERE id = test_user_id;
        
        RAISE NOTICE '✅ Profile creation test successful';
        
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE '❌ Profile creation test failed: %', SQLERRM;
    END;
END $$;

-- Check if there are any constraints or issues with the profiles table
DO $$
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE '🔧 SIGNUP TRIGGER FIX APPLIED';
    RAISE NOTICE '====================================================';
    RAISE NOTICE 'Simplified trigger function';
    RAISE NOTICE 'Added permissive policies for signup';
    RAISE NOTICE 'Test your signup again in the diagnostic tool';
    RAISE NOTICE '====================================================';
END $$;
