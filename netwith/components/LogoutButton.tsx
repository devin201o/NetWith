// components/LogoutButton.tsx
"use client"

import { LogOut } from 'lucide-react'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- ADD THIS IMPORT
import { supabase } from '@/lib/supabase'; // <-- CHANGE/ADD: Import the client-side instance

export default function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Call client-side sign out
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Client-side Logout error:', error.message);
      // Still push to login page even if error occurs
    }

    // 2. Redirect the user immediately
    router.push('/login');
    router.refresh(); // Force a client-side navigation refresh
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-2xl w-64 border-2 border-red-500">
          <p className="text-sm font-semibold text-gray-800 mb-4 text-center">
            Are you sure you want to sign out?
          </p>
          <div className="flex gap-3 w-full">
            {/* Cancel Button */}
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            
            {/* Confirm/Logout Button (NOW CALLS CLIENT FUNCTION) */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default Button View (when not showing confirmation)
  return (
    <button 
      type="button" 
      onClick={() => setShowConfirm(true)} 
      // Styling to match the existing icon buttons
      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
    >
      <LogOut className="w-5 h-5 text-white" />
    </button>
  );
}