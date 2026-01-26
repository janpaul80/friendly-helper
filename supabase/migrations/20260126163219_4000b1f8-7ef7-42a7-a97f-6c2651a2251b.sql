-- Fix: templates_missing_write_rls
-- Block all client-side writes on templates table (admin-only via service role)
CREATE POLICY "Block client inserts on templates"
  ON public.templates FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Block client updates on templates"
  ON public.templates FOR UPDATE
  USING (false);

CREATE POLICY "Block client deletes on templates"
  ON public.templates FOR DELETE
  USING (false);

-- Fix: decrement_credits_definer
-- Remove the unused vulnerable function that references a non-existent users table
DROP FUNCTION IF EXISTS public.decrement_credits(UUID, INTEGER);