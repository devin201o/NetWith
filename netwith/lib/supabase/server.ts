// lib/supabase/server.ts

// FIX: Importing from the INSTALLED package: @supabase/ssr
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr' 
import { cookies } from 'next/headers'

// 1. Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!


// FIX: ENSURE 'export const' IS USED HERE to make the function accessible
export const getSupabaseServerClient = () => {
  
  return createSupabaseServerClient(
    supabaseUrl, 
    supabaseAnonKey, 
    {
      cookies: {
        get: (name: string) => cookies().get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookies().set(name, value, options); 
        },
        remove: (name: string, options: any) => {
          cookies().set(name, '', options);
        },
      },
    }
  )
}