export interface MarketplaceAPI {
  id: string;
  name: string;
  description: string;
  category: string;
  auth_type: string;
  https: boolean;
  cors: string;
  link: string;
  is_featured: boolean;
  is_custom: boolean;
  tags: string[];
  example_request?: Record<string, unknown>;
  example_response?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}
