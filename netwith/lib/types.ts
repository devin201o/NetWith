export interface DatabaseUser {
  id: string;
  email: string;
  name: string | null;
  bio: string | null;
  skills: string | null; // JSON string in database
  interests: string | null; // JSON string in database
  experience: string | null; // JSON string in database
  education: string | null;
  profile_image_url: string | null;
  looking_for: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  age?: number;
  bio: string;
  skills: string[];
  interests: string[];
  experience: ExperienceItem[];
  education: string;
  profileImage: string;
  lookingFor?: "mentor" | "partner" | "network";
  isActive: boolean;
  
  // Professional info
  title?: string;
  company?: string;
  location?: string;
}

export interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: number;
  school: string;
  degree: string;
  period: string;
}