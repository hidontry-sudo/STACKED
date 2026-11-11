import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isServerSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseServiceKey) &&
    !supabaseUrl.includes('placeholder-project') &&
    !supabaseServiceKey.includes('placeholder-')
  );
};

// Server-side Supabase client with admin capabilities when service key is provided
export const getSupabaseServerClient = () => {
  if (!isServerSupabaseConfigured()) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
