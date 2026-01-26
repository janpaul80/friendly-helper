-- HEFTCoder Supabase Schema
-- NOTE: This file is for reference only. The actual schema is managed via migrations.
-- See supabase/migrations/ for the authoritative schema.

-- The current database contains:
-- 1. templates table - Public read, admin-only write (via service role)
-- 2. project_history table - User-scoped CRUD via RLS

-- All tables have Row Level Security (RLS) enabled with proper policies.
