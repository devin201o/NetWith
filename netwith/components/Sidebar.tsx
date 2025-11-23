"use client"

import React, { useState } from 'react';
import { ConnectionsList } from './ConnectionsList';
import { MessagesList } from './MessagesList';
import { MessageThread } from './MessageThread';
import LogoutButton from '@/components/LogoutButton';

interface SidebarProps {
  activeTab: 'matches' | 'messages';
  onTabChange: (tab: 'matches' | 'messages') => void;
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
      <div className="bg-blue-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            {/* <User className="w-6 h-6 text-blue-700" /> */}
          </div>
        </div>
        
        {/* REPLACED: Three Icon Buttons with the Logout Button */}
        <div className="flex gap-2">
          <LogoutButton /> 
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            onTabChange('matches');
            setSelectedConversation(null);
          }}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === 'matches'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
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
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Messages
        </button>
      </div>

      {/* Content */}
      {activeTab === 'matches' && <ConnectionsList />}
      
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
  );
}