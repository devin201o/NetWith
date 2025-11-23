// components/ConnectionsList.tsx
"use client"

import React, { useEffect, useState, useRef } from 'react'; // ADD useRef
import { ConnectionCard } from './ConnectionCard';
import { supabase } from '@/lib/supabase'; // Import the client-side Supabase instance
import { getCurrentUser } from '@/lib/auth';
// REMOVED: import { getMatchesForUser } from '@/lib/database';

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


// Helper to transform Supabase match object into ConnectionCard format
const transformMatchToConnection = (match: any, currentUserId: string): Connection => {
  // The embedded profile data is under the foreign key property (user1_id or user2_id)
  // We check which embedded profile object's ID is NOT the current user's ID
  const profileData = match.user1_id.id === currentUserId ? match.user2_id : match.user1_id;
  
  return {
    id: profileData.id,
    name: profileData.name || 'New Connection',
    // Check if education is an array before accessing [0]
    title: Array.isArray(profileData.education) ? profileData.education[0] : profileData.education || 'No education listed',
    avatar: profileData.profile_image_url,
    lastActive: getTimeAgo(match.matched_at || match.created_at),
    mutualConnections: Math.floor(Math.random() * 20),
    bio: profileData.bio,
    skills: profileData.skills
  };
};


export function ConnectionsList() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    let connectionChannel: any = null;

    async function loadInitialConnectionsAndSubscribe() {
      try {
        setLoading(true);
        
        // 1. Get current user
        const user = await getCurrentUser();
        if (!user) {
          console.error('No user logged in');
          setLoading(false);
          return;
        }
        currentUserId.current = user.id;

        // 2. Fetch initial list of matches (Selecting profile data via foreign keys)
        const { data: initialMatches, error: matchError } = await supabase
          .from('matches')
          .select('*, user1_id (id, name, education, profile_image_url, bio, skills), user2_id (id, name, education, profile_image_url, bio, skills)')
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        if (matchError) throw matchError;

        const transformedConnections = initialMatches.map((match: any) => 
          transformMatchToConnection(match, user.id)
        );

        setConnections(transformedConnections);
        setLoading(false);

        // 3. Set up REALTIME SUBSCRIPTION
        connectionChannel = supabase.channel('connections_feed')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'matches' },
            (payload: any) => {
              const newMatch = payload.new;
              
              if (newMatch.user1_id === currentUserId.current || newMatch.user2_id === currentUserId.current) {
                console.log('Realtime new match detected:', newMatch);
                
                // Determine the ID of the new connection
                const connectionId = newMatch.user1_id === currentUserId.current 
                  ? newMatch.user2_id 
                  : newMatch.user1_id;

                // Fetch the full profile for the newly matched user
                supabase.from('profiles')
                  .select('id, name, education, profile_image_url, bio, skills')
                  .eq('id', connectionId)
                  .single()
                  .then(({ data: profileData }) => {
                    if (profileData) {
                      // Construct the final Connection object using the fetched profile data
                      const newConnection: Connection = {
                        id: profileData.id,
                        name: profileData.name || 'New Connection',
                        title: Array.isArray(profileData.education) ? profileData.education[0] : profileData.education || 'No education listed',
                        avatar: profileData.profile_image_url,
                        lastActive: getTimeAgo(newMatch.created_at), // Use timestamp from realtime payload
                        mutualConnections: Math.floor(Math.random() * 20),
                        bio: profileData.bio,
                        skills: profileData.skills
                      };
                      
                      setConnections(prev => {
                        // Add the new connection to the top of the list, avoid duplicates
                        if (prev.some(c => c.id === newConnection.id)) return prev;
                        return [newConnection, ...prev];
                      });
                    }
                  });
              }
            }
          )
          .subscribe(); // Start listening!

      } catch (error) {
        console.error('Error setting up connections:', error);
        setLoading(false);
      }
    }

    loadInitialConnectionsAndSubscribe();

    // CLEANUP: Unsubscribe when the component unmounts
    return () => {
      if (connectionChannel) {
        connectionChannel.unsubscribe();
        supabase.removeChannel(connectionChannel); 
      }
    };
  }, []); // Empty dependency array means this runs only on mount

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

// Function moved here to match original placement structure
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