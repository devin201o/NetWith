"use client"

import React, { useState } from 'react';
import { Handshake, X, Star, RotateCcw, Zap, User, Briefcase, GraduationCap, MapPin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  name?: string;
  age?: number;
  bio?: string;
  isActive?: boolean;
  totalImages?: number;
  title?: string;
  company?: string;
  location?: string;
  education?: string;
  skills?: string[];
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function ProfileCard({ 
  name = "Name", 
  age = 0, 
  bio = "Bio goes here...",
  isActive = true,
  totalImages = 5,
  title = "Software Engineer",
  company = "Tech Company",
  location = "San Francisco, CA",
  education = "BS Computer Science",
  skills = ["JavaScript", "React", "Node.js"],
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

      {/* Fixed Header with Image */}
      <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0">
        {/* Image Carousel Indicators */}
        <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
          {Array.from({ length: totalImages }).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full transition ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Placeholder Image Content */}
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <User className="w-20 h-20 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Profile Image</p>
          </div>
        </div>

        {/* Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-2xl font-bold">{name}, {age}</h2>
            {isActive && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Bio Section */}
          <div>
            <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
          </div>

          {/* Professional Info */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-600">{company}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">Education</p>
                <p className="text-sm text-gray-600">{education}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-gray-600">{location}</p>
            </div>
          </div>

          {/* Skills Section */}
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

          {/* About Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Passionate professional looking to connect with like-minded individuals. 
              Open to networking opportunities and collaborations.
            </p>
          </div>

          {/* Interests Section */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {["Technology", "Innovation", "Startups", "Coffee"].map((interest, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Extra padding at bottom for scroll space */}
          <div className="h-20"></div>
        </div>
      </div>

      {/* Fixed Action Buttons at Bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 px-6 bg-gradient-to-t from-white via-white to-transparent pt-4">
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