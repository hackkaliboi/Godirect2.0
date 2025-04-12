
-- SQL function to retrieve users (we'll manually run this in the Supabase SQL editor)
CREATE OR REPLACE FUNCTION public.get_users()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER -- This is important to bypass RLS
SET search_path = public
AS $$
BEGIN
  -- Check if the requesting user has admin privileges
  IF (SELECT user_type FROM public.profiles WHERE id = auth.uid()) = 'admin' THEN
    RETURN QUERY
    SELECT 
      json_build_object(
        'id', u.id,
        'email', u.email,
        'created_at', u.created_at,
        'user_metadata', u.raw_user_meta_data
      )
    FROM auth.users u;
  ELSE
    -- For non-admin users, return an empty set or their own user record
    RETURN QUERY
    SELECT 
      json_build_object(
        'id', u.id,
        'email', u.email,
        'created_at', u.created_at,
        'user_metadata', u.raw_user_meta_data
      )
    FROM auth.users u
    WHERE u.id = auth.uid();
  END IF;
END;
$$;

-- Allow authenticated users to execute this function
GRANT EXECUTE ON FUNCTION public.get_users() TO authenticated;
