"use client"

import React, { useState } from 'react';
import { Handshake, X, Star, RotateCcw, Zap, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  name?: string;
  age?: number;
  bio?: string;
  isActive?: boolean;
  totalImages?: number;
}

export function ProfileCard({ 
  name = "Name", 
  age = 0, 
  bio = "Bio goes here...",
  isActive = true,
  totalImages = 5 
}: ProfileCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="relative w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Image Area with Placeholder */}
      <div className="relative h-full bg-gradient-to-br from-gray-200 to-gray-300">
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
            <User className="w-24 h-24 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Profile Image</p>
          </div>
        </div>

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 pb-24">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-white text-3xl font-bold">{name}, {age}</h2>
            {isActive && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
          </div>
          <p className="text-white/90 text-sm mb-1">Recently Active</p>
          <p className="text-white/80 text-sm">{bio}</p>
        </div>

        {/* Action Buttons - Using shadcn Button */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 px-6">
          <Button size="icon" variant="outline" className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition">
            <RotateCcw className="w-6 h-6 text-yellow-500" />
          </Button>
          <Button size="icon" variant="outline" className="w-16 h-16 rounded-full shadow-lg hover:scale-110 transition">
            <X className="w-8 h-8 text-red-500" />
          </Button>
          <Button size="icon" variant="outline" className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition">
            <Star className="w-6 h-6 text-blue-500" />
          </Button>
          <Button size="icon" variant="outline" className="w-16 h-16 rounded-full shadow-lg hover:scale-110 transition">
            <Handshake className="w-8 h-8 text-blue-600" />
          </Button>
          <Button size="icon" variant="outline" className="w-14 h-14 rounded-full shadow-lg hover:scale-110 transition">
            <Zap className="w-6 h-6 text-purple-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}