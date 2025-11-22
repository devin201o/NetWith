"use client"

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface MessageCardProps {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  avatar?: string;
  onClick?: (id: string) => void;
}

export function MessageCard({
  id,
  name,
  lastMessage,
  timestamp,
  unread,
  avatar,
  onClick
}: MessageCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <div
      onClick={() => onClick?.(id)}
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
        unread ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="w-12 h-12 flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        {/* Message Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-semibold truncate ${unread ? 'text-gray-900' : 'text-gray-700'}`}>
              {name}
            </h4>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{timestamp}</span>
          </div>
          <p className={`text-sm truncate ${unread ? 'text-gray-700 font-medium' : 'text-gray-600'}`}>
            {lastMessage}
          </p>
          {unread && (
            <div className="mt-2">
              <Badge variant="default" className="h-2 w-2 p-0 rounded-full bg-blue-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}