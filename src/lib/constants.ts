import { createClient } from '@supabase/supabase-js';

export const isDevelopment = import.meta.env.DEV;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseKey);
