// lib/types.ts
export interface DatabaseUser {
  id: string;
  email: string;
  name: string | null;
  bio: string | null;
  
  skills: string | string[] | null; 
  interests: string | string[] | null; 
  experience: string | ExperienceItem[] | null; 
  
  education: string | null;
  profile_image_url: string | null;
  looking_for: string | null;
  created_at?: string;
  updated_at?: string;
  swiped?: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  interests: string[];
  experience: ExperienceItem[];
  education: string;
  profileImage: string;
  lookingFor?: "mentor" | "partner" | "network";
  isActive: boolean;
  title: string;
  company: string;
  location: string;
  swiped?: boolean;
}

export interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
}