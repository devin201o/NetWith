import { supabase } from './supabase'

// ========== USERS ==========

// Get all users (for discovery/swiping)
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
  
  if (error) console.error('Error fetching users:', error)
  return data
}

// Get single user by ID
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) console.error('Error fetching user:', error)
  return data
}

// Get users to swipe on (exclude current user and already swiped)
export async function getUsersForSwiping(currentUserId: string) {
  // First get IDs of users already swiped on
  const { data: swipedIds } = await supabase
    .from('swipes')
    .select('swiped_id')
    .eq('swiper_id', currentUserId)
  
  const alreadySwipedIds = swipedIds?.map(s => s.swiped_id) || []
  
  // Get users not yet swiped on
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .neq('id', currentUserId)
    .not('id', 'in', `(${alreadySwipedIds.join(',')})`)
  
  if (error) console.error('Error fetching users for swiping:', error)
  return data
}

// ========== PROJECTS ==========

// Get all projects for a user
export async function getProjectsByUserId(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) console.error('Error fetching projects:', error)
  return data
}

// Get single project
export async function getProjectById(projectId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()
  
  if (error) console.error('Error fetching project:', error)
  return data
}

// Create new project
export async function createProject(projectData: {
  user_id: string
  title: string
  description: string
  images?: string[]
  skills_used?: string[]
  status: 'in-progress' | 'completed'
}) {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single()
  
  if (error) console.error('Error creating project:', error)
  return data
}

// ========== SWIPES ==========

// Record a swipe
export async function createSwipe(
  swiperId: string, 
  swipedId: string, 
  direction: 'left' | 'right'
) {
  const { data, error } = await supabase
    .from('swipes')
    .insert([{
      swiper_id: swiperId,
      swiped_id: swipedId,
      direction: direction
    }])
    .select()
    .single()
  
  if (error) console.error('Error creating swipe:', error)
  
  // If right swipe, check for match
  if (direction === 'right' && !error) {
    await checkAndCreateMatch(swiperId, swipedId)
  }
  
  return data
}

// Check if there's a mutual match and create it
async function checkAndCreateMatch(user1Id: string, user2Id: string) {
  // Check if the other user also swiped right
  const { data: reverseSwipe } = await supabase
    .from('swipes')
    .select('*')
    .eq('swiper_id', user2Id)
    .eq('swiped_id', user1Id)
    .eq('direction', 'right')
    .single()
  
  if (reverseSwipe) {
    // It's a match! Create match record
    const { data, error } = await supabase
      .from('matches')
      .insert([{
        user1_id: user1Id,
        user2_id: user2Id
      }])
      .select()
      .single()
    
    if (error) console.error('Error creating match:', error)
    return data
  }
  
  return null
}

// ========== MATCHES ==========

// Get all matches for a user
export async function getMatchesForUser(userId: string) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:users!matches_user1_id_fkey(*),
      user2:users!matches_user2_id_fkey(*)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('matched_at', { ascending: false })
  
  if (error) console.error('Error fetching matches:', error)
  return data
}

// ========== MESSAGES ==========

// Get all messages for a match
export async function getMessagesByMatchId(matchId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })
  
  if (error) console.error('Error fetching messages:', error)
  return data
}

// Send a message
export async function sendMessage(
  matchId: string,
  senderId: string,
  message: string
) {
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      match_id: matchId,
      sender_id: senderId,
      message: message
    }])
    .select()
    .single()
  
  if (error) console.error('Error sending message:', error)
  return data
}

// Subscribe to new messages in real-time
export function subscribeToMessages(matchId: string, callback: (message: any) => void) {
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
      (payload) => callback(payload.new)
    )
    .subscribe()
  
  return subscription
}