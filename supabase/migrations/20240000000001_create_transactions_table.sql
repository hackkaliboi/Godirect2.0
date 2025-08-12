-- Create transactions table for tracking revenue
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL
);

-- Add RLS policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow admins to view all transactions
CREATE POLICY "Admins can view all transactions" ON transactions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));