"use client"

import React, { useEffect, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  images?: string[];
  skills_used?: string[];
  status: 'in-progress' | 'completed';
  created_at: string;
  users?: {
    name: string;
  };
}

export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            users (
              name
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading projects:', error);
          return;
        }

        setProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const handleProjectClick = (id: string) => {
    console.log('Project clicked:', id);
    // TODO: Navigate to project detail page or open modal
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 
          className="text-2xl font-bold mb-6"
          style={{ color: '#252456' }}
        >
          Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="w-full h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6">
        <h2 
          className="text-2xl font-bold mb-6"
          style={{ color: '#252456' }}
        >
          Projects
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-500 mb-2">No projects yet</p>
          <p className="text-sm text-gray-400">Start creating projects to showcase your work!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 
        className="text-2xl font-bold mb-6"
        style={{ color: '#252456' }}
      >
        Projects ({projects.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            images={project.images}
            skills_used={project.skills_used}
            status={project.status}
            user_name={project.users?.name}
            onClick={handleProjectClick}
          />
        ))}
      </div>
    </div>
  );
}