import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("FATAL ERROR: Supabase environment variables are missing.")
  throw new Error('Supabase URL or Anon Key is missing. Please check your .env.local file.')
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)