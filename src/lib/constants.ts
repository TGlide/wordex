import { createClient } from '@supabase/supabase-js';

export const isDevelopment = import.meta.env.DEV;
export const projectVersion = '0.0.4';
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const ROW_FLIP_DELAY = 250;
export const ROW_FLIP_DURATION = 750;
