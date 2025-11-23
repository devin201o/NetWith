// app/profile/page.tsx
import { getCurrentUser, getUserProfile } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';
import { Sidebar } from '@/components/Sidebar';
import { DatabaseUser } from '@/lib/types'; 

export default async function ManageProfilePage() {
  
  const user = await getCurrentUser();
  let currentProfileData: DatabaseUser | null = null;
  let userId: string;
  
  if (!user) {
    // --- TEMPORARY BYPASS LOGIC ---
    // If user is logged out, use mock ID and provide robust mock data fallback.
    userId = "00000000-0000-0000-0000-000000000000"; 
    
   
    currentProfileData = await getUserProfile(userId);
    
    if (!currentProfileData) {
        
        currentProfileData = {
            id: userId,
            email: "mock@netwith.com",
            name: "Mock User / No Data Found",
            bio: "This is a placeholder. Please log in to see real data.",
            skills: "[]",
            interests: "[]",
            experience: "[]",
            education: "UBC",
            profile_image_url: null,
            looking_for: "network",
            swiped: false
        } as DatabaseUser;
    }
    
 
    
  } else {
    
    userId = user.id;
    currentProfileData = await getUserProfile(userId);
    
    if (!currentProfileData) {
        
        redirect('/setup'); 
    }
  }

 
  const initialProfile: Partial<DatabaseUser> = {
    ...currentProfileData,
    skills: currentProfileData.skills ? JSON.parse(currentProfileData.skills as string) : [],
    interests: currentProfileData.interests ? JSON.parse(currentProfileData.interests as string) : [],
    experience: currentProfileData.experience ? JSON.parse(currentProfileData.experience as string) : [],
  };


  return (
    <div className="flex h-screen bg-[#f8f9ff]">
      {}
      <Sidebar activeTab="profile" /> 

      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#252456]">Manage Profile</h1>
        
        {/* Pass the fetched, parsed data to the client component for editing */}
        <ProfileForm initialProfile={initialProfile} />
        
        <div className="h-20"></div>
      </div>
    </div>
  );
}