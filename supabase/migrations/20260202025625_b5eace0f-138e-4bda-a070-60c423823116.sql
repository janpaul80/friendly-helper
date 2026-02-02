-- Create API Catalog table for storing public APIs
CREATE TABLE public.api_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT 'No description available',
  category TEXT NOT NULL,
  auth_type TEXT NOT NULL DEFAULT 'none',
  https BOOLEAN NOT NULL DEFAULT true,
  cors TEXT DEFAULT 'unknown',
  link TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  example_request JSONB DEFAULT NULL,
  example_response JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, link)
);

-- Create user favorites table
CREATE TABLE public.user_api_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  api_id UUID NOT NULL REFERENCES public.api_catalog(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, api_id)
);

-- Enable RLS on both tables
ALTER TABLE public.api_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_api_favorites ENABLE ROW LEVEL SECURITY;

-- API Catalog: Anyone can read (public catalog)
CREATE POLICY "Anyone can view API catalog"
  ON public.api_catalog
  FOR SELECT
  USING (true);

-- API Catalog: Only service role can insert/update (via edge function)
CREATE POLICY "Service role can manage API catalog"
  ON public.api_catalog
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- User favorites: Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON public.user_api_favorites
  FOR SELECT
  USING (user_id = (auth.uid())::text);

-- User favorites: Users can insert their own favorites
CREATE POLICY "Users can add their own favorites"
  ON public.user_api_favorites
  FOR INSERT
  WITH CHECK (user_id = (auth.uid())::text);

-- User favorites: Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON public.user_api_favorites
  FOR DELETE
  USING (user_id = (auth.uid())::text);

-- Create indexes for performance
CREATE INDEX idx_api_catalog_category ON public.api_catalog(category);
CREATE INDEX idx_api_catalog_auth_type ON public.api_catalog(auth_type);
CREATE INDEX idx_api_catalog_is_featured ON public.api_catalog(is_featured);
CREATE INDEX idx_user_api_favorites_user_id ON public.user_api_favorites(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_api_catalog_updated_at
  BEFORE UPDATE ON public.api_catalog
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();