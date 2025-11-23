"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Link as LinkIcon } from 'lucide-react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { ExperienceItem } from '@/components/profile/ExperienceItem';
import { EducationItem } from '@/components/profile/EducationItem';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: 'Alex Johnson',
        headline: 'Software Engineer | Full Stack Developer',
        location: 'San Francisco, CA',
        profileImage: '/api/placeholder/200/200',
        about: 'Passionate about creating elegant solutions to complex problems. I specialize in full-stack development with a focus on user experience and scalable architecture.',
        experience: [
            {
                id: 1,
                title: 'Senior Software Engineer',
                company: 'Tech Corp',
                period: '2022 - Present',
                description: 'Leading development of core platform features'
            },
            {
                id: 2,
                title: 'Software Engineer',
                company: 'StartupXYZ',
                period: '2020 - 2022',
                description: 'Built and maintained multiple web applications'
            }
        ],
        education: [
            {
                id: 1,
                school: 'University of California',
                degree: 'BS Computer Science',
                period: '2016 - 2020'
            }
        ],
        skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker'],
        links: [
            { id: 1, label: 'GitHub', url: 'github.com/alexj' },
            { id: 2, label: 'Portfolio', url: 'alexjohnson.dev' }
        ]
    });

    useEffect(() => {
        // Get profile data from sessionStorage
        const storedProfile = sessionStorage.getItem('currentProfile');

        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        }
    }, [router]);

    if (!profile && typeof window !== 'undefined') {
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

            <ProfileHeader
                name={profileData.name}
                headline={profileData.headline}
                location={profileData.location}
                profileImage={profileData.profileImage}
                isEditing={isEditing}
                onEditToggle={() => setIsEditing(!isEditing)}
            />

            <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6 pb-8">
                {/* About Section */}
                <ProfileSection title="About" isEditing={isEditing}>
                    {isEditing ? (
                        <Textarea
                            value={profileData.about}
                            onChange={(e) => setProfileData({...profileData, about: e.target.value})}
                            className="resize-none"
                            rows={4}
                        />
                    ) : (
                        <p className="text-gray-600 leading-relaxed">{profileData.about}</p>
                    )}
                </ProfileSection>

                {/* Experience Section */}
                <ProfileSection title="Experience" isEditing={isEditing} onAdd={() => {}}>
                    <div className="space-y-6">
                        {profileData.experience.map((exp) => (
                            <ExperienceItem
                                key={exp.id}
                                {...exp}
                                isEditing={isEditing}
                                onRemove={() => {}}
                            />
                        ))}
                    </div>
                </ProfileSection>

                {/* Education Section */}
                <ProfileSection title="Education" isEditing={isEditing} onAdd={() => {}}>
                    <div className="space-y-6">
                        {profileData.education.map((edu) => (
                            <EducationItem key={edu.id} {...edu} />
                        ))}
                    </div>
                </ProfileSection>

                {/* Skills Section */}
                <ProfileSection title="Skills" isEditing={isEditing} onAdd={() => {}}>
                    <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="px-4 py-2 flex items-center gap-2">
                                {skill}
                                {isEditing && (
                                    <button className="hover:text-gray-800">
                                        <X size={14} />
                                    </button>
                                )}
                            </Badge>
                        ))}
                    </div>
                </ProfileSection>

                {/* Links Section */}
                <ProfileSection title="Links" isEditing={isEditing} onAdd={() => {}}>
                    <div className="space-y-3">
                        {profileData.links.map((link) => (
                            <div key={link.id} className="flex items-center gap-3">
                                <LinkIcon size={16} className="text-gray-400" />
                                <a href={`https://${link.url}`} className="text-blue-600 hover:underline flex-1">
                                    {link.label} - {link.url}
                                </a>
                                {isEditing && (
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                        Remove
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </ProfileSection>
            </div>
        </div>
    );
}