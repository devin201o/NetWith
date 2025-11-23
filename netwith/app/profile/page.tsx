"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfilePage from '@/components/profile-page';

type Profile = {
    id: string;
    name: string;
    email: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
    experience?: string[];
    education?: string;
    profileImageUrl?: string;
    lookingFor?: "mentor" | "partner" | "network";
    age?: number;
};

export default function ProfileRoute() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        // Get profile data from sessionStorage
        const storedProfile = sessionStorage.getItem('currentProfile');

        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        } else {
            // If no profile data, redirect back to home
            router.push('/');
        }
    }, [router]);

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back button */}
            <div className="p-4">
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
                >
                    ← Back
                </button>
            </div>

            <ProfilePage profile={profile} />
        </div>
    );
}