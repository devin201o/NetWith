import { supabase } from './supabase'

interface SignUpData {
  name: string
  bio?: string
  skills: string[]
  interests: string[]
  experience: string[]
  education: string[]
  profile_image?: File | null
}

export async function signUp(email: string, password: string, userData: SignUpData) {
  try {
    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError
    if (!authData.user) throw new Error('No user returned from signup')

    // 2. Upload profile image if provided
    let profileImageUrl = null
    if (userData.profile_image) {
      const fileExt = userData.profile_image.name.split('.').pop()
      const fileName = `${authData.user.id}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, userData.profile_image)

      if (uploadError) {
        console.error('Error uploading profile image:', uploadError)
      } else {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName)
        
        profileImageUrl = publicUrl
      }
    }

    // 3. Create user profile in the database
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: email,
        name: userData.name,
        bio: userData.bio || null,
        skills: userData.skills,
        interests: userData.interests,
        experience: userData.experience,
        education: userData.education,
        profile_image_url: profileImageUrl,
      })

    if (profileError) throw profileError

    return { data: authData, error: null }
  } catch (error: any) {
    console.error('Signup error:', error)
    return { data: null, error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Sign in error:', error)
    return { data: null, error }
  }
}

export async function getCurrentUser() {
  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return null;
    }

    if (!session?.user) {
      console.log('No active session');
      return null;
    }

    // Return the user from the session (this is the auth.users table)
    return session.user;
    
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    return false;
  }
  return true;
}