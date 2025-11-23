"use client"

import React, { useEffect, useState, useRef } from 'react';
import { MessageCard } from './MessageCard';
import { MatchSelectorDialog } from './MatchSelectorDialog';
import { fetchConversations, Conversation, getTimeAgo } from '@/lib/services/messageService';
import { getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Plus, MessageCircle } from 'lucide-react';

interface MessagesListProps {
  onSelectConversation?: (matchId: string, userName: string) => void;
}

export function MessagesList({ onSelectConversation }: MessagesListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMatchSelector, setShowMatchSelector] = useState(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadConversations();

    // Set up auto-refresh every 3 seconds for conversations list
    console.log('⏰ Setting up conversations auto-refresh every 3 seconds');
    refreshIntervalRef.current = setInterval(() => {
      console.log('🔄 Auto-refreshing conversations...');
      loadConversations(true); // true = silent refresh
    }, 3000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        console.log('⏰ Conversations auto-refresh cleared');
      }
    };
  }, []);

  const loadConversations = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const user = await getCurrentUser();
      if (!user) {
        console.error('No user logged in');
        return;
      }

      const fetchedConversations = await fetchConversations(user.id);
      
      // Only update if conversations changed
      setConversations(prev => {
        if (JSON.stringify(prev) === JSON.stringify(fetchedConversations)) {
          return prev;
        }
        if (!silent) {
          console.log('Fetched conversations with messages:', fetchedConversations.length);
        }
        return fetchedConversations;
      });
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handleSelectMatch = (matchId: string, userName: string) => {
    console.log('Selected match from dialog:', matchId, userName);
    // Open the conversation immediately - user will send first message
    onSelectConversation?.(matchId, userName);
    setShowMatchSelector(false);
  };

  const handleMessageClick = (matchId: string) => {
    const conversation = conversations.find(c => c.matchId === matchId);
    if (conversation) {
      onSelectConversation?.(matchId, conversation.otherUserName);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
          <Button size="icon" variant="ghost" disabled>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => setShowMatchSelector(true)}
              title="Start new conversation"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No conversations yet</p>
              <p className="text-sm text-gray-400 mb-4">Start messaging your matches!</p>
              <Button 
                onClick={() => setShowMatchSelector(true)}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <MessageCard
                  key={conversation.matchId}
                  id={conversation.matchId}
                  name={conversation.otherUserName}
                  lastMessage={conversation.lastMessage || 'No messages yet'}
                  timestamp={conversation.lastMessageTime ? getTimeAgo(conversation.lastMessageTime) : ''}
                  unread={conversation.unreadCount > 0}
                  avatar={conversation.otherUserAvatar}
                  onMessageClick={handleMessageClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <MatchSelectorDialog
        open={showMatchSelector}
        onClose={() => setShowMatchSelector(false)}
        onSelectMatch={handleSelectMatch}
      />
    </>
  );
}