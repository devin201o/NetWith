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
  bio?: string;
  onMessageClick?: (id: string) => void;
  onSelect?: (id: string) => void;
}

/** Why: enforce exactly 6 words + "..." preview per requirement */
function getSixWordPreview(text?: string): string | null {
  if (!text) return null;
  const words = text.trim().split(/\s+/).slice(0, 6);
  if (!words.length) return null;
  return `${words.join(' ')}...`;
}

export function ConnectionCard({
  id,
  name,
  title,
  lastActive,
  mutualConnections,
  avatar,
  bio,
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
  const bioPreview = getSixWordPreview(bio);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer focus:outline-none focus:ring-2"
      style={{ '--tw-ring-color': '#252456' } as React.CSSProperties}
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
        {/* Why: overflow-hidden + object-cover → fills box without distortion */}
        <Avatar className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-full">
          <AvatarImage
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            style={{ objectFit: 'cover' }}
          />
          <AvatarFallback
            className="w-full h-full text-white font-semibold"
            style={{
              background: 'linear-gradient(to bottom right, #252456, #6f4538)'
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-gray-900 truncate">{name}</h4>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 flex-shrink-0 hover:bg-orange-50"
              onClick={(e) => {
                e.stopPropagation(); // keep card from toggling
                onMessageClick?.(id);
              }}
              aria-label={`Message ${name}`}
            >
              {/* <MessageCircle className="w-4 h-4" style={{ color: '#fd9e25' }} /> */}
            </Button>
          </div>

          <p className="text-sm text-gray-600 truncate mb-1">{title}</p>

          {bioPreview && (
            <p className="text-xs text-gray-700">
              {bioPreview}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}