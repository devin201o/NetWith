'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { ProfileCard } from '@/components/ProfileCard';
import { fetchDiscoverProfiles } from '@/lib/services/profileService';
import { Profile } from '@/lib/types';
import { getCurrentUser } from '@/lib/auth';

/**
 * Fisher-Yates shuffle algorithm to randomize array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function DiscoverPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [shuffledProfiles, setShuffledProfiles] = useState<Profile[]>([]);
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
        
        // Shuffle the profiles for random order
        const randomized = shuffleArray(fetchedProfiles);
        setShuffledProfiles(randomized);
        
        console.log('Loaded and shuffled', randomized.length, 'profiles');
      } catch (error) {
        console.error('Error loading profiles:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfiles();
  }, [router]);

  const handleSwipeLeft = () => {
    if (shuffledProfiles.length === 0) return;
    
    console.log('Passed on:', shuffledProfiles[currentProfileIndex].name);
    setHistory(prev => [...prev, currentProfileIndex]);
    
    // Move to next profile or loop back to start
    const nextIndex = currentProfileIndex + 1;
    if (nextIndex >= shuffledProfiles.length) {
      // Reached the end, reshuffle and start over
      console.log('Reached end of profiles, reshuffling...');
      const reshuffled = shuffleArray(profiles);
      setShuffledProfiles(reshuffled);
      setCurrentProfileIndex(0);
      setHistory([]); // Clear history on reshuffle
    } else {
      setCurrentProfileIndex(nextIndex);
    }
  };

  const handleSwipeRight = () => {
    if (shuffledProfiles.length === 0) return;
    
    console.log('Connected with:', shuffledProfiles[currentProfileIndex].name);
    // TODO: Save connection to database
    setHistory(prev => [...prev, currentProfileIndex]);
    
    // Move to next profile or loop back to start
    const nextIndex = currentProfileIndex + 1;
    if (nextIndex >= shuffledProfiles.length) {
      // Reached the end, reshuffle and start over
      console.log('Reached end of profiles, reshuffling...');
      const reshuffled = shuffleArray(profiles);
      setShuffledProfiles(reshuffled);
      setCurrentProfileIndex(0);
      setHistory([]); // Clear history on reshuffle
    } else {
      setCurrentProfileIndex(nextIndex);
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || currentProfileIndex === 0) return;
    
    // Go back one profile
    const previousIndex = currentProfileIndex - 1;
    setHistory(prev => prev.slice(0, -1));
    setCurrentProfileIndex(previousIndex);
    
    console.log('Undo: Going back to', shuffledProfiles[previousIndex].name);
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
  if (shuffledProfiles.length === 0) {
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

  const currentProfile = shuffledProfiles[currentProfileIndex];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex items-center justify-center p-8">
        <ProfileCard 
          key={`${currentProfile.id}-${currentProfileIndex}`}
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
          canUndo={history.length > 0 && currentProfileIndex > 0}
        />
      </div>
    </div>
  );
}