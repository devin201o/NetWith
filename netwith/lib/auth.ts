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

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    console.error('Sign out error:', error)
    return { error }
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) throw error
    if (!user) return { user: null, profile: null, error: null }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) throw profileError

    return { user, profile, error: null }
  } catch (error: any) {
    console.error('Get current user error:', error)
    return { user: null, profile: null, error }
  }
}