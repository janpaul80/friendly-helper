-- Create API catalog table for storing normalized public APIs
CREATE TABLE public.api_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  auth_type TEXT NOT NULL DEFAULT 'none', -- 'none', 'apiKey', 'oauth'
  https BOOLEAN NOT NULL DEFAULT true,
  cors TEXT, -- 'yes', 'no', 'unknown'
  link TEXT NOT NULL,
  -- Additional fields for extensibility
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_custom BOOLEAN NOT NULL DEFAULT false, -- for user-added APIs later
  example_request JSONB,
  example_response JSONB,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Ensure unique APIs by name + link combo
  UNIQUE(name, link)
);

-- Create index for fast category filtering
CREATE INDEX idx_api_catalog_category ON public.api_catalog(category);
CREATE INDEX idx_api_catalog_auth_type ON public.api_catalog(auth_type);
CREATE INDEX idx_api_catalog_featured ON public.api_catalog(is_featured) WHERE is_featured = true;

-- Enable RLS
ALTER TABLE public.api_catalog ENABLE ROW LEVEL SECURITY;

-- Everyone can read the API catalog (public data)
CREATE POLICY "API catalog is publicly readable"
ON public.api_catalog
FOR SELECT
USING (true);

-- Only service role can modify (via edge functions)
-- No insert/update/delete policies for regular users

-- Trigger for updated_at
CREATE TRIGGER update_api_catalog_updated_at
BEFORE UPDATE ON public.api_catalog
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create user_api_favorites table for users to save favorite APIs
CREATE TABLE public.user_api_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  api_id UUID NOT NULL REFERENCES public.api_catalog(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, api_id)
);

-- Enable RLS
ALTER TABLE public.user_api_favorites ENABLE ROW LEVEL SECURITY;

-- Users can manage their own favorites
CREATE POLICY "Users can view own favorites"
ON public.user_api_favorites
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
ON public.user_api_favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
ON public.user_api_favorites
FOR DELETE
USING (auth.uid() = user_id);