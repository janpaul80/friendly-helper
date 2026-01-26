-- =============================================
-- REFERRAL SYSTEM
-- =============================================

-- Table to track referral codes and signups
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL, -- user who created the referral code
  referral_code TEXT NOT NULL UNIQUE,
  referred_user_id UUID, -- user who signed up with this code (null if unused)
  credits_awarded INTEGER DEFAULT 0, -- credits given to referrer
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, expired
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Index for quick lookups
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_referred_user ON public.referrals(referred_user_id);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own referrals (as referrer)
CREATE POLICY "Users can view their referrals"
ON public.referrals FOR SELECT
USING (auth.uid() = referrer_id);

-- Users can create referral codes for themselves
CREATE POLICY "Users can create their own referral codes"
ON public.referrals FOR INSERT
WITH CHECK (auth.uid() = referrer_id);

-- =============================================
-- ARCHIVES SYSTEM (snippets, templates, components)
-- =============================================

-- Create enum for archive types
CREATE TYPE public.archive_type AS ENUM ('snippet', 'template', 'component');

-- Archives table
CREATE TABLE public.archives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  archive_type archive_type NOT NULL DEFAULT 'snippet',
  content TEXT NOT NULL, -- code content
  language TEXT DEFAULT 'typescript', -- programming language
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_archives_user_id ON public.archives(user_id);
CREATE INDEX idx_archives_type ON public.archives(archive_type);
CREATE INDEX idx_archives_favorite ON public.archives(is_favorite);

-- Enable RLS
ALTER TABLE public.archives ENABLE ROW LEVEL SECURITY;

-- Users can CRUD their own archives
CREATE POLICY "Users can view their own archives"
ON public.archives FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own archives"
ON public.archives FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own archives"
ON public.archives FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own archives"
ON public.archives FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_archives_updated_at
BEFORE UPDATE ON public.archives
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- FUNCTION: Generate unique referral code
-- =============================================

CREATE OR REPLACE FUNCTION public.generate_referral_code(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  -- Generate a unique code like HEFT-XXXXX
  LOOP
    v_code := 'HEFT-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 5));
    
    SELECT EXISTS(SELECT 1 FROM referrals WHERE referral_code = v_code) INTO v_exists;
    
    IF NOT v_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_code;
END;
$$;

-- =============================================
-- FUNCTION: Award referral credits
-- =============================================

CREATE OR REPLACE FUNCTION public.award_referral_credits(
  p_referral_code TEXT,
  p_referred_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer_id UUID;
  v_referral_id UUID;
  v_credits_to_award INTEGER := 500;
BEGIN
  -- Find the referral and lock it
  SELECT id, referrer_id INTO v_referral_id, v_referrer_id
  FROM referrals
  WHERE referral_code = p_referral_code
    AND status = 'pending'
    AND referred_user_id IS NULL
  FOR UPDATE;
  
  IF v_referral_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Update the referral
  UPDATE referrals
  SET referred_user_id = p_referred_user_id,
      status = 'completed',
      credits_awarded = v_credits_to_award,
      completed_at = now()
  WHERE id = v_referral_id;
  
  -- Award credits to the referrer
  PERFORM add_credits(
    v_referrer_id,
    v_credits_to_award,
    'bonus',
    'Referral bonus: ' || p_referral_code,
    jsonb_build_object('referral_code', p_referral_code, 'referred_user', p_referred_user_id)
  );
  
  RETURN true;
END;
$$;