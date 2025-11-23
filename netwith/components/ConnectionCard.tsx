// app/components/ConnectionCard.tsx
"use client";

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConnectionCardProps {
  id: string;
  name: string;
  title: string;
  lastActive?: string;
  mutualConnections?: number;
  avatar?: string;
  onMessageClick?: (id: string) => void;
  onSelect?: (id: string) => void; // NEW: open details in sidebar
}

export function ConnectionCard({
  id,
  name,
  title,
  lastActive,
  mutualConnections,
  avatar,
  onMessageClick,
  onSelect
}: ConnectionCardProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleActivate = () => onSelect?.(id);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleActivate();
        }
      }}
      aria-label={`Open ${name}'s profile`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-12 h-12 flex-shrink-0">
          {/* Why: UI kit handles error→fallback automatically */}
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 truncate">{name}</h4>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation(); // keep card from opening
                onMessageClick?.(id);
              }}
              aria-label={`Message ${name}`}
            >
              <MessageCircle className="w-4 h-4 text-blue-600" />
            </Button>
          </div>

          <p className="text-sm text-gray-600 truncate mb-1">{title}</p>

          {(lastActive || typeof mutualConnections === 'number') && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {lastActive && <span>Active {lastActive}</span>}
              {typeof mutualConnections === 'number' && (
                <>
                  <span>•</span>
                  <span>{mutualConnections} mutual</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
