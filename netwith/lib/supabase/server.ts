// lib/supabase/server.ts

// FIX: Change import back to the OLD PACKAGE which correctly handles cookie passing
// for this version of Next.js.
import { createServerComponentClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs' 
import { cookies } from 'next/headers'

// This function creates a client for use in Server Components/Actions.
// We must use a simple structure to work around the TypeError.
export const getSupabaseServerClient = () => {
  
  // FIX: Pass the cookies function directly. This structure is the intended 
  // one for the auth-helpers package and bypasses the TypeError.
  return createSupabaseServerClient({
    cookies: () => cookies(), 
  })
}