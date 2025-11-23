"use client"

import React from 'react';
import { GraduationCap } from 'lucide-react';

interface EducationItemProps {
  school: string;
  degree: string;
  period: string;
}

export function EducationItem({ school, degree, period }: EducationItemProps) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
        <GraduationCap size={20} className="text-gray-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{school}</h3>
        <p className="text-gray-600">{degree}</p>
        <p className="text-sm text-gray-500 mt-1">{period}</p>
      </div>
    </div>
  );
}