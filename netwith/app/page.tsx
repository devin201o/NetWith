"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ADDED: Import for navigation
import { Sidebar } from '@/components/Sidebar';
import { ProfileCard } from '@/components/ProfileCard';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';

// ADDED: Mock profiles array for browsing
const mockProfiles = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 28,
    bio: "Passionate about building innovative solutions and connecting with talented professionals.",
    title: "Senior Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    education: "BS Computer Science - Stanford",
    email: "sarah.j@example.com",
    skills: ["React", "TypeScript", "Node.js", "Python"],
    interests: ["Coding", "Hiking", "Photography"],
    experience: ["5 years at Google", "3 years at Facebook"],
    lookingFor: "network" as const
  },
  {
    id: "2",
    name: "Mike Chen",
    age: 32,
    bio: "Product leader with a passion for user experience and data-driven decisions.",
    title: "Product Manager",
    company: "Meta",
    location: "Menlo Park, CA",
    education: "MBA - Harvard Business School",
    email: "mike.c@example.com",
    skills: ["Product Strategy", "Analytics", "Leadership"],
    interests: ["Strategy", "Business", "Travel"],
    experience: ["8 years at Meta", "2 years at Amazon"],
    lookingFor: "mentor" as const
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    age: 26,
    bio: "Creating beautiful, intuitive designs that users love.",
    title: "UX Designer",
    company: "Apple",
    location: "Cupertino, CA",
    education: "BFA Design - RISD",
    email: "emily.r@example.com",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
    interests: ["Design", "Art", "Music"],
    experience: ["4 years at Apple", "2 years at Adobe"],
    lookingFor: "partner" as const
  }
];

export default function TinderDesktop() {
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0); // ADDED: Track current profile
  const router = useRouter(); // ADDED: Initialize router for navigation

  // ADDED: Function to navigate to profile page
  const handleViewProfile = () => {
    const currentProfile = mockProfiles[currentProfileIndex];
    // Store profile data in sessionStorage for the profile page to access
    sessionStorage.setItem('currentProfile', JSON.stringify(currentProfile));
    router.push('/profile');
  };

  // ADDED: Swipe handlers
  const handleSwipeLeft = () => {
    console.log('Passed on:', mockProfiles[currentProfileIndex].name);
    // Move to next profile
    setCurrentProfileIndex((prev) => (prev + 1) % mockProfiles.length);
  };

  const handleSwipeRight = () => {
    console.log('Connected with:', mockProfiles[currentProfileIndex].name);
    // Move to next profile
    setCurrentProfileIndex((prev) => (prev + 1) % mockProfiles.length);
  };

  const currentProfile = mockProfiles[currentProfileIndex];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onProfileClick={handleViewProfile} // ADDED: Pass profile click handler to Sidebar
      />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <ProfileCard
          key={currentProfileIndex} // Force re-render on profile change
          name={currentProfile.name}
          age={currentProfile.age}
          bio={currentProfile.bio}
          isActive={true}
          totalImages={5}
          title={currentProfile.title}
          company={currentProfile.company}
          location={currentProfile.location}
          education={currentProfile.education}
          skills={currentProfile.skills}
          onSwipeLeft={handleSwipeLeft} // ADDED: Swipe handlers
          onSwipeRight={handleSwipeRight}
        />
      </div>

      {/* Bottom Footer with Keyboard Shortcuts */}
      {/* <KeyboardShortcuts /> */}
      {/* ^uncomment after, its kinda in the way rn */}
    </div>
  );
}