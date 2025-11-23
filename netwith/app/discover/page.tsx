'use client'

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ConnectionsList } from '@/components/ConnectionsList';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {activeTab === 'matches' ? (
          <div className="w-full max-w-4xl h-full">
            <ConnectionsList />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-500">Messages coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}