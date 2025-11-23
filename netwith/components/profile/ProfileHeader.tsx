"use client"

import React from 'react';
import { Camera, MapPin, Edit2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileHeaderProps {
  name: string;
  headline: string;
  location: string;
  profileImage: string;
  isEditing: boolean;
  onEditToggle: () => void;
  onImageChange?: () => void;
}

export function ProfileHeader({
  name,
  headline,
  location,
  profileImage,
  isEditing,
  onEditToggle,
  onImageChange
}: ProfileHeaderProps) {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-48"></div>
      
      <div className="max-w-4xl mx-auto px-4 -mt-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative p-6 pb-4">
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white">
                  <AvatarImage src={profileImage} alt={name} />
                  <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={onImageChange}
                  >
                    <Camera size={16} />
                  </Button>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                    <p className="text-gray-600 mt-1">{headline}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                      <MapPin size={16} />
                      {location}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={onEditToggle}
                    className="flex items-center gap-2"
                  >
                    {isEditing ? (
                      <>
                        <X size={16} />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 size={16} />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex gap-8 px-6">
              <button className="py-3 border-b-2 border-blue-600 text-blue-600 font-medium">
                Overview
              </button>
              <button className="py-3 text-gray-600 hover:text-gray-900">
                Activity
              </button>
              <button className="py-3 text-gray-600 hover:text-gray-900">
                Posts
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}