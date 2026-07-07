import { createClient } from '@supabase/supabase-js';

let supabaseClient;

const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    const error = new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY on the server.');
    error.statusCode = 503;
    throw error;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  return supabaseClient;
};

export { getSupabaseClient };
