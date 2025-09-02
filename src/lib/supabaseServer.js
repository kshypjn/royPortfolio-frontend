import { createClient } from '@supabase/supabase-js';

// Lazy creator to avoid throwing during import if env vars are missing at build time
export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;
  if (!url || !key) {
    throw new Error('Supabase URL or Key is missing in environment variables');
  }
  return createClient(url, key);
}


