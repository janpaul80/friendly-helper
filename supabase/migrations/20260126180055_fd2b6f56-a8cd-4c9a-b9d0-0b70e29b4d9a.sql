-- Drop the overly permissive update policy
DROP POLICY "Service role can update credits" ON public.user_credits;

-- Create a restrictive update policy - users cannot update their own credits directly
-- Credits will be updated by edge functions using service_role key
CREATE POLICY "No direct user updates on credits"
ON public.user_credits
FOR UPDATE
USING (false)
WITH CHECK (false);