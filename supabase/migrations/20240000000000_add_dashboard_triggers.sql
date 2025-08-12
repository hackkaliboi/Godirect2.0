-- Enable pg_net extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to call the Edge Function
CREATE OR REPLACE FUNCTION update_dashboard_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Make HTTP request to Edge Function
  PERFORM
    net.http_post(
      url := CURRENT_SETTING('app.settings.edge_function_url') || '/update-dashboard-stats',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || CURRENT_SETTING('app.settings.service_role_key'),
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  RETURN NULL;
END;
$$;

-- Trigger for profiles table
DROP TRIGGER IF EXISTS trigger_profiles_dashboard_stats ON profiles;
CREATE TRIGGER trigger_profiles_dashboard_stats
AFTER INSERT OR UPDATE OR DELETE ON profiles
FOR EACH STATEMENT
EXECUTE FUNCTION update_dashboard_stats();

-- Trigger for properties table
DROP TRIGGER IF EXISTS trigger_properties_dashboard_stats ON properties;
CREATE TRIGGER trigger_properties_dashboard_stats
AFTER INSERT OR UPDATE OR DELETE ON properties
FOR EACH STATEMENT
EXECUTE FUNCTION update_dashboard_stats();

-- Trigger for transactions table
DROP TRIGGER IF EXISTS trigger_transactions_dashboard_stats ON transactions;
CREATE TRIGGER trigger_transactions_dashboard_stats
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH STATEMENT
EXECUTE FUNCTION update_dashboard_stats();