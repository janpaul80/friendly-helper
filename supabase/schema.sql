-- HEFTCoder Supabase Schema

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT,
  image TEXT,
  credits INTEGER DEFAULT 2500,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'studio')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  files JSONB DEFAULT '{}'::jsonb,
  thumbnail TEXT,
  last_modified BIGINT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Row Level Security (RLS)

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users can view their own record" 
  ON users FOR SELECT 
  USING (clerk_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update their own record" 
  ON users FOR UPDATE 
  USING (clerk_id = auth.jwt()->>'sub');

CREATE POLICY "Users can insert their own record" 
  ON users FOR INSERT 
  WITH CHECK (clerk_id = auth.jwt()->>'sub');

-- Projects Policies
CREATE POLICY "Users can view their own projects" 
  ON projects FOR SELECT 
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can create their own projects" 
  ON projects FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can update their own projects" 
  ON projects FOR UPDATE 
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can delete their own projects" 
  ON projects FOR DELETE 
  USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub'));

-- Public Projects Policy
CREATE POLICY "Anyone can view public projects" 
  ON projects FOR SELECT 
  USING (is_public = true);

-- 4. Credit Management Functions
CREATE OR REPLACE FUNCTION decrement_credits(target_user_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET credits = GREATEST(0, credits - amount)
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
