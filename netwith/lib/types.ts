export interface DatabaseUser {
  id: string;
  email: string;
  name: string | null;
  bio: string | null;
  skills: string | null;
  interests: string | null;
  experience: string | null;
  education: string | null;
  profile_image_url: string | null;
  looking_for: string | null;
  created_at?: string;
  updated_at?: string;
  swiped?: boolean; // Add this field
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
  swiped?: boolean; // Add this field
}

export interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
}