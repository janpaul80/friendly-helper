-- Enable realtime for user_credits table to support live balance updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_credits;