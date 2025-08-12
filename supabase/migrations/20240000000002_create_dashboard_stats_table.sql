-- Create dashboard_stats table
CREATE TABLE IF NOT EXISTS public.dashboard_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stat_name VARCHAR(100) NOT NULL,
    stat_value TEXT NOT NULL,
    stat_change NUMERIC,
    trend VARCHAR(50),
    compare_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(stat_name)
);

-- Enable RLS
ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous read access" ON public.dashboard_stats
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to update" ON public.dashboard_stats
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);