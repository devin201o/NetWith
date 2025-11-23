"use client"

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  skills_used?: string[];
  status: 'in-progress' | 'completed';
  user_name?: string;
  onClick?: (id: string) => void;
}

export function ProjectCard({
  id,
  title,
  description,
  images,
  skills_used,
  status,
  user_name,
  onClick
}: ProjectCardProps) {
  const firstImage = images && images.length > 0 ? images[0] : null;

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-gray-200 p-0"
      onClick={() => onClick?.(id)}
    >
      {/* Project Image - Absolutely NO space at top */}
      {firstImage && (
        <div className="w-full h-40 overflow-hidden">
          <img 
            src={firstImage} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="pb-3 pt-4 px-6">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg" style={{ color: '#252456' }}>{title}</CardTitle>
          <Badge 
            variant={status === 'completed' ? 'default' : 'secondary'}
            className="text-xs whitespace-nowrap"
            style={
              status === 'completed' 
                ? { backgroundColor: '#22c55e', color: '#feffff' }
                : { backgroundColor: '#fd9e25', color: '#feffff' }
            }
          >
            {status === 'completed' ? 'Completed' : 'In Progress'}
          </Badge>
        </div>
        {user_name && (
          <CardDescription className="text-xs">By {user_name}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-0 px-6 pb-6">
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}

        {/* Skills */}
        {skills_used && skills_used.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills_used.slice(0, 5).map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs"
                style={{
                  borderColor: '#252456',
                  color: '#252456'
                }}
              >
                {skill}
              </Badge>
            ))}
            {skills_used.length > 5 && (
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{
                  backgroundColor: '#6f4538',
                  color: '#feffff',
                  borderColor: '#6f4538'
                }}
              >
                +{skills_used.length - 5}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}