'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { ProfileCard } from '@/components/ProfileCard';
import { fetchDiscoverProfiles } from '@/lib/services/profileService';
import { Profile } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';

export default function DiscoverPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch profiles on mount
  useEffect(() => {
    async function loadProfiles() {
      try {
        setLoading(true);
        
        // Get current user
        const user = await getCurrentUser();
        if (!user) {
          console.log('No user found, redirecting to login');
          router.push('/login');
          return;
        }
        
        console.log('Current user:', user.id);
        setCurrentUserId(user.id);
        
        // Fetch profiles
        const fetchedProfiles = await fetchDiscoverProfiles(user.id);
        console.log('Fetched profiles:', fetchedProfiles.length);
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error('Error loading profiles:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, [router]);

  const handleSwipeLeft = () => {
    if (profiles.length === 0) return;
    
    console.log('Passed on:', profiles[currentProfileIndex].name);
    setHistory(prev => [...prev, currentProfileIndex]);
    setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
  };

  const handleSwipeRight = () => {
    if (profiles.length === 0) return;
    
    console.log('Connected with:', profiles[currentProfileIndex].name);
    // TODO: Save connection to database
    setHistory(prev => [...prev, currentProfileIndex]);
    setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    const lastIndex = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentProfileIndex(lastIndex);
    
    console.log('Undo: Going back to', profiles[lastIndex].name);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  // No profiles state
  if (profiles.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-2">No more profiles to show</p>
            <p className="text-gray-500">Check back later for new connections!</p>
          </div>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex items-center justify-center p-8">
        <ProfileCard 
          key={currentProfileIndex}
          name={currentProfile.name}
          email={currentProfile.email}
          bio={currentProfile.bio}
          isActive={currentProfile.isActive}
          totalImages={5}
          title={currentProfile.title}
          company={currentProfile.company}
          education={currentProfile.education}
          skills={currentProfile.skills}
          interests={currentProfile.interests}
          experience={currentProfile.experience}
          lookingFor={currentProfile.lookingFor}
          profileImage={currentProfile.profileImage}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onUndo={handleUndo}
          canUndo={history.length > 0}
        />
      </div>
    </div>
  );
}