'use client'

import React from 'react'
import { Plus, GitBranch, Github, ExternalLink, Download } from 'lucide-react'
import Link from 'next/link'

const Projects = () => {
  return (
    <div className="p-6 w-full">
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
          <button className="px-4 py-1.5 bg-primary/20 border border-primary/30 text-primary rounded-md">
            Projects
          </button>
          <button className="px-4 py-1.5 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 hover:text-foreground">
            Templates
          </button>
          <button className="px-4 py-1.5 bg-muted text-muted-foreground rounded-md hover:bg-muted/80 hover:text-foreground">
            Archived
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project Card 1 */}
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
          <div className="p-5 border-b border-border bg-muted/50">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-medium text-primary">
                Project Alpha
              </h3>
              <span className="px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded-md border border-green-500/30">
                Active
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Neural interface for direct brain-computer interaction
            </p>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="text-primary">2 hours ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-500">Running</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tickets:</span>
              <span className="text-primary">12 open</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Repo:</span>
              <a href="#" className="text-primary flex items-center">
                <Github className="h-3 w-3 mr-1" />
                View
              </a>
            </div>
          </div>
          <div className="flex border-t border-border">
            <Link href="/development" className="flex-1 text-center py-3 text-sm text-primary hover:bg-primary/10 transition-colors flex items-center justify-center" >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Open
            </Link>
            <Link href="/development" className="flex-1 text-center py-3 text-sm text-secondary hover:bg-secondary/10 transition-colors border-l border-border flex items-center justify-center" >
              <GitBranch className="h-4 w-4 mr-1.5" />
              Develop
            </Link>
          </div>
        </div>
        {/* Project Card 2 */}
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
          <div className="p-5 border-b border-border bg-muted/50">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-medium text-primary">
                Project Beta
              </h3>
              <span className="px-2 py-1 text-xs bg-yellow-500/10 text-yellow-500 rounded-md border border-yellow-500/30">
                In Progress
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Augmented reality overlay system for urban environments
            </p>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="text-primary">Yesterday</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-yellow-500">Building</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tickets:</span>
              <span className="text-primary">8 open</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Repo:</span>
              <a href="#" className="text-primary flex items-center">
                <Github className="h-3 w-3 mr-1" />
                View
              </a>
            </div>
          </div>
          <div className="flex border-t border-border">
            <Link href="/development" className="flex-1 text-center py-3 text-sm text-primary hover:bg-primary/10 transition-colors flex items-center justify-center" >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Open
            </Link>
            <Link href="/development" className="flex-1 text-center py-3 text-sm text-secondary hover:bg-secondary/10 transition-colors border-l border-border flex items-center justify-center" >
              <GitBranch className="h-4 w-4 mr-1.5" />
              Develop
            </Link>
          </div>
        </div>
        {/* Project Card 3 */}
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all">
          <div className="p-5 border-b border-border bg-muted/50">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-medium text-primary">
                Project Gamma
              </h3>
              <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-500 rounded-md border border-blue-500/30">
                New
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Cybernetic implant control software
            </p>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="text-primary">3 days ago</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-blue-500">Setup</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tickets:</span>
              <span className="text-primary">4 open</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Repo:</span>
              <a href="#" className="text-primary flex items-center">
                <Github className="h-3 w-3 mr-1" />
                View
              </a>
            </div>
          </div>
          <div className="flex border-t border-border">
            <Link href="/development" className="flex-1 text-center py-3 text-sm text-primary hover:bg-primary/10 transition-colors flex items-center justify-center" >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Open
            </Link>
            <Link href="/development" className="flex-1 text-center py-3 text-sm text-secondary hover:bg-secondary/10 transition-colors border-l border-border flex items-center justify-center" >
              <GitBranch className="h-4 w-4 mr-1.5" />
              Develop
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Projects