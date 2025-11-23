// app/connectionprofile/[id]/page.tsx
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, GraduationCap, Handshake, Users, Target, Briefcase, Heart, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { ProjectCard } from '@/components/ProjectCard';
import { Sidebar } from '@/components/Sidebar';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  experience?: string[];
  education?: string;
  profile_image_url?: string;
  looking_for?: 'mentor' | 'partner' | 'network';
}

interface Project {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  skills_used?: string[];
  status: 'in-progress' | 'completed';
  created_at: string;
}

export default function ConnectionProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) throw userError;
        setProfile(userData);

        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [userId]);

  const getLookingForInfo = () => {
    switch (profile?.looking_for) {
      case 'mentor':
        return { label: 'Looking for Mentorship', icon: <GraduationCap className="w-4 h-4" /> };
      case 'partner':
        return { label: 'Looking for Partners', icon: <Handshake className="w-4 h-4" /> };
      case 'network':
        return { label: 'Looking to Network', icon: <Users className="w-4 h-4" /> };
      default:
        return { label: 'Open to Connect', icon: <Target className="w-4 h-4" /> };
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: '#f8f9ff' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#252456' }} />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: '#f8f9ff' }}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Profile not found</p>
            <Button onClick={() => router.push('/discover')} style={{ backgroundColor: '#252456', color: '#feffff' }}>
              Back to Discover
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const lookingForInfo = getLookingForInfo();

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f8f9ff' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="px-6 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/discover')}
              className="gap-2"
              style={{ color: '#252456' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Discover
            </Button>
            <div className="flex-1" />
            <Button variant="outline" size="sm" className="gap-2" style={{ borderColor: '#fd9e25', color: '#252456' }}>
              <Mail className="w-4 h-4" />
              Message
            </Button>
          </div>
        </div>

        <div className="px-8 py-10 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            {/* Avatar: bigger + circle + fills without distortion */}
            <Avatar className="w-40 h-40 md:w-48 md:h-48 border-4 border-white shadow-lg rounded-full overflow-hidden">
              {/* Why: object-cover fills the circle cleanly */}
              <AvatarImage
                src={profile.profile_image_url}
                alt={profile.name}
                className="w-full h-full object-cover"
                style={{ objectFit: 'cover' }}
              />
              <AvatarFallback
                className="text-white text-3xl font-semibold"
                style={{ background: 'linear-gradient(to bottom right, #252456, #6f4538)' }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>

              {profile.looking_for && (
                <div className="flex items-center gap-2 mb-3" style={{ color: '#fd9e25' }}>
                  {lookingForInfo.icon}
                  <span className="text-sm font-medium">{lookingForInfo.label}</span>
                </div>
              )}

              {profile.email && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              )}

              {profile.bio && <p className="text-gray-700 leading-relaxed">{profile.bio}</p>}
            </div>
          </div>

          {/* <div className="h-px mb-10" style={{ backgroundColor: '#252456' }} /> */}

          {profile.education && (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#252456' }}>
                  <GraduationCap className="w-5 h-5" style={{ color: '#fd9e25' }} />
                  Education
                </h2>
                <p className="text-gray-700">{profile.education}</p>
              </div>
              <div className="h-px mb-10" style={{ backgroundColor: '#252456' }} />
            </>
          )}

          {profile.experience && profile.experience.length > 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#252456' }}>
                  <Briefcase className="w-5 h-5" style={{ color: '#fd9e25' }} />
                  Experience
                </h2>
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 pl-4" style={{ borderColor: '#fd9e25' }}>
                      <p className="text-gray-900 font-medium">{exp}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-px mb-10" style={{ backgroundColor: '#252456' }} />
            </>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4" style={{ color: '#252456' }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1"
                      style={{ backgroundColor: '#feffff', color: '#252456', border: '1px solid #252456' }}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
         
          <div className="h-px mb-10" style={{ backgroundColor: '#252456' }} />

          {profile.interests && profile.interests.length > 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#252456' }}>
                  <Heart className="w-5 h-5" style={{ color: '#fd9e25' }} />
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1" style={{ borderColor: '#6f4538', color: '#6f4538' }}>
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="h-px mb-10" style={{ backgroundColor: '#252456' }} />
            </>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#252456' }}>
              <Folder className="w-5 h-5" style={{ color: '#fd9e25' }} />
              Projects ({projects.length})
            </h2>
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No projects yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    images={project.images}
                    skills_used={project.skills_used}
                    status={project.status}
                    onClick={(id) => console.log('Project clicked:', id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
