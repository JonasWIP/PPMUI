'use client'

import React, { useState } from 'react'
import { Code, Globe, Play, Ticket } from 'lucide-react'

type PreviewPanelProps = {
  projectName?: string
  previewUrl?: string
  liveUrl?: string
  codeContent?: string
}

type TabType = 'preview' | 'live' | 'code' | 'tickets'

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  projectName = 'Project',
  previewUrl = 'https://preview.example.com/demo',
  liveUrl = 'https://live.example.com',
  codeContent
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('preview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'preview':
        return (
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-muted border-b border-border flex items-center text-sm">
              <span className="text-muted-foreground">URL:</span>
              <span className="ml-2 text-primary font-mono">{previewUrl}</span>
              <button
                className="ml-4 px-2 py-1 text-xs bg-primary/10 border border-primary/30 text-primary rounded hover:bg-primary/20 transition-all"
                onClick={() => {
                  const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement | null;
                  if (iframe) iframe.src = iframe.src;
                }}
                title="Reload Preview"
              >
                Reload
              </button>
            </div>
            <div className="flex-1 bg-white">
              {previewUrl ? (
                <iframe 
                  id="preview-iframe"
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No preview URL configured
                </div>
              )}
            </div>
          </div>
        )
      
      case 'live':
        return (
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-muted border-b border-border flex items-center text-sm">
              <span className="text-muted-foreground">URL:</span>
              <span className="ml-2 text-primary font-mono">{liveUrl}</span>
            </div>
            <div className="flex-1 bg-white">
              {liveUrl ? (
                <iframe 
                  src={liveUrl}
                  className="w-full h-full border-0"
                  title="Live Version"
                  sandbox="allow-same-origin allow-scripts"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No live URL configured
                </div>
              )}
            </div>
          </div>
        )
      
      case 'code':
        return (
          <div className="h-full flex flex-col">
            <div className="px-4 py-2 bg-muted border-b border-border flex items-center text-sm">
              <span className="text-muted-foreground">File:</span>
              <span className="ml-2 text-primary font-mono">src/App.js</span>
            </div>
            <div className="flex-1 bg-muted p-4 font-mono text-sm text-foreground/80 overflow-y-auto">
              <pre className="text-gray-400">
{codeContent || `import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProjectView from './components/ProjectView';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check authentication status on load
    checkAuthStatus();
  }, []);
  
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      
      if (data.authenticated) {
        setIsLoggedIn(true);
        setUser(data.user);
      }
    } catch (err) {
      console.error('Authentication check failed:', err);
    }
  };
  
  return (
    <BrowserRouter>
      <div className="app">
        <Header isLoggedIn={isLoggedIn} user={user} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectView />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;`}
              </pre>
            </div>
          </div>
        )
      
      case 'tickets':
        return (
          <div className="h-full p-4 overflow-y-auto">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-primary">Project Tickets</h3>
              <button className="px-3 py-1 text-sm bg-primary/10 border border-primary/30 text-primary rounded hover:bg-primary/20 transition-all">
                + New Ticket
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'TICK-001', title: 'Fix navigation responsiveness', priority: 'high', status: 'open' },
                { id: 'TICK-002', title: 'Update user authentication flow', priority: 'medium', status: 'in-progress' },
                { id: 'TICK-003', title: 'Implement dark mode toggle', priority: 'low', status: 'open' },
                { id: 'TICK-004', title: 'Optimize image loading', priority: 'medium', status: 'closed' }
              ].map(ticket => (
                <div key={ticket.id} className="bg-muted border border-border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono bg-secondary/10 text-secondary px-2 py-0.5 rounded-sm">
                          {ticket.id}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-sm ${
                          ticket.priority === 'high' 
                            ? 'bg-destructive/10 text-destructive' 
                            : ticket.priority === 'medium'
                              ? 'bg-orange-500/10 text-orange-500'
                              : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-sm ${
                          ticket.status === 'open' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : ticket.status === 'in-progress'
                              ? 'bg-orange-500/10 text-orange-500'
                              : 'bg-green-500/10 text-green-500'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-foreground mt-1">
                        {ticket.title}
                      </h4>
                    </div>
                    <button className="text-primary text-xs hover:text-primary/80">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-muted px-2 pt-2 border-b border-border">
        <div className="flex justify-between items-center px-2 mb-2">
          <h2 className="text-sm font-medium text-primary tracking-wide">
            {projectName} <span className="text-secondary">::</span> ENVIRONMENT
          </h2>
        </div>
        <div className="flex">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 flex items-center rounded-t-md text-sm font-medium mr-1 ${
              activeTab === 'preview'
                ? 'bg-card text-primary border-t border-l border-r border-border'
                : 'text-muted-foreground hover:text-primary hover:bg-muted/80'
            }`}
          >
            <Play className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 flex items-center rounded-t-md text-sm font-medium mr-1 ${
              activeTab === 'live'
                ? 'bg-card text-primary border-t border-l border-r border-border'
                : 'text-muted-foreground hover:text-primary hover:bg-muted/80'
            }`}
          >
            <Globe className="h-4 w-4 mr-2" />
            Live Version
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 flex items-center rounded-t-md text-sm font-medium mr-1 ${
              activeTab === 'code'
                ? 'bg-card text-primary border-t border-l border-r border-border'
                : 'text-muted-foreground hover:text-primary hover:bg-muted/80'
            }`}
          >
            <Code className="h-4 w-4 mr-2" />
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 flex items-center rounded-t-md text-sm font-medium ${
              activeTab === 'tickets'
                ? 'bg-card text-primary border-t border-l border-r border-border'
                : 'text-muted-foreground hover:text-primary hover:bg-muted/80'
            }`}
          >
            <Ticket className="h-4 w-4 mr-2" />
            Tickets
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default PreviewPanel