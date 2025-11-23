// app/profile/page.tsx
'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, GraduationCap, Briefcase, Heart, Folder, Edit2, Save, X } from 'lucide-react';

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
  company?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'matches' | 'messages' | 'profile'>('profile');
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        const profileData = {
          ...data,
          skills: Array.isArray(data.skills) ? data.skills : (data.skills ? JSON.parse(data.skills) : []),
          interests: Array.isArray(data.interests) ? data.interests : (data.interests ? JSON.parse(data.interests) : []),
          experience: Array.isArray(data.experience) ? data.experience : (data.experience ? JSON.parse(data.experience) : []),
        };

        setProfile(profileData);
        setFormData(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (field: 'skills' | 'interests' | 'experience', value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value.split(',').map(item => item.trim()).filter(item => item),
      });
    }
  };

  const handleSave = async () => {
    if (!formData || !profile) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          bio: formData.bio,
          email: formData.email,
          company: formData.company,
          education: formData.education,
          skills: JSON.stringify(formData.skills || []),
          interests: JSON.stringify(formData.interests || []),
          experience: JSON.stringify(formData.experience || []),
          looking_for: formData.looking_for,
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: '#f8f9ff' }}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#252456' }} />
            <p className="text-gray-600">Loading profile...</p>
          </div>
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

  if (editing && formData) {
    return (
      <div className="flex h-screen" style={{ backgroundColor: '#f8f9ff' }}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-y-auto">
          <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="px-6 py-4 flex items-center gap-4">
              <h2 className="text-lg font-semibold" style={{ color: '#252456' }}>
                Edit Profile
              </h2>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="gap-2"
                style={{ color: '#252456' }}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
                style={{ backgroundColor: '#252456', color: '#feffff' }}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          <div className="px-8 py-10 max-w-5xl mx-auto">
            <style>{`
              input:focus, textarea:focus, select:focus {
                border-color: #252456;
                box-shadow: 0 0 0 3px rgba(37, 36, 86, 0.1);
              }
            `}</style>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-gray-100"
                disabled
              />
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Company */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition"
                placeholder="e.g., Tech Inc."
              />
            </div>

            {/* Education */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Education</label>
              <input
                type="text"
                name="education"
                value={formData.education || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition"
                placeholder="e.g., University of BC"
              />
            </div>

            {/* Skills */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Skills (comma-separated)</label>
              <textarea
                value={(formData.skills || []).join(', ')}
                onChange={(e) => handleArrayChange('skills', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition resize-none"
                placeholder="React, TypeScript, Node.js..."
              />
            </div>

            {/* Interests */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Interests (comma-separated)</label>
              <textarea
                value={(formData.interests || []).join(', ')}
                onChange={(e) => handleArrayChange('interests', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition resize-none"
                placeholder="AI, Web Development, Startups..."
              />
            </div>

            {/* Experience */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Experience (comma-separated)</label>
              <textarea
                value={(formData.experience || []).join(', ')}
                onChange={(e) => handleArrayChange('experience', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none transition resize-none"
                placeholder="5 years in software development..."
              />
            </div>

            {/* Looking For */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Looking For</label>
              <select
                value={formData.looking_for || 'network'}
                onChange={(e) => setFormData({ ...formData, looking_for: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              >
                <option value="network">Looking to Network</option>
                <option value="mentor">Looking for Mentorship</option>
                <option value="partner">Looking for Partners</option>
              </select>
            </div>

            <div className="h-20"></div>
          </div>
        </div>
      </div>
    );
  }

  // View mode
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
            <h2 className="text-lg font-semibold" style={{ color: '#252456' }}>
              My Profile
            </h2>
            <div className="flex-1" />
            <Button
              size="sm"
              onClick={() => setEditing(true)}
              className="gap-2"
              style={{ backgroundColor: '#252456', color: '#feffff' }}
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="px-8 py-10 max-w-5xl mx-auto">
          {/* Header with Avatar */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <Avatar className="w-40 h-40 md:w-48 md:h-48 border-4 border-white shadow-lg rounded-full overflow-hidden">
              <AvatarImage
                src={profile.profile_image_url}
                alt={profile.name}
                className="w-full h-full object-cover"
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
                  <span className="text-sm font-medium">
                    {profile.looking_for === 'mentor' && 'Looking for Mentorship'}
                    {profile.looking_for === 'partner' && 'Looking for Partners'}
                    {profile.looking_for === 'network' && 'Looking to Network'}
                  </span>
                </div>
              )}

              {profile.email && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              )}

              {profile.company && (
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">{profile.company}</span>
                </div>
              )}

              {profile.bio && <p className="text-gray-700 leading-relaxed mt-4">{profile.bio}</p>}
            </div>
          </div>

          <div className="h-px mb-10" style={{ backgroundColor: '#252456' }} />

          {/* Education */}
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

          {/* Experience */}
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

          {/* Skills */}
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
              <div className="h-px mb-10" style={{ backgroundColor: '#252456' }} />
            </>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: '#252456' }}>
                  <Heart className="w-5 h-5" style={{ color: '#fd9e25' }} />
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1"
                      style={{ borderColor: '#6f4538', color: '#6f4538' }}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
}