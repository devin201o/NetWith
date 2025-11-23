import { supabase } from '@/lib/supabase';
import { DatabaseUser, Profile, ExperienceItem } from '@/lib/types';

/**
 * Safely parse JSON or return default value
 */
function safeJSONParse<T>(value: string | null, defaultValue: T): T {
  if (!value) return defaultValue;
  
  try {
    // If it's already an array or object, return it
    if (typeof value === 'object') return value as T;
    
    // Try to parse as JSON
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse JSON:', value, error);
    
    // If it looks like a comma-separated string, split it
    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').map(s => s.trim()) as T;
    }
    
    return defaultValue;
  }
}

/**
 * Transform database user to Profile format
 */
export function transformDatabaseUserToProfile(dbUser: DatabaseUser): Profile {
  // Safely parse JSON strings from database
  const skills = safeJSONParse<string[]>(dbUser.skills, []);
  const interests = safeJSONParse<string[]>(dbUser.interests, []);
  const experience = safeJSONParse<ExperienceItem[]>(dbUser.experience, []);
  
  // Extract first experience item for profile card display
  const firstExp = experience[0];
  
  return {
    id: dbUser.id,
    name: dbUser.name || 'Anonymous',
    email: dbUser.email,
    bio: dbUser.bio || 'No bio provided',
    skills: Array.isArray(skills) ? skills : [],
    interests: Array.isArray(interests) ? interests : [],
    experience: Array.isArray(experience) ? experience : [],
    education: dbUser.education || 'Not specified',
    profileImage: dbUser.profile_image_url || '/api/placeholder/200/200',
    lookingFor: (dbUser.looking_for as "mentor" | "partner" | "network") || undefined,
    isActive: true,
    
    // Extract from first experience if available
    title: firstExp?.title || 'Professional',
    company: firstExp?.company || 'Company',
    location: 'Not specified',
  };
}

/**
 * Fetch all users except current user
 */
export async function fetchDiscoverProfiles(currentUserId: string): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('id', currentUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No profiles found in database');
      return [];
    }

    console.log('Raw database data:', data);

    // Transform all database users to Profile format
    const profiles = data.map(transformDatabaseUserToProfile);
    console.log('Transformed profiles:', profiles);
    
    return profiles;
  } catch (error) {
    console.error('Unexpected error fetching profiles:', error);
    return [];
  }
}

/**
 * Fetch a single user profile by ID
 */
export async function fetchProfileById(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return transformDatabaseUserToProfile(data);
  } catch (error) {
    console.error('Unexpected error fetching profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId: string, updates: Partial<DatabaseUser>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating profile:', error);
    return false;
  }
}