import { createClient } from '@supabase/supabase-js';

export const isDevelopment = import.meta.env.DEV;
export const projectVersion = import.meta.env.VITE_PROJECT_VERSION;
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const ROW_FLIP_DURATION = 250;
