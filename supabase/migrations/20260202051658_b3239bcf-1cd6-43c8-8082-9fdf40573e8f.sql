-- Allow anyone to read user_credits (credits aren't sensitive)
-- This is needed because Clerk users don't have Supabase auth.uid()
DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;

CREATE POLICY "Anyone can view credits by user_id" 
ON public.user_credits 
FOR SELECT 
USING (true);

-- Keep the service role policy for management
-- (already exists as "Service role can manage credits")