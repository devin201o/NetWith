// components/Sidebar.tsx
"use client"

import React, { useState } from 'react';
import { ConnectionsList } from './ConnectionsList';
import { MessagesList } from './MessagesList';
import { MessageThread } from './MessageThread';
import LogoutButton from '@/components/LogoutButton';
import { User } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  activeTab: 'matches' | 'messages' | 'profile';
  onTabChange: (tab: 'matches' | 'messages' | 'profile') => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [selectedConversation, setSelectedConversation] = useState<{
    matchId: string;
    userName: string;
    userAvatar?: string;
  } | null>(null);

  const handleSelectConversation = (matchId: string, userName: string, userAvatar?: string) => {
    setSelectedConversation({ matchId, userName, userAvatar });
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: '#252456' }}>
        <div className="flex items-center gap-3">
          
          {/* PROFILE ICON WRAPPED IN LINK */}
          <Link 
            href="/profile" 
            onClick={() => onTabChange('profile')}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                activeTab === 'profile' ? 'ring-2 ring-white' : '' 
            }`}
          >
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <User className="w-6 h-6" style={{ color: '#252456' }} />
            </div>
          </Link>
          
        </div>
        
        {/* Logout Button */}
        <div className="flex gap-2">
          <LogoutButton /> 
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 flex-shrink-0">
        <button
          onClick={() => {
            onTabChange('matches');
            setSelectedConversation(null);
          }}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === 'matches'
              ? 'border-b-2'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={activeTab === 'matches' ? { color: '#252456', borderColor: '#fd9e25' } : {}}
        >
          Connections
        </button>
        <button
          onClick={() => {
            onTabChange('messages');
            setSelectedConversation(null);
          }}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === 'messages'
              ? 'border-b-2'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={activeTab === 'messages' ? { color: '#252456', borderColor: '#fd9e25' } : {}}
        >
          Messages
        </button>
      </div>

      {/* Content - Removed overflow-hidden, let child components handle scrolling */}
      <div className="flex-1 min-h-0 flex flex-col">
        {(activeTab === 'matches' || activeTab === 'profile') && <ConnectionsList />}
        
        {activeTab === 'messages' && (
          selectedConversation ? (
            <MessageThread
              matchId={selectedConversation.matchId}
              otherUserName={selectedConversation.userName}
              otherUserAvatar={selectedConversation.userAvatar}
              onBack={handleBackToList}
            />
          ) : (
            <MessagesList onSelectConversation={handleSelectConversation} />
          )
        )}
      </div>
    </div>
  );
}