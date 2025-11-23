"use client"

import React from 'react';
import { Heart, User, Compass, Shield } from 'lucide-react';
import { ConnectionsList } from './ConnectionsList';
import { MessagesList } from './MessagesList';
import LogoutButton from '@/components/LogoutButton';

interface SidebarProps {
  activeTab: 'matches' | 'messages';
  onTabChange: (tab: 'matches' | 'messages') => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-96 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between" style={{ backgroundColor: '#252456' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <User className="w-6 h-6" style={{ color: '#252456' }} />
          </div>
        </div>
        
        {/* REPLACED: Three Icon Buttons with the Logout Button */}
        <div className="flex gap-2">
          {/* : 
            <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
              <User className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
              <Compass className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
              <Shield className="w-5 h-5 text-white" />
            </button> 
          */}
          <LogoutButton /> 
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => onTabChange('matches')}
          className={`flex-1 py-4 text-sm font-semibold transition ${
            activeTab === 'matches'
              ? 'border-b-2'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={activeTab === 'matches' ? { color: '#252456', borderColor: '#fd9e25' } : {}}
        >
          Connections
        </button>
        <button
          onClick={() => onTabChange('messages')}
          className={`flex-1 py-4 text-sm font-semibold transition ${
            activeTab === 'messages'
              ? 'border-b-2'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={activeTab === 'messages' ? { color: '#252456', borderColor: '#fd9e25' } : {}}
        >
          Messages
        </button>
      </div>

      {/* Dynamic Content Area */}
      {activeTab === 'matches' ? <ConnectionsList /> : <MessagesList />}
    </div>
  );
}