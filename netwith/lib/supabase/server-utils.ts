// lib/supabase/server-utils.ts
import { createServerClient } from '@supabase/ssr' 
import { cookies } from 'next/headers'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!


// Function to create a secure, read-only client for Server Components/Actions
export const createSecureServerClient = () => {
  
  // This client is used exclusively on the server to read the session cookie securely.
  return createServerClient(
    supabaseUrl, 
    supabaseAnonKey, 
    {
      cookies: {
        // FIX: This structure is the most reliable way to read the session cookie on the server.
        get: (name: string) => cookies().get(name)?.value,
        // Set/remove methods are often needed for the client lifecycle, even if blank here.
        set: (name: string, value: string, options: any) => {},
        remove: (name: string, options: any) => {},
      },
    }
  )
}