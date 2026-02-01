-- Create table to store OTP verification codes
CREATE TABLE public.otp_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '5 minutes'),
  verified BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0
);

-- Create index for fast lookup by phone
CREATE INDEX idx_otp_codes_phone ON public.otp_codes(phone);

-- Enable RLS (but allow edge functions to access via service role)
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- No public policies needed - only edge functions with service role will access this table