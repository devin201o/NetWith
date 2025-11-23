import { supabase } from '@/lib/supabase';
import { DatabaseUser, Profile, ExperienceItem } from '@/lib/types';

/**
 * Safely parse JSON or return default value
 */
function safeJSONParse<T>(value: string | null | undefined, defaultValue: T): T {
  if (!value) return defaultValue;
  
  try {
    // If it's already an array or object, return it
    if (typeof value === 'object') return value as T;
    
    // Try to parse as JSON
    const parsed = JSON.parse(value);
    
    // Handle case where it's an array with a single string like ["React, Node.js"]
    if (Array.isArray(parsed) && parsed.length === 1 && typeof parsed[0] === 'string') {
      // Check if that single string contains commas
      if (parsed[0].includes(',')) {
        return parsed[0].split(',').map((s: string) => s.trim()) as T;
      }
    }
    
    return parsed;
  } catch (error) {
    console.warn('Failed to parse JSON, trying comma-separated:', value);
    
    // If it looks like a comma-separated string, split it
    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').map(s => s.trim()) as T;
    }
    
    // If it's a single value, return it as an array
    if (typeof value === 'string' && value.length > 0) {
      return [value] as T;
    }
    
    return defaultValue;
  }
}

/**
 * Parse experience data - handles multiple formats
 */
function parseExperience(value: string | null | undefined): ExperienceItem[] {
  if (!value) return [];
  
  try {
    if (typeof value === 'object') return value as ExperienceItem[];
    
    const parsed = JSON.parse(value);
    
    // If it's already an array of experience objects
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
      return parsed;
    }
    
    // If it's an array with a single string like ["Software Engineer at Google"]
    if (Array.isArray(parsed) && parsed.length === 1 && typeof parsed[0] === 'string') {
      return [{
        id: 1,
        title: parsed[0],
        company: 'Not specified',
        period: 'Current',
        description: ''
      }];
    }
    
    // If it's just a plain string
    if (typeof parsed === 'string') {
      return [{
        id: 1,
        title: parsed,
        company: 'Not specified',
        period: 'Current',
        description: ''
      }];
    }
    
    return [];
  } catch (error) {
    // If parsing fails, treat it as a simple string
    if (typeof value === 'string' && value.length > 0) {
      return [{
        id: 1,
        title: value,
        company: 'Not specified',
        period: 'Current',
        description: ''
      }];
    }
    
    return [];
  }
}

/**
 * Transform database user to Profile format
 */
export function transformDatabaseUserToProfile(dbUser: DatabaseUser): Profile {
  // Safely parse JSON strings from database
  const skills = safeJSONParse<string[]>(dbUser.skills, []);
  const interests = safeJSONParse<string[]>(dbUser.interests, []);
  const experience = parseExperience(dbUser.experience);
  
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
    swiped: dbUser.swiped || false, // Add swiped field
    
    // Extract from first experience if available
    title: firstExp?.title || 'Professional',
    company: firstExp?.company || 'Company',
    location: 'Not specified',
  };
}

/**
 * Fetch all users except current user
 */
export async function fetchDiscoverProfiles(currentUserId: string | undefined): Promise<Profile[]> {
  try {
    // If no currentUserId, return empty array
    if (!currentUserId) {
      console.log('No current user ID provided');
      return [];
    }

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

/**
 * Mark a user as swiped
 */
export async function markUserAsSwiped(userId: string): Promise<boolean> {
  return updateProfile(userId, { swiped: true });
}

/**
 * Fetch only non-swiped profiles for discover
 */
export async function fetchNonSwipedProfiles(currentUserId: string | undefined): Promise<Profile[]> {
  try {
    if (!currentUserId) {
      console.log('No current user ID provided');
      return [];
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .neq('id', currentUserId)
      .eq('swiped', false) // Only get profiles that haven't been swiped
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching non-swiped profiles:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No non-swiped profiles found');
      return [];
    }

    const profiles = data.map(transformDatabaseUserToProfile);
    console.log('Fetched non-swiped profiles:', profiles.length);
    
    return profiles;
  } catch (error) {
    console.error('Unexpected error fetching non-swiped profiles:', error);
    return [];
  }
}