"use client"

import React from 'react';
import { Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ProfileSectionProps {
  title: string;
  isEditing: boolean;
  onEdit?: () => void;
  onAdd?: () => void;
  children: React.ReactNode;
}

export function ProfileSection({
  title,
  isEditing,
  onEdit,
  onAdd,
  children
}: ProfileSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>
          <div className="flex gap-2">
            {isEditing && onAdd && (
              <Button variant="ghost" size="sm" onClick={onAdd} className="flex items-center gap-1">
                <Plus size={16} />
                Add
              </Button>
            )}
            {isEditing && onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit2 size={16} />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}