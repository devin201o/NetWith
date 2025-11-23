"use client"

import React, { useEffect, useState } from 'react';
import { ConnectionCard } from './ConnectionCard';
import { getMatchesForUser } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth';

interface Connection {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  lastActive?: string;
  mutualConnections?: number;
  bio?: string;
  skills?: string[];
}

export function ConnectionsList() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConnections() {
      try {
        const user = await getCurrentUser();
        if (!user) {
          console.error('No user logged in');
          setLoading(false);
          return;
        }

        const matches = await getMatchesForUser(user.id);
        
        if (matches) {
          const transformedConnections = matches.map(match => {
            const otherUser = match.user1_id === user.id 
              ? match.user2 
              : match.user1;

            return {
              id: otherUser.id,
              name: otherUser.name,
              title: otherUser.education?.[0] || 'No education listed',
              avatar: otherUser.profile_image_url,
              lastActive: getTimeAgo(match.matched_at),
              mutualConnections: Math.floor(Math.random() * 20),
              bio: otherUser.bio,
              skills: otherUser.skills
            };
          });

          setConnections(transformedConnections);
        }
      } catch (error) {
        console.error('Error loading connections:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConnections();
  }, []);

  const handleMessageClick = (id: string) => {
    console.log('Message clicked for connection:', id);
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Connections</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Connections</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-500 mb-2">No connections yet</p>
          <p className="text-sm text-gray-400">Start swiping to make connections!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Your Connections ({connections.length})
        </h3>
        <div className="space-y-3">
          {connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              {...connection}
              onMessageClick={handleMessageClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}