'use client'

import React, { useState } from 'react'
import { Plus, GitBranch, Github, ExternalLink, Download, Loader2 } from 'lucide-react'
import Link from 'next/link'
// projectsApi is no longer used as we're using placeholder data
import { useRouter } from 'next/navigation'

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
};

type TabType = 'projects' | 'templates' | 'archived';

const Projects = () => {
  const router = useRouter();
  // Use placeholder data instead of API calls
  const [projects] = useState<Project[]>([
    {
      name: "example-project-1",
      description: "Example project with placeholder data",
      status: "Inactive",
      lastUpdated: new Date().toISOString(),
      isTemplate: false,
      isArchived: false,
      repoUrl: "https://github.com/example/repo1.git",
      ticketsCount: 0
    },
    {
      name: "example-project-2",
      description: "Another example project with placeholder data",
      status: "Inactive",
      lastUpdated: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      isTemplate: false,
      isArchived: false,
      repoUrl: "https://github.com/example/repo2.git",
      ticketsCount: 0
    },
    {
      name: "template-example",
      description: "Example template project",
      status: "Inactive",
      lastUpdated: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      isTemplate: true,
      isArchived: false,
      repoUrl: "https://github.com/example/template.git",
      ticketsCount: 0
    },
    {
      name: "archived-example",
      description: "Example archived project",
      status: "Inactive",
      lastUpdated: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
      isTemplate: false,
      isArchived: true,
      repoUrl: "https://github.com/example/archived.git",
      ticketsCount: 0
    }
  ]);
  const [loading] = useState<boolean>(false); // Set to false since we're using placeholder data
  const [error] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('projects');

  // No useEffect needed as we're using placeholder data

  // Mock implementation that just navigates without API call
  const startProject = (projectName: string) => {
    console.log('Project functionality has been deprecated:', projectName);
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
      {/* Notice about deprecated functionality */}
      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-md">
        <strong>Notice:</strong> Project management functionality has been deprecated. The interface below shows placeholder data.
      </div>
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
                  <span className="text-muted-foreground">Status:</span>
                  <span className={
                    project.status === 'Running' ? 'text-green-500' :
                    project.status === 'Building' ? 'text-yellow-500' :
                    'text-blue-500'
                  }>
                    {project.status || 'Setup'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tickets:</span>
                  <span className="text-primary">{project.ticketsCount || 0} open</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Repo:</span>
                  {project.repoUrl ? (
                    <a href={project.repoUrl} className="text-primary flex items-center" target="_blank" rel="noopener noreferrer">
                      <Github className="h-3 w-3 mr-1" />
                      View
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not available</span>
                  )}
                </div>
              </div>
              <div className="flex border-t border-border">
                <Link
                  href={`/open-project?project=${project.name}`}
                  className="flex-1 text-center py-3 text-sm text-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  Open
                </Link>
                <button
                  onClick={() => startProject(project.name)}
                  className="flex-1 text-center py-3 text-sm text-secondary hover:bg-secondary/10 transition-colors border-l border-border flex items-center justify-center"
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