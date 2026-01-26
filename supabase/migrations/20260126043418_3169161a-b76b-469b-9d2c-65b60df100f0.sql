-- Create templates table
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  thumbnail_url TEXT,
  prompt TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_history table
CREATE TABLE public.project_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'web',
  thumbnail_url TEXT,
  preview_html TEXT,
  files JSONB DEFAULT '{}',
  original_prompt TEXT NOT NULL DEFAULT '',
  template_id UUID REFERENCES public.templates(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_history ENABLE ROW LEVEL SECURITY;

-- Templates are readable by everyone
CREATE POLICY "Templates are publicly readable" 
ON public.templates 
FOR SELECT 
USING (true);

-- Project history policies
CREATE POLICY "Users can view their own project history" 
ON public.project_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON public.project_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.project_history 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.project_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_history_updated_at
BEFORE UPDATE ON public.project_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default templates
INSERT INTO public.templates (name, description, category, prompt, tags, is_featured) VALUES
('Landing Page', 'Modern landing page with hero section', 'marketing', 'Create a modern landing page with a hero section, features grid, and call-to-action', ARRAY['landing', 'marketing', 'hero'], true),
('Dashboard', 'Admin dashboard with charts and metrics', 'dashboard', 'Build an admin dashboard with sidebar navigation, charts, and data tables', ARRAY['admin', 'dashboard', 'analytics'], true),
('E-commerce', 'Product listing and cart functionality', 'ecommerce', 'Create an e-commerce product page with shopping cart functionality', ARRAY['shop', 'cart', 'products'], true),
('Chat App', 'Real-time messaging interface', 'social', 'Build a chat application with message bubbles and input field', ARRAY['chat', 'messaging', 'social'], false);