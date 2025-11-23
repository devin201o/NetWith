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
  const [history, setHistory] = useState<number[]>([]);

  const handleSwipeLeft = () => {
    console.log('Passed on:', mockProfiles[currentProfileIndex].name);
    // Add current index to history before moving
    setHistory(prev => [...prev, currentProfileIndex]);
    // Move to next profile
    setCurrentProfileIndex((prev) => (prev + 1) % mockProfiles.length);
  };

  const handleSwipeRight = () => {
    console.log('Connected with:', mockProfiles[currentProfileIndex].name);
    // Add current index to history before moving
    setHistory(prev => [...prev, currentProfileIndex]);
    // Move to next profile
    setCurrentProfileIndex((prev) => (prev + 1) % mockProfiles.length);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    
    // Get the last profile index from history
    const lastIndex = history[history.length - 1];
    
    // Remove it from history
    setHistory(prev => prev.slice(0, -1));
    
    // Go back to that profile
    setCurrentProfileIndex(lastIndex);
    
    console.log('Undo: Going back to', mockProfiles[lastIndex].name);
  };

  const currentProfile = mockProfiles[currentProfileIndex];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <ProfileCard 
          key={currentProfileIndex}
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
          onUndo={handleUndo}
          canUndo={history.length > 0}
        />
      </div>
    </div>
  )
}