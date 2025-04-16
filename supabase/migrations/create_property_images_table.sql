-- Create property_images table
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    alt_text VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS property_images_property_id_idx ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS property_images_is_primary_idx ON public.property_images(is_primary);
CREATE INDEX IF NOT EXISTS property_images_display_order_idx ON public.property_images(display_order);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view property images
CREATE POLICY "Anyone can view property images" 
    ON public.property_images 
    FOR SELECT 
    USING (true);

-- Policy: Only admins and property owners (agents) can insert property images
CREATE POLICY "Admins and agents can insert property images" 
    ON public.property_images 
    FOR INSERT 
    WITH CHECK (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.properties p
                JOIN public.profiles pr ON p.agent_id = pr.id
                WHERE p.id = property_id AND pr.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM public.profiles
                WHERE user_id = auth.uid() AND user_type = 'admin'
            )
        )
    );

-- Policy: Only admins and property owners (agents) can update property images
CREATE POLICY "Admins and agents can update property images" 
    ON public.property_images 
    FOR UPDATE 
    USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.properties p
                JOIN public.profiles pr ON p.agent_id = pr.id
                WHERE p.id = property_id AND pr.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM public.profiles
                WHERE user_id = auth.uid() AND user_type = 'admin'
            )
        )
    );

-- Policy: Only admins and property owners (agents) can delete property images
CREATE POLICY "Admins and agents can delete property images" 
    ON public.property_images 
    FOR DELETE 
    USING (
        auth.role() = 'authenticated' AND (
            EXISTS (
                SELECT 1 FROM public.properties p
                JOIN public.profiles pr ON p.agent_id = pr.id
                WHERE p.id = property_id AND pr.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM public.profiles
                WHERE user_id = auth.uid() AND user_type = 'admin'
            )
        )
    );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_images TO authenticated;
GRANT USAGE ON SEQUENCE public.property_images_id_seq TO authenticated;
