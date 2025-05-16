'use client'

import React from 'react'
import { ArrowLeft, Terminal, Play, Square, RefreshCw, Code, Database, Server } from 'lucide-react'
import Link from 'next/link'

const LocalDevelopment = () => {
  return (
    <div className="p-6 w-full">
      <div className="flex items-center mb-8">
        <Link href="/projects" className="text-muted-foreground hover:text-primary mr-3">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-primary tracking-wider">
          LOCAL<span className="text-secondary">::</span>
          <span className="text-primary/90">DEVELOPMENT</span>
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl text-primary font-medium tracking-wide">
                  Project Alpha
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Neural interface for direct brain-computer interaction
                </p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded-md border border-green-500/30">
                Running
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-muted border border-border rounded-md p-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    <Code className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Frontend</p>
                    <p className="text-sm font-medium text-primary">React + TypeScript</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted border border-border rounded-md p-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mr-3">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Backend</p>
                    <p className="text-sm font-medium text-primary">Node.js + Express</p>
                  </div>
                </div>
              </div>
              <div className="bg-muted border border-border rounded-md p-3">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mr-3">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Database</p>
                    <p className="text-sm font-medium text-primary">PostgreSQL</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-500 rounded hover:bg-green-500/20 transition-all shadow-sm">
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Start
              </button>
              <button className="flex items-center px-3 py-1.5 bg-destructive/10 border border-destructive/30 text-destructive rounded hover:bg-destructive/20 transition-all shadow-sm">
                <Square className="h-3.5 w-3.5 mr-1.5" />
                Stop
              </button>
              <button className="flex items-center px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-500 rounded hover:bg-blue-500/20 transition-all shadow-sm">
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Restart
              </button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <h2 className="text-xl text-primary font-medium tracking-wide mb-4">
              Terminal Output
            </h2>
            <div className="bg-muted border border-border rounded-md p-4 font-mono text-sm text-foreground/80 h-80 overflow-y-auto">
              <div className="text-green-500">$ npm start</div>
              <div className="text-muted-foreground mt-1">{'>'} project-alpha@1.0.0 start</div>
              <div className="text-muted-foreground">{'>'} node server.js</div>
              <div className="mt-2">Server running on port 3000</div>
              <div className="text-primary">Connected to database</div>
              <div className="text-yellow-500">Initializing neural interface modules...</div>
              <div className="text-green-500">All systems operational</div>
              <div className="mt-2">Listening for incoming connections</div>
              <div className="text-primary">Client connected: 192.168.1.45</div>
              <div className="text-muted-foreground">Processing request...</div>
              <div className="text-green-500">Request processed successfully</div>
              <div className="text-primary">Client connected: 192.168.1.32</div>
              <div className="text-muted-foreground">Processing request...</div>
              <div className="text-green-500">Request processed successfully</div>
              <div className="text-yellow-500">Warning: High memory usage detected</div>
              <div className="text-muted-foreground">Optimizing memory allocation...</div>
              <div className="text-green-500">Memory optimization complete</div>
            </div>
          </div>
        </div>
        
        {/* Controls and Stats */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <h2 className="text-xl text-primary font-medium tracking-wide mb-4">
              Environment
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Node.js</span>
                <span className="text-sm text-primary">v18.12.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">npm</span>
                <span className="text-sm text-primary">v9.2.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">TypeScript</span>
                <span className="text-sm text-primary">v4.9.4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">React</span>
                <span className="text-sm text-primary">v18.2.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">PostgreSQL</span>
                <span className="text-sm text-primary">v14.5</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <h2 className="text-xl text-primary font-medium tracking-wide mb-4">
              Resource Usage
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">CPU</span>
                  <span className="text-primary">42%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: '42%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="text-primary">1.2 GB / 4 GB</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: '30%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Disk</span>
                  <span className="text-primary">12.4 GB / 100 GB</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: '12.4%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-primary">3.2 MB/s</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: '64%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <h2 className="text-xl text-primary font-medium tracking-wide mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between px-4 py-2 bg-muted border border-border rounded-md hover:bg-muted/80 hover:border-primary/50 transition-all">
                <span className="text-primary">Open in Browser</span>
                <span className="text-xs text-muted-foreground">localhost:3000</span>
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-muted border border-border rounded-md hover:bg-muted/80 hover:border-primary/50 transition-all">
                <span className="text-primary">Open in VS Code</span>
                <Code className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-muted border border-border rounded-md hover:bg-muted/80 hover:border-primary/50 transition-all">
                <span className="text-primary">Open Terminal</span>
                <Terminal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocalDevelopment