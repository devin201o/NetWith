'use client'

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ProfileCard } from '@/components/ProfileCard';

const mockProfiles = [
  {
    name: "Sarah Johnson",
    age: 28,
    bio: "Passionate about building innovative solutions and connecting with talented professionals.",
    title: "Senior Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    education: "BS Computer Science - Stanford",
    skills: ["React", "TypeScript", "Node.js", "Python"]
  },
  {
    name: "Mike Chen",
    age: 32,
    bio: "Product leader with a passion for user experience and data-driven decisions.",
    title: "Product Manager",
    company: "Meta",
    location: "Menlo Park, CA",
    education: "MBA - Harvard Business School",
    skills: ["Product Strategy", "Analytics", "Leadership"]
  },
  {
    name: "Emily Rodriguez",
    age: 26,
    bio: "Creating beautiful, intuitive designs that users love.",
    title: "UX Designer",
    company: "Apple",
    location: "Cupertino, CA",
    education: "BFA Design - RISD",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"]
  }
];

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

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
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

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
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </div>
    </div>
  )
}