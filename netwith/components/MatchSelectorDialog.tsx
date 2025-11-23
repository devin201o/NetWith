"use client"

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

interface Match {
  matchId: string;
  userId: string;
  name: string;
  avatar?: string;
  education?: string;
}

interface MatchSelectorDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectMatch: (matchId: string, userName: string, userAvatar?: string) => void;
}

export function MatchSelectorDialog({ open, onClose, onSelectMatch }: MatchSelectorDialogProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadMatches();
    }
  }, [open]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          user1_id,
          user2_id,
          user1:users!matches_user1_id_fkey(id, name, profile_image_url, education),
          user2:users!matches_user2_id_fkey(id, name, profile_image_url, education)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('matched_at', { ascending: false });

      if (error) {
        console.error('Error loading matches:', error);
        return;
      }

      const transformedMatches = data?.map((match) => {
        const otherUser = match.user1_id === user.id ? match.user2 : match.user1;
        return {
          matchId: match.id,
          userId: otherUser?.id || 'unknown',
          name: otherUser?.name || 'Unknown',
          avatar: otherUser?.profile_image_url,
          education: otherUser?.education
        };
      }) || [];

      console.log('Loaded matches for selector:', transformedMatches);
      setMatches(transformedMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = (match: Match) => {
    console.log('Selected match from dialog:', match);
    onSelectMatch(match.matchId, match.name, match.avatar);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Start a Conversation</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No matches yet</p>
              <p className="text-sm mt-2">Start swiping to make connections!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {matches.map((match) => {
                const initials = match.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <button
                    key={match.matchId}
                    onClick={() => handleSelectMatch(match)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition text-left"
                  >
                    <Avatar className="w-12 h-12">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {initials}
                      </div>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{match.name}</p>
                      <p className="text-sm text-gray-600 truncate">{match.education || 'No education listed'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}