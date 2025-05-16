'use client'

import React from 'react'
import { ArrowLeft, GitBranch, GitCommit, GitPullRequest, Code, Terminal, Play, Download } from 'lucide-react'
import Link from 'next/link'

const Development = () => {
  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/projects" className="text-muted-foreground hover:text-primary mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary tracking-wider">
            DEV<span className="text-secondary">::</span>
            <span className="text-primary/90">PROJECT_ALPHA</span>
          </h1>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-500 rounded hover:bg-green-500/20 transition-all shadow-sm">
            <Play className="h-4 w-4 mr-2" />
            Run Project
          </button>
          <Link href="/local-development" className="flex items-center px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded hover:bg-primary/20 transition-all shadow-sm" >
            <Terminal className="h-4 w-4 mr-2" />
            Local Dev
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Development Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-primary font-medium tracking-wide">
                Repository Status
              </h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">Branch:</span>
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded border border-secondary/30 flex items-center">
                  <GitBranch className="h-3 w-3 mr-1" />
                  feature/neural-interface
                </span>
              </div>
            </div>
            
            <div className="bg-muted border border-border rounded-md p-4 font-mono text-sm text-foreground/80 mb-4">
              <div className="flex items-center text-green-500">
                <GitBranch className="h-4 w-4 mr-2" />
                <span>On branch feature/neural-interface</span>
              </div>
              <div className="mt-2 text-primary">
                Your branch is up to date with &apos;origin/feature/neural-interface&apos;
              </div>
              <div className="mt-2">
                Changes not staged for commit:
              </div>
              <div className="text-destructive ml-4">modified: src/components/NeuralInterface.tsx</div>
              <div className="text-destructive ml-4">modified: src/utils/brainwave-analyzer.ts</div>
              <div className="mt-2">
                Untracked files:
              </div>
              <div className="text-destructive ml-4">src/components/BrainwaveVisualizer.tsx</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-2 bg-muted border border-primary/30 rounded-md hover:bg-muted/80 hover:border-primary/50 transition-all text-primary">
                <GitCommit className="h-4 w-4 mr-2" />
                Commit Changes
              </button>
              <button className="flex items-center justify-center px-4 py-2 bg-muted border border-secondary/30 rounded-md hover:bg-muted/80 hover:border-secondary/50 transition-all text-secondary">
                <GitPullRequest className="h-4 w-4 mr-2" />
                Create Pull Request
              </button>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <h2 className="text-xl text-primary font-medium tracking-wide mb-4">
              Code Editor
            </h2>
            <div className="flex items-center space-x-2 text-sm mb-3">
              <span className="text-muted-foreground">File:</span>
              <span className="text-primary">src/components/NeuralInterface.tsx</span>
            </div>
            <div className="bg-muted border border-border rounded-md p-4 font-mono text-sm text-foreground/80 h-80 overflow-y-auto">
              <pre className="text-gray-400">
{`import React, { useState, useEffect } from 'react';
import { analyzeBrainwaves } from '../utils/brainwave-analyzer';
import { NeuralData, BrainwavePattern } from '../types';

interface NeuralInterfaceProps {
  deviceId: string;
  sensitivity: number;
  onDataReceived?: (data: NeuralData) => void;
}

export const NeuralInterface: React.FC<NeuralInterfaceProps> = ({
  deviceId,
  sensitivity = 0.8,
  onDataReceived
}) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [brainwaveData, setBrainwaveData] = useState<BrainwavePattern[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Connect to neural device
    const connectToDevice = async () => {
      try {
        // TODO: Implement actual device connection
        console.log(\`Connecting to neural device: \${deviceId}\`);
        setConnected(true);
        
        // Simulate receiving data
        const interval = setInterval(() => {
          const newData = {
            timestamp: Date.now(),
            alpha: Math.random() * sensitivity,
            beta: Math.random() * sensitivity,
            theta: Math.random() * sensitivity,
            delta: Math.random() * sensitivity,
            gamma: Math.random() * sensitivity,
          };
          
          const analyzedData = analyzeBrainwaves(newData);
          setBrainwaveData(prev => [...prev, analyzedData].slice(-20));
          
          if (onDataReceived) {
            onDataReceived({
              deviceId,
              patterns: analyzedData,
              rawData: newData
            });
          }
        }, 1000);
        
        return () => clearInterval(interval);
      } catch (err) {
        setError(\`Failed to connect: \${err.message}\`);
        setConnected(false);
      }
    };
    
    connectToDevice();
  }, [deviceId, sensitivity, onDataReceived]);

  return (
    <div className="neural-interface">
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="status-indicator">
            Status: {connected ? 'Connected' : 'Disconnected'}
          </div>
          <div className="brainwave-display">
            {brainwaveData.map((pattern, index) => (
              <div key={index} className="pattern-row">
                <span>Alpha: {pattern.alpha.toFixed(2)}</span>
                <span>Beta: {pattern.beta.toFixed(2)}</span>
                <span>Theta: {pattern.theta.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <h2 className="text-xl text-primary font-medium tracking-wide mb-4">
              Project Files
            </h2>
            <div className="space-y-1 font-mono text-sm">
              <div className="flex items-center text-primary font-medium">
                <span className="mr-2">📁</span>
                src/
              </div>
              <div className="flex items-center text-muted-foreground ml-4">
                <span className="mr-2">📁</span>
                components/
              </div>
              <div className="flex items-center text-primary ml-8 bg-primary/10 px-2 py-0.5 rounded">
                <span className="mr-2">📄</span>
                NeuralInterface.tsx
              </div>
              <div className="flex items-center text-muted-foreground ml-8">
                <span className="mr-2">📄</span>
                BrainwaveVisualizer.tsx
              </div>
              <div className="flex items-center text-muted-foreground ml-8">
                <span className="mr-2">📄</span>
                Dashboard.tsx
              </div>
              <div className="flex items-center text-muted-foreground ml-4">
                <span className="mr-2">📁</span>
                utils/
              </div>
              <div className="flex items-center text-muted-foreground ml-8">
                <span className="mr-2">📄</span>
                brainwave-analyzer.ts
              </div>
              <div className="flex items-center text-muted-foreground ml-4">
                <span className="mr-2">📁</span>
                types/
              </div>
              <div className="flex items-center text-muted-foreground ml-8">
                <span className="mr-2">📄</span>
                index.ts
              </div>
              <div className="flex items-center text-muted-foreground ml-4">
                <span className="mr-2">📄</span>
                App.tsx
              </div>
              <div className="flex items-center text-muted-foreground ml-4">
                <span className="mr-2">📄</span>
                index.tsx
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <h2 className="text-xl text-primary font-medium tracking-wide mb-4">
              Recent Commits
            </h2>
            <div className="space-y-3">
              <div className="border-l-2 border-secondary pl-3">
                <div className="flex items-center text-sm">
                  <GitCommit className="h-3 w-3 mr-2 text-secondary" />
                  <span className="text-secondary">a4f8e2d</span>
                </div>
                <p className="text-primary text-sm">Add neural data types</p>
                <p className="text-xs text-muted-foreground">2 hours ago by Sarah Chen</p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <div className="flex items-center text-sm">
                  <GitCommit className="h-3 w-3 mr-2 text-primary" />
                  <span className="text-primary">b7d9c1e</span>
                </div>
                <p className="text-primary text-sm">Implement brainwave analyzer</p>
                <p className="text-xs text-muted-foreground">Yesterday by Alex Kim</p>
              </div>
              <div className="border-l-2 border-green-500 pl-3">
                <div className="flex items-center text-sm">
                  <GitCommit className="h-3 w-3 mr-2 text-green-500" />
                  <span className="text-green-500">f2e1d9c</span>
                </div>
                <p className="text-primary text-sm">Initial neural interface setup</p>
                <p className="text-xs text-muted-foreground">2 days ago by Jordan Lee</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-5 shadow-md">
            <h2 className="text-xl text-primary font-medium tracking-wide mb-4">
              Actions
            </h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between px-4 py-2 bg-muted border border-border rounded-md hover:bg-muted/80 hover:border-primary/50 transition-all">
                <span className="text-primary">Open in VS Code</span>
                <Code className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-muted border border-border rounded-md hover:bg-muted/80 hover:border-primary/50 transition-all">
                <span className="text-primary">Open Terminal</span>
                <Terminal className="h-4 w-4 text-muted-foreground" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-muted border border-border rounded-md hover:bg-muted/80 hover:border-primary/50 transition-all">
                <span className="text-primary">Download Project</span>
                <Download className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Development