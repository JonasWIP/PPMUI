'use client'

import React, { useState, useEffect } from 'react'
import { Plus, GitBranch, Github, ExternalLink, Download, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ProjectsService, OpenAPI } from '@/lib/generated/api'
import { apiClient } from '@/lib/apiClient'

// Define custom interface for API response to handle mismatch
interface ProjectsResponse {
  status?: string;
  message?: string;
  projects?: string[]; // Keep for backward compatibility
  directories?: string[]; // Current API response format
}

// Define project type based on API response
type Project = {
  name: string;
  description?: string;
  status?: string;
  lastUpdated?: string;
  isTemplate?: boolean;
  isArchived?: boolean;
  repoUrl?: string;
  ticketsCount?: number;
  previewUrl?: string;
  liveUrl?: string;
  config?: Record<string, unknown>;
};

type TabType = 'projects' | 'templates' | 'archived';

const Projects = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('projects');

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Initialize API client
        await apiClient.initialize(false);
        
        // Set API base to use our proxy
        OpenAPI.BASE = '/api/proxy';
        
        // Get list of project names
        const projectsResponse = await ProjectsService.getProjects();
        
        // Handle API response format (directories is the current format)
        const projectNames = (projectsResponse as ProjectsResponse).directories ||
                            (projectsResponse as ProjectsResponse).projects || [];
        
        // Fetch details for each project
        const projectsWithDetails = await Promise.all(
          projectNames.map(async (projectName: string) => {
            try {
              const configResponse = await ProjectsService.getProjectsConfig({ projectName });
              const config = configResponse.config || {};
              
              return {
                name: projectName,
                description: `Project: ${projectName}`,
                status: "Inactive", // Default status
                lastUpdated: new Date().toISOString(),
                isTemplate: config.isTemplate || false,
                isArchived: false, // Default value
                repoUrl: config.repoUrl,
                ticketsCount: 0, // Default value
                previewUrl: config.previewUrl,
                liveUrl: config.liveUrl,
                config: config
              };
            } catch (err) {
              console.error(`Error fetching config for project ${projectName}:`, err);
              return {
                name: projectName,
                description: `Project: ${projectName}`,
                status: "Error",
                lastUpdated: new Date().toISOString(),
                isTemplate: false,
                isArchived: false,
                ticketsCount: 0
              };
            }
          })
        );
        
        setProjects(projectsWithDetails);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Pass project configuration to development page
  const startProject = (projectName: string) => {
    console.log('Starting project development:', projectName);
    router.push(`/development?project=${projectName}`);
  };

  // Filter projects based on active tab
  const filteredProjects = projects.filter(project => {
    if (activeTab === 'templates') return project.isTemplate === true;
    if (activeTab === 'archived') return project.isArchived === true;
    // Default tab (projects) - show non-template, non-archived projects
    return !project.isTemplate && !project.isArchived;
  });
  
  console.log('Active Tab:', activeTab);
  console.log('Projects State:', projects);
  console.log('Filtered Projects:', filteredProjects);

  // Helper function to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Add debug log before rendering
  console.log('Debug - Projects:', {
    projectsLength: projects.length,
    filteredProjectsLength: filteredProjects.length,
    activeTab,
    isLoading: loading,
    hasError: !!error
  });

  return (
    <div className="p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-wider">
          PROJECTS<span className="text-secondary">::</span>
          <span className="text-primary/90">LIST</span>
        </h1>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-secondary/20 border border-secondary/30 text-secondary rounded hover:bg-secondary/30 transition-all shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Import Project
          </button>
          <Link href="/create-project" className="flex items-center px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary/30 transition-all shadow-sm" >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </div>
      </div>
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm mb-4">
          <button
            className={`px-4 py-1.5 rounded-md ${activeTab === 'projects' ? 'bg-primary/20 border border-primary/30 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button
            className={`px-4 py-1.5 rounded-md ${activeTab === 'templates' ? 'bg-primary/20 border border-primary/30 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </button>
          <button
            className={`px-4 py-1.5 rounded-md ${activeTab === 'archived' ? 'bg-primary/20 border border-primary/30 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}
            onClick={() => setActiveTab('archived')}
          >
            Archived
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-2 text-primary">Loading projects...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-md">
          {error}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No {activeTab} found.
          {activeTab === 'projects' && (
            <Link href="/create-project" className="text-primary ml-1 hover:underline">
              Create a new project?
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.name} className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
              <div className="p-5 border-b border-border bg-muted/50">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-medium text-primary">
                    {project.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-md border ${
                    project.status === 'Running' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                    project.status === 'Building' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                    'bg-blue-500/10 text-blue-500 border-blue-500/30'
                  }`}>
                    {project.status || 'New'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {project.description || 'No description available'}
                </p>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="text-primary">{formatDate(project.lastUpdated)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Template:</span>
                  <span className="text-primary">{project.isTemplate ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Live URL:</span>
                  {project.liveUrl ? (
                    <a href={project.liveUrl} className="text-primary flex items-center" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Visit
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not available</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={
                    project.liveUrl ? 'text-green-500' : 'text-yellow-500'
                  }>
                    {project.liveUrl ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="flex border-t border-border">
                <button
                  onClick={() => {
                    if (project.repoUrl) {
                      navigator.clipboard.writeText(project.repoUrl);
                      // Could add a toast notification here
                      alert('Git URL copied to clipboard!');
                    }
                  }}
                  className="flex-1 text-center py-3 text-sm text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
                  disabled={!project.repoUrl}
                >
                  <Github className="h-4 w-4 mr-1.5" />
                  Copy Git URL
                </button>                <button
                  onClick={() => startProject(project.name)}
                  className="flex-1 text-center py-3 text-sm text-primary hover:bg-primary/10 transition-colors border-l border-border flex items-center justify-center"
                >
                  <GitBranch className="h-4 w-4 mr-1.5" />
                  Develop
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects