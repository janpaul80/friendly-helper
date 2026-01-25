-- Create templates table
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  thumbnail_url TEXT,
  prompt TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on templates (public read)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are publicly readable"
  ON public.templates FOR SELECT
  USING (true);

-- Create project_history table
CREATE TABLE public.project_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'web',
  thumbnail_url TEXT,
  preview_html TEXT,
  files JSONB NOT NULL DEFAULT '[]',
  original_prompt TEXT NOT NULL,
  template_id UUID REFERENCES public.templates(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on project_history
ALTER TABLE public.project_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects"
  ON public.project_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.project_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.project_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.project_history FOR DELETE
  USING (auth.uid() = user_id);

-- Add some starter templates
INSERT INTO public.templates (name, description, category, prompt, tags, is_featured) VALUES
  ('Landing Page', 'Modern landing page with hero section', 'marketing', 'Create a modern landing page with a hero section, features grid, and call-to-action', ARRAY['landing', 'marketing'], true),
  ('Dashboard', 'Admin dashboard with charts and tables', 'dashboard', 'Create an admin dashboard with sidebar navigation, charts, and data tables', ARRAY['dashboard', 'admin'], true),
  ('E-commerce', 'Product listing and cart functionality', 'ecommerce', 'Create an e-commerce product page with cart functionality', ARRAY['ecommerce', 'shop'], true),
  ('Portfolio', 'Personal portfolio website', 'portfolio', 'Create a personal portfolio with project showcase and contact form', ARRAY['portfolio', 'personal'], false);