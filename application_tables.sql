-- Property Applications table
CREATE TABLE IF NOT EXISTS property_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    application_type VARCHAR(20) NOT NULL CHECK (application_type IN ('rental', 'purchase')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'withdrawn', 'completed')),
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(20),
    message TEXT,
    submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    decision_date TIMESTAMP WITH TIME ZONE,
    decision_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_applications_user_id ON property_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_property_applications_property_id ON property_applications(property_id);
CREATE INDEX IF NOT EXISTS idx_property_applications_status ON property_applications(status);
CREATE INDEX IF NOT EXISTS idx_property_applications_application_type ON property_applications(application_type);
CREATE INDEX IF NOT EXISTS idx_property_applications_submitted_date ON property_applications(submitted_date);

-- RLS policies
ALTER TABLE property_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for property_applications
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

-- Triggers for updated_at
CREATE TRIGGER update_property_applications_updated_at
    BEFORE UPDATE ON property_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();