// app/components/ConnectionsList.tsx
"use client"

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { ConnectionCard } from './ConnectionCard';
import { getMatchesForUser } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Connection {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  lastActive?: string;
  mutualConnections?: number;
  bio?: string;
  skills?: string[];
  // Projects can be strings or objects; we normalize at render.
  projects?: Array<string | { name: string; description?: string; link?: string }>;
  email?: string;
  company?: string;
  education?: string;
}

export function ConnectionsList() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
          const transformedConnections: Connection[] = matches.map((match: any) => {
            const otherUser = match.user1_id === user.id ? match.user2 : match.user1;

            return {
              id: otherUser.id,
              name: otherUser.name,
              title: otherUser.education?.[0] || 'No education listed',
              avatar: otherUser.profile_image_url,
              lastActive: getTimeAgo(match.matched_at),
              mutualConnections: Math.floor(Math.random() * 20),
              bio: otherUser.bio,
              skills: otherUser.skills,
              projects: otherUser.projects || otherUser.project_list || otherUser.projectTitles || [],
              email: otherUser.email,
              company: otherUser.company,
              education: Array.isArray(otherUser.education) ? otherUser.education?.[0] : otherUser.education
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

  const selected = useMemo(
    () => connections.find(c => c.id === selectedId) || null,
    [connections, selectedId]
  );

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

  // Detail panel replaces list within the sidebar for a better fit
  if (selected) {
    const initials = selected.name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const normalizedProjects = (selected.projects || []).map((p) =>
      typeof p === 'string' ? { name: p } : p
    );

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedId(null)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Connections
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-14 h-14">
              <AvatarImage src={selected.avatar} alt={selected.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-900 text-lg truncate">{selected.name}</h2>
              <p className="text-sm text-gray-600 truncate">{selected.title}</p>
              {(selected.company || selected.education) && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {[selected.company, selected.education].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>
          </div>

          {selected.bio && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">About</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{selected.bio}</p>
            </div>
          )}

          {selected.skills && selected.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selected.skills.map((s, i) => (
                  <Badge key={i} variant="secondary" className="px-2 py-0.5 text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {normalizedProjects.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Projects</h3>
              <div className="space-y-3">
                {normalizedProjects.map((proj, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-900 text-sm truncate">{proj.name || `Project ${i + 1}`}</p>
                      {proj.link && (
                        <a
                          className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-gray-600 mt-1">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected.email && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">Contact: {selected.email}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: list of connections
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
              onSelect={(id) => setSelectedId(id)} // NEW: open details
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
