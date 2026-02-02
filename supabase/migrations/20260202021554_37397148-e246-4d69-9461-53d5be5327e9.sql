-- Fix 1: otp_codes table - Add restrictive policy to deny all user access
-- Only service role (edge functions) should access OTP codes
CREATE POLICY "Deny all user access to OTP codes"
ON public.otp_codes
FOR ALL
USING (false)
WITH CHECK (false);

-- Fix 2: user_credits table - Fix the overly permissive SELECT policy
-- Drop the current broken policy that allows everyone to read all records
DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;

-- Create proper user-scoped SELECT policy
-- user_id is TEXT type, so cast auth.uid() to text
CREATE POLICY "Users can view their own credits"
ON public.user_credits
FOR SELECT
USING (auth.uid()::text = user_id);