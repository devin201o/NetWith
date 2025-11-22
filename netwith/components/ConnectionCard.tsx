"use client"

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ConnectionCardProps {
  id: string;
  name: string;
  title: string;
  lastActive?: string;
  mutualConnections?: number;
  avatar?: string;
  onMessageClick?: (id: string) => void;
}

export function ConnectionCard({
  id,
  name,
  title,
  lastActive,
  mutualConnections,
  avatar,
  onMessageClick
}: ConnectionCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="w-12 h-12 flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 truncate">{name}</h4>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onMessageClick?.(id);
              }}
            >
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 truncate mb-1">{title}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {mutualConnections && (
              <>
                <span>{mutualConnections} mutual connections</span>
                <span>•</span>
              </>
            )}
            {lastActive && <span>{lastActive}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}