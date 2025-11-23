import { supabase } from '@/lib/supabase';

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
 */
export async function fetchConversations(currentUserId: string): Promise<Conversation[]> {
  try {
    // Get all matches for current user
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select(`
        id,
        user1_id,
        user2_id,
        matched_at,
        user1:users!matches_user1_id_fkey(id, name, profile_image_url),
        user2:users!matches_user2_id_fkey(id, name, profile_image_url)
      `)
      .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
      .order('matched_at', { ascending: false });

    if (matchError) throw matchError;
    if (!matches || matches.length === 0) return [];

    // For each match, get the last message
    const conversations: Conversation[] = await Promise.all(
      matches.map(async (match) => {
        const otherUser = match.user1_id === currentUserId ? match.user2 : match.user1;
        const otherUserId = match.user1_id === currentUserId ? match.user2_id : match.user1_id;

        // Get last message for this match
        const { data: messages } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', match.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const lastMessage = messages?.[0];

        return {
          matchId: match.id,
          otherUserId: otherUserId,
          otherUserName: otherUser?.name || 'Unknown',
          otherUserAvatar: otherUser?.profile_image_url,
          lastMessage: lastMessage?.message,
          lastMessageTime: lastMessage?.created_at,
          unreadCount: 0 // TODO: implement read tracking
        };
      })
    );

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
 * Subscribe to new messages for a match
 */
export function subscribeToMessages(
  matchId: string,
  callback: (message: Message) => void
) {
  const subscription = supabase
    .channel(`messages:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();

  return subscription;
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