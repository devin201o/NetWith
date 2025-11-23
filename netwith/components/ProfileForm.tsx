// components/ProfileForm.tsx
"use client"

import React, { useState } from 'react';
import { DatabaseUser, ExperienceItem } from '@/lib/types';
// NOTE: Assuming you have shadcn/ui components: Button, Input, Textarea
// Ensure these components are available in your project!
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase'; // Client-side Supabase instance
import { Plus, Trash2, Save, Check } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: Partial<DatabaseUser>;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  // Initialize form data with server-fetched, parsed data
  const [formData, setFormData] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // State for adding new skills
  const [currentSkill, setCurrentSkill] = useState('');
  
  const userId = initialProfile.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSkill = () => {
    // Only add if skill is non-empty and not already present
    // Type assertion is used here because skills is array after parsing
    if (currentSkill && !formData.skills?.includes(currentSkill)) {
      setFormData(prev => ({ 
        ...prev, 
        skills: [...(prev.skills as string[] || []), currentSkill] 
      }));
      setCurrentSkill('');
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      skills: (prev.skills as string[]).filter(s => s !== skillToRemove) 
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setLoading(true);
    setStatus('idle');

    // Supabase requires arrays to be stored as JSON strings in the 'users' table.
    // We must convert the arrays back into JSON strings before updating the DB.
    const updatePayload = {
      name: formData.name,
      bio: formData.bio,
      education: formData.education,
      // Stringify arrays before sending to database
      skills: JSON.stringify(formData.skills || []),
      interests: JSON.stringify(formData.interests || []),
      experience: JSON.stringify(formData.experience || []),
      looking_for: formData.looking_for,
      // Add other editable fields here
    };

    // 1. Update the 'users' table
    // NOTE: This relies on Row Level Security (RLS) being enabled in Supabase 
    // to ensure users can only update their own row using their Auth UID.
    const { error } = await supabase
      .from('users') // Target the user profile table
      .update(updatePayload)
      .eq('id', userId); // Securely update only the current user's row

    setLoading(false);

    if (error) {
      console.error('Profile update failed:', error);
      setStatus('error');
    } else {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000); // Clear success message after 3 seconds
    }
  };
  
  return (
    <form onSubmit={handleUpdate} className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Personal Details</h2>
        {status === 'success' && (
          <div className="flex items-center text-green-600 font-medium">
            <Check className="w-5 h-5 mr-1" /> Profile saved!
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600 font-medium">
            Save failed. Check console.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md"
          />
        </div>
        
        {/* Email Display (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
          <Input
            value={formData.email || ''}
            disabled
            className="w-full bg-gray-50 border-gray-300 rounded-md"
          />
        </div>

        {/* Education Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
          <Input
            name="education"
            value={formData.education || ''}
            onChange={handleChange}
            placeholder="e.g., BS Computer Science, UBC"
            className="w-full border-gray-300 rounded-md"
          />
        </div>
        
        {/* Looking For Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Looking For</label>
          <Input
            name="looking_for"
            value={formData.looking_for || ''}
            onChange={handleChange}
            placeholder="mentor, partner, network"
            className="w-full border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      {/* Bio Textarea */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <Textarea
          name="bio"
          value={formData.bio || ''}
          onChange={handleChange}
          rows={4}
          placeholder="Tell people about your professional background and goals."
          className="w-full border-gray-300 rounded-md"
        />
      </div>

      {/* Skills Manager */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Skills ({formData.skills?.length || 0})</label>
        <div className="flex gap-2">
          <Input
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            placeholder="Add a skill (e.g., React, SQL)"
            className="flex-1 border-gray-300 rounded-md"
          />
          <Button
            type="button"
            onClick={handleAddSkill}
            disabled={!currentSkill || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2 min-h-[40px] border p-2 rounded-md bg-gray-50">
          {formData.skills?.map((skill, index) => (
            <div 
              key={index} 
              className="flex items-center bg-[#252456] text-white text-xs font-medium px-3 py-1 rounded-full space-x-1"
            >
              <span>{skill}</span>
              <button 
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-white/80 hover:text-white"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {formData.skills?.length === 0 && (
             <p className="text-gray-500 text-sm italic">Add some skills above.</p>
          )}
        </div>
      </div>
      
      {/* Save Button */}
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full py-2 flex items-center justify-center bg-[#fd9e25] hover:bg-[#d4851e] text-white"
      >
        {loading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            Save Profile
          </>
        )}
      </Button>
    </form>
  );
}