"use client"

import React from 'react';
import { Heart, User, Compass, Shield } from 'lucide-react';

interface SidebarProps {
  activeTab: 'matches' | 'messages';
  onTabChange: (tab: 'matches' | 'messages') => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-96 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="bg-blue-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-700" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
            <User className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
            <Compass className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition">
            <Shield className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => onTabChange('matches')}
          className={`flex-1 py-4 text-sm font-semibold transition ${
            activeTab === 'matches'
              ? 'text-blue-700 border-b-2 border-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Connections
        </button>
        <button
          onClick={() => onTabChange('messages')}
          className={`flex-1 py-4 text-sm font-semibold transition ${
            activeTab === 'messages'
              ? 'text-blue-700 border-b-2 border-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Messages
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-blue-50 rounded-lg h-48 flex items-center justify-center mb-6">
          <div className="text-center">
            <p className="text-gray-600 font-medium">Start Connecting</p>
          </div>
        </div>

        <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
          
        </div>
      </div>
    </div>
  );
}