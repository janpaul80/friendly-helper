-- Create enum for transaction types
CREATE TYPE public.credit_transaction_type AS ENUM ('subscription', 'topup', 'usage', 'refund', 'bonus');

-- Create credit_transactions table for audit trail
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL, -- positive = credit, negative = debit
  balance_after INTEGER NOT NULL,
  transaction_type credit_transaction_type NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient user queries
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "Users can view their own transactions"
ON public.credit_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Only backend can insert transactions (no direct user inserts)
CREATE POLICY "Backend can insert transactions"
ON public.credit_transactions
FOR INSERT
WITH CHECK (false);

-- Create function to deduct credits safely (with transaction logging)
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT DEFAULT 'Usage deduction',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Lock the row for update
  SELECT credits INTO v_current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RETURN QUERY SELECT false, 0, 'User credits not found'::TEXT;
    RETURN;
  END IF;

  IF v_current_balance < p_amount THEN
    RETURN QUERY SELECT false, v_current_balance, 'Insufficient credits'::TEXT;
    RETURN;
  END IF;

  v_new_balance := v_current_balance - p_amount;

  -- Update balance
  UPDATE user_credits
  SET credits = v_new_balance, updated_at = now()
  WHERE user_id = p_user_id;

  -- Log the transaction
  INSERT INTO credit_transactions (user_id, amount, balance_after, transaction_type, description, metadata)
  VALUES (p_user_id, -p_amount, v_new_balance, 'usage', p_description, p_metadata);

  RETURN QUERY SELECT true, v_new_balance, NULL::TEXT;
END;
$$;

-- Create function to add credits (for top-ups and subscriptions)
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type credit_transaction_type,
  p_description TEXT DEFAULT 'Credit addition',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE(success BOOLEAN, new_balance INTEGER, error_message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Lock the row for update
  SELECT credits INTO v_current_balance
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    -- Create credits row if it doesn't exist
    INSERT INTO user_credits (user_id, credits, subscription_status)
    VALUES (p_user_id, 0, 'none')
    ON CONFLICT (user_id) DO NOTHING;
    
    v_current_balance := 0;
  END IF;

  v_new_balance := v_current_balance + p_amount;

  -- Update balance
  UPDATE user_credits
  SET credits = v_new_balance, updated_at = now()
  WHERE user_id = p_user_id;

  -- Log the transaction
  INSERT INTO credit_transactions (user_id, amount, balance_after, transaction_type, description, metadata)
  VALUES (p_user_id, p_amount, v_new_balance, p_transaction_type, p_description, p_metadata);

  RETURN QUERY SELECT true, v_new_balance, NULL::TEXT;
END;
$$;