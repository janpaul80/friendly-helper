import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  thumbnail_url: string | null;
  prompt: string;
  tags: string[];
  is_featured: boolean;
  created_at: string;
}

export function useTemplates(category?: string) {
  return useQuery({
    queryKey: ['templates', category],
    queryFn: async () => {
      let query = supabase
        .from('templates' as any)
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as unknown as Template[];
    },
  });
}

export function useFeaturedTemplates() {
  return useQuery({
    queryKey: ['templates', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates' as any)
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      return (data || []) as unknown as Template[];
    },
  });
}
