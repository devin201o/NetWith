"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ADDED: Import for navigation
import { Sidebar } from '@/components/Sidebar';
import { ProfileCard } from '@/components/ProfileCard';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';

export default function TinderDesktop() {
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');
  const router = useRouter(); // ADDED: Initialize router for navigation

  // ADDED: Sample profile data (expand this with your actual data)
  const currentProfile = {
    id: "1",
    name: "Yo mama",
    age: 50,
    bio: "GRAAAAAAAAA",
    email: "yomama@example.com",
    skills: ["Cooking", "Gardening", "Knitting"],
    interests: ["Reading", "Traveling", "Photography"],
    experience: ["5 years at Company A", "10 years at Company B"],
    education: "University of Life",
    lookingFor: "network" as const
  };

  // ADDED: Function to navigate to profile page
  const handleViewProfile = () => {
    // Store profile data in sessionStorage for the profile page to access
    sessionStorage.setItem('currentProfile', JSON.stringify(currentProfile));
    router.push('/profile');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onProfileClick={handleViewProfile} // ADDED: Pass profile click handler to Sidebar
      />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8"> {/* MODIFIED: Removed button, back to single flex */}
        <ProfileCard
          name={currentProfile.name} /* MODIFIED: Using currentProfile data */
          age={currentProfile.age}
          bio={currentProfile.bio}
          isActive={true}
          totalImages={5}
        />
      </div>

      {/* Bottom Footer with Keyboard Shortcuts */}
      {/* <KeyboardShortcuts /> */}
      {/* ^uncomment after, its kinda in the way rn */}
    </div>
  );
}