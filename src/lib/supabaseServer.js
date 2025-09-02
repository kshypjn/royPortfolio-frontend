import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key (bypasses RLS)
// Ensure SUPABASE_SERVICE_ROLE_KEY is set ONLY on the server (never expose to the client)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


