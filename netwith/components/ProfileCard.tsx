"use client"

import React, { useState } from 'react';
import { Handshake, X, Star, RotateCcw, Zap, User, Briefcase, GraduationCap, Heart, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  name?: string;
  email?: string;
  bio?: string;
  isActive?: boolean;
  totalImages?: number;
  title?: string;
  company?: string;
  education?: string;
  skills?: string[];
  interests?: string[];
  experience?: any[];
  lookingFor?: "mentor" | "partner" | "network";
  profileImage?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function ProfileCard({
  name = "Name",
  email,
  bio = "Bio goes here...",
  isActive = true,
  totalImages = 5,
  title = "Software Engineer",
  company = "Tech Company",
  education = "BS Computer Science",
  skills = ["JavaScript", "React", "Node.js"],
  interests = [],
  experience = [],
  lookingFor,
  profileImage,
  onSwipeLeft,
  onSwipeRight,
  onUndo,
  canUndo = false
}: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSwipeDirection(direction);

    // Wait for animation to complete before callback
    setTimeout(() => {
      if (direction === 'left') {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }

      // Reset state after callback
      setTimeout(() => {
        setSwipeDirection(null);
        setIsAnimating(false);
      }, 100);
    }, 500);
  };

  const handleUndo = () => {
    if (!canUndo || isAnimating) return;
    onUndo?.();
  };

  const getCardClassName = () => {
    let baseClass = "relative w-[800px] h-[650px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500";

    if (swipeDirection === 'left') {
      return `${baseClass} -translate-x-[1000px] -rotate-12 opacity-0`;
    } else if (swipeDirection === 'right') {
      return `${baseClass} translate-x-[1000px] rotate-12 opacity-0`;
    }

    return baseClass;
  };

  const getLookingForLabel = () => {
    switch (lookingFor) {
      case 'mentor': return 'Looking for Mentorship';
      case 'partner': return 'Looking for Partners';
      case 'network': return 'Looking to Network';
      default: return 'Open to Connect';
    }
  };

  const getLookingForIcon = () => {
    switch (lookingFor) {
      case 'mentor': return <GraduationCap className="w-4 h-4" />;
      case 'partner': return <Handshake className="w-4 h-4" />;
      case 'network': return <Users className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className={getCardClassName()}>
      {/* Swipe Indicator Overlays */}
      {swipeDirection === 'left' && (
        <div className="absolute inset-0 bg-red-500/20 z-20 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-8 transform rotate-12">
            <X className="w-24 h-24 text-red-500" />
          </div>
        </div>
      )}

      {swipeDirection === 'right' && (
        <div className="absolute inset-0 bg-blue-500/20 z-20 flex items-center justify-center">
          <div className="bg-white/90 rounded-full p-8 transform -rotate-12">
            <Handshake className="w-24 h-24 text-blue-600" />
          </div>
        </div>
      )}

      {/* MODIFIED: Scrollable Content Area - now includes the image */}
      <div className="flex-1 overflow-y-auto">
        {/* MOVED: Image section now inside scrollable area - MADE LARGER (480px) */}
        <div className="relative h-[480px] bg-gradient-to-br from-gray-200 to-gray-300">
          {/* Image Carousel Indicators */}
          <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
            {Array.from({ length: totalImages }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition ${index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                  }`}
              />
            ))}
          </div>

          {/* Profile Image */}
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <User className="w-20 h-20 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Profile Image</p>
              </div>
            </div>
          )}

          {/* Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-2xl font-bold">{name}</h2>
              {isActive && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
            </div>
            {lookingFor && (
              <div className="flex items-center gap-1 mt-1 text-white/90 text-sm">
                {getLookingForIcon()}
                <span>{getLookingForLabel()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content sections */}
        <div className="p-6 space-y-6">
          {/* Bio Section */}
          {bio && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
            </div>
          )}

          {/* Professional Info */}
          {(title || company) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Current Position</h3>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  {title && <p className="font-semibold text-gray-900">{title}</p>}
                  {company && <p className="text-sm text-gray-600">{company}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Experience</h3>
              <div className="space-y-4">
                {experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <p className="font-semibold text-gray-900">{exp.title}</p>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    {exp.period && <p className="text-xs text-gray-500 mt-1">{exp.period}</p>}
                    {exp.description && (
                      <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {education && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Education</h3>
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">{education}</p>
                </div>
              </div>
            </div>
          )}

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Interests Section */}
          {interests && interests.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Email Section (Shown at bottom) */}
          {email && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Contact: {email}</p>
            </div>
          )}

          {/* Extra padding at bottom for scroll space above buttons */}
          <div className="h-24"></div>
        </div>
      </div>

      {/* Fixed Action Buttons at Bottom - REMOVED white gradient background */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 px-6">
        <Button
          size="icon"
          variant="outline"
          className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUndo}
          disabled={!canUndo || isAnimating}
        >
          <RotateCcw className="w-5 h-5 text-yellow-500" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition"
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
        >
          <X className="w-7 h-7 text-red-500" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition"
          disabled={isAnimating}
        >
          <Star className="w-5 h-5 text-blue-500" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition"
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
        >
          <Handshake className="w-7 h-7 text-blue-600" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition"
          disabled={isAnimating}
        >
          <Zap className="w-5 h-5 text-purple-500" />
        </Button>
      </div>
    </div>
  );
}