"use client"

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageCardProps {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
  avatar?: string;
  onMessageClick?: (id: string) => void;
}

export function MessageCard({
  id,
  name,
  lastMessage,
  timestamp,
  unread = false,
  avatar,
  onMessageClick
}: MessageCardProps) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '??';

  return (
    <div
      onClick={() => onMessageClick?.(id)}
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
        unread ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-semibold truncate ${unread ? 'text-gray-900' : 'text-gray-800'}`}>
              {name}
            </h4>
            {timestamp && (
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{timestamp}</span>
            )}
          </div>
          <p className={`text-sm truncate ${unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
            {lastMessage}
          </p>
        </div>

        {unread && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
        )}
      </div>
    </div>
  );
}