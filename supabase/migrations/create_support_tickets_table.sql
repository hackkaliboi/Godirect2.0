-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
    priority VARCHAR(50) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    category VARCHAR(100) NOT NULL, -- 'account', 'payment', 'property', 'technical', 'other'
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create support_ticket_messages table for conversation history
CREATE TABLE IF NOT EXISTS public.support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE, -- For staff-only notes
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_base_articles table for self-help resources
CREATE TABLE IF NOT EXISTS public.knowledge_base_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[], -- Array of tags for better searchability
    author_id UUID REFERENCES auth.users(id),
    is_published BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS support_tickets_user_id_idx ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS support_tickets_assigned_to_idx ON public.support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS support_tickets_created_at_idx ON public.support_tickets(created_at);

CREATE INDEX IF NOT EXISTS support_ticket_messages_ticket_id_idx ON public.support_ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS support_ticket_messages_user_id_idx ON public.support_ticket_messages(user_id);

CREATE INDEX IF NOT EXISTS knowledge_base_articles_category_idx ON public.knowledge_base_articles(category);
CREATE INDEX IF NOT EXISTS knowledge_base_articles_is_published_idx ON public.knowledge_base_articles(is_published);
CREATE INDEX IF NOT EXISTS knowledge_base_articles_tags_idx ON public.knowledge_base_articles USING GIN(tags);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;

-- Support Tickets Policies
CREATE POLICY "Users can view their own tickets" 
    ON public.support_tickets 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets" 
    ON public.support_tickets 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Users can create tickets" 
    ON public.support_tickets 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" 
    ON public.support_tickets 
    FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any ticket" 
    ON public.support_tickets 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Support Ticket Messages Policies
CREATE POLICY "Users can view messages for their tickets" 
    ON public.support_ticket_messages 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.support_tickets
            WHERE id = ticket_id AND user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Users can add messages to their tickets" 
    ON public.support_ticket_messages 
    FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.support_tickets
            WHERE id = ticket_id AND (user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE user_id = auth.uid() AND user_type = 'admin'
                )
            )
        )
    );

-- Knowledge Base Articles Policies
CREATE POLICY "Anyone can view published knowledge base articles" 
    ON public.knowledge_base_articles 
    FOR SELECT 
    USING (is_published = true);

CREATE POLICY "Admins can view all knowledge base articles" 
    ON public.knowledge_base_articles 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

CREATE POLICY "Only admins can manage knowledge base articles" 
    ON public.knowledge_base_articles 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid() AND user_type = 'admin'
        )
    );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT SELECT, INSERT ON public.support_ticket_messages TO authenticated;
GRANT SELECT ON public.knowledge_base_articles TO authenticated;
GRANT USAGE ON SEQUENCE public.support_tickets_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.support_ticket_messages_id_seq TO authenticated;

-- Grant additional permissions to anon users for knowledge base
GRANT SELECT ON public.knowledge_base_articles TO anon;
