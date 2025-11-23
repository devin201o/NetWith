"use client" 

import { signOut } from '@/lib/actions/auth' 
import { LogOut } from 'lucide-react'
import React, { useState } from 'react';

export default function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  const blueColor = '#252456';
  const orangeColor = '#fd9e25';

  if (showConfirm) {
    return (
      <div className="flex flex-col items-center bg-white p-4 rounded-md shadow-xl absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 border-2 border-red-500">
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
          
          {/* Confirm/Logout Button */}
          <form action={signOut} className="flex-1">
            <button
              type="submit"
              className="w-full px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Default Button View (when not showing confirmation)
  return (
    <button 
      type="button" // Change type to button
      onClick={() => setShowConfirm(true)} // Click shows the dialog
      // Styling to match the existing icon buttons
      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
    >
      <LogOut className="w-5 h-5 text-white" />
    </button>
  );
}