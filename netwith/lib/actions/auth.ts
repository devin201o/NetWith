// lib/actions/auth.ts
'use server'

// CHANGE 1: Import the new function name
import { getSupabaseServerClient } from '@/lib/supabase/server' 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signOut() {
  // CHANGE 2: Call the new function name
  const supabase = getSupabaseServerClient() 

  // 1. Clear the session cookie
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error.message)
  }

  // 2. Refresh the app cache and redirect to the login page
  revalidatePath('/', 'layout') 
  redirect('/login') 
}