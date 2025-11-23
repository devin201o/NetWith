import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface Conversation {
  matchId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

/**
 * Fetch all conversations for current user
 * Only returns conversations that have at least one message
 */
export async function fetchConversations(currentUserId: string): Promise<Conversation[]> {
  try {
    // First, get all matches for the current user
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select(`
        id,
        user1_id,
        user2_id,
        user1:users!matches_user1_id_fkey(id, name, profile_image_url),
        user2:users!matches_user2_id_fkey(id, name, profile_image_url)
      `)
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`);

    if (matchError) throw matchError;
    if (!matches || matches.length === 0) {
      console.log('No matches found for user');
      return [];
    }

    console.log('Found matches:', matches.length);

    // Get match IDs
    const matchIds = matches.map(m => m.id);

    // Now get messages for these matches
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .in('match_id', matchIds)
      .order('created_at', { ascending: false });

    if (messagesError) throw messagesError;
    
    if (!messages || messages.length === 0) {
      console.log('No messages found for any matches');
      return [];
    }

    console.log('Found messages:', messages.length);

    // Group messages by match_id and build conversations
    const conversationsMap = new Map<string, Conversation>();

    // Get the last message for each match
    matches.forEach(match => {
      // Find the most recent message for this match
      const matchMessages = messages.filter(msg => msg.match_id === match.id);
      
      if (matchMessages.length === 0) {
        // Skip matches with no messages
        return;
      }

      const lastMessage = matchMessages[0]; // Already sorted by created_at desc
      const otherUser = match.user1_id === currentUserId ? match.user2 : match.user1;
      const otherUserId = match.user1_id === currentUserId ? match.user2_id : match.user1_id;

      conversationsMap.set(match.id, {
        matchId: match.id,
        otherUserId: otherUserId,
        otherUserName: otherUser?.name || 'Unknown',
        otherUserAvatar: otherUser?.profile_image_url,
        lastMessage: lastMessage.message,
        lastMessageTime: lastMessage.created_at,
        unreadCount: 0 // TODO: implement read tracking
      });
    });

    const conversations = Array.from(conversationsMap.values());
    
    // Sort by last message time (most recent first)
    conversations.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });

    console.log('Returning conversations:', conversations.length);
    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * Fetch messages for a specific match
 */
export async function fetchMessages(matchId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

/**
 * Send a new message
 */
export async function sendMessage(
  matchId: string,
  senderId: string,
  message: string
): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: senderId,
        message: message
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

/**
 * Subscribe to new messages using Realtime Broadcast
 * The trigger uses realtime.broadcast_changes() which sends:
 * - topic: as first parameter
 * - event: TG_OP (INSERT)  
 * - operation: TG_OP
 * - table: TG_TABLE_NAME
 * - schema: TG_TABLE_SCHEMA
 * - record: NEW (the new row data)
 * - old_record: NULL
 */
export async function subscribeToMessages(
  matchId: string,
  callback: (message: Message) => void
): Promise<RealtimeChannel> {
  const topic = `match:${matchId}:messages`;
  
  console.log('📡 [REALTIME] Subscribing to topic:', topic);

  // Set auth token for private channel
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    await supabase.realtime.setAuth(session.access_token);
    console.log('🔐 [REALTIME] Auth token set');
  } else {
    console.warn('⚠️ [REALTIME] No session found - broadcast might not work');
  }

  const channel = supabase.channel(topic, {
    config: {
      broadcast: { 
        self: true,
        ack: false 
      },
    },
  });

  channel
    .on('broadcast', { event: 'INSERT' }, (payload: any) => {
      console.log('📨 [REALTIME] Raw broadcast payload:', payload);
      
      let newMessage: Message | null = null;

      // Try to extract the message from various possible structures
      if (payload.record) {
        console.log('📦 [REALTIME] Found message in payload.record');
        newMessage = payload.record;
      } else if (payload.payload?.record) {
        console.log('📦 [REALTIME] Found message in payload.payload.record');
        newMessage = payload.payload.record;
      } else if (payload.payload) {
        console.log('📦 [REALTIME] Found message in payload.payload');
        newMessage = payload.payload;
      } else {
        console.log('📦 [REALTIME] Using payload directly');
        newMessage = payload;
      }

      if (newMessage?.id && newMessage?.match_id) {
        console.log('✅ [REALTIME] Valid message received:', {
          id: newMessage.id,
          match_id: newMessage.match_id,
          sender_id: newMessage.sender_id,
          message_preview: newMessage.message?.substring(0, 30) + '...',
        });
        callback(newMessage);
      } else {
        console.error('❌ [REALTIME] Invalid message structure:', newMessage);
        console.error('Full payload:', JSON.stringify(payload, null, 2));
      }
    })
    .subscribe((status) => {
      console.log('📡 [REALTIME] Subscription status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('✅ [REALTIME] Successfully subscribed to match:', matchId);
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ [REALTIME] Channel error');
      } else if (status === 'TIMED_OUT') {
        console.error('⏱️ [REALTIME] Subscription timed out');
      } else if (status === 'CLOSED') {
        console.log('🔒 [REALTIME] Channel closed');
      }
    });

  return channel;
}

/**
 * Unsubscribe from a channel
 */
export async function unsubscribeFromMessages(channel: RealtimeChannel): Promise<void> {
  if (channel) {
    await supabase.removeChannel(channel);
    console.log('👋 [REALTIME] Unsubscribed from messages channel');
  }
}

/**
 * Get time ago string
 */
export function getTimeAgo(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  } catch (error) {
    return '';
  }
}