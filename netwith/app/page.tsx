"use client"

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ProfileCard } from '@/components/ProfileCard';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';

export default function TinderDesktop() {
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <ProfileCard 
          name="Yo mama"
          age={50}
          bio="GRAAAAAAAAA"
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