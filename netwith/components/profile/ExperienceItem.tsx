"use client"

import React from 'react';
import { Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
  isEditing: boolean;
  onRemove?: () => void;
}

export function ExperienceItem({
  title,
  company,
  period,
  description,
  isEditing,
  onRemove
}: ExperienceItemProps) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
        <Briefcase size={20} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{company}</p>
        <p className="text-sm text-gray-500 mt-1">{period}</p>
        <p className="text-gray-600 mt-2">{description}</p>
        {isEditing && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 mt-2"
            onClick={onRemove}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}