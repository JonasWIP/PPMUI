'use client'

import React, { useState, useEffect, Suspense, useCallback } from 'react'
import { ArrowLeft, Terminal, Play, Loader2, Server, Activity } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ChatInterface from './ChatInterface'
import PreviewPanel from './PreviewPanel'
import { ProjectsService } from '@/lib/generated/api'

// Define types for statusData and process
interface ProcessDetail {
  pid?: number;
  command?: string;
}
interface StatusData {
  isRunning: boolean;
  processes?: {
    count?: number;
    details?: ProcessDetail[];
  };
}

// Component to handle search params
const DevelopmentContent = () => {
  const searchParams = useSearchParams()
  const projectParam = searchParams.get('project')
  
  const [projectName] = useState(projectParam || '')
  const [previewUrl, setPreviewUrl] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [statusData, setStatusData] = useState<StatusData | null>(null)

  // Fetch project status
  const fetchProjectStatus = useCallback(async () => {
    if (!projectName) return;
    
    try {
      const response = await ProjectsService.getProjectsStatus({ projectName });
      
      if (response) {
        setStatusData({
          isRunning: response.isRunning || false,
          processes: response.processes
        });
      }
    } catch (err) {
      console.error('Error fetching project status:', err);
      setError('Failed to fetch project status');
    }
  }, [projectName]);

  // Handler for toggling local development server
  const handleLocalDevToggle = async () => {
    if (!projectName) return;
    
    try {
      setIsActionLoading(true);
      
      if (statusData?.isRunning) {
        // Stop the local development server
        await ProjectsService.postProjectsStop({ projectName });
      } else {
        // Start the local development server
        await ProjectsService.postProjectsStart({ projectName });
      }
      
      // Fetch updated status after action
      await fetchProjectStatus();
    } catch (err) {
      console.error('Error toggling local development server:', err);
      setError(`Failed to ${statusData?.isRunning ? 'stop' : 'start'} local development server`);
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    const fetchProjectConfig = async () => {
      if (!projectName) return
      
      try {
        setLoading(true)
        const response = await ProjectsService.getProjectsConfig({ projectName })
        
        if (response.config) {
          setPreviewUrl(response.config.previewUrl || '')
          setLiveUrl(response.config.liveUrl || '')
        }
        
        // Fetch project status after config is loaded
        await fetchProjectStatus()
        
        setLoading(false)
      } catch (err) {
        console.error('Error fetching project config:', err)
        setError('Failed to load project configuration')
        setLoading(false)
      }
    }
    
    fetchProjectConfig()
    
    // Set up polling for status updates
    const statusInterval = setInterval(() => {
      fetchProjectStatus()
    }, 10000) // Poll every 10 seconds
    
    return () => clearInterval(statusInterval)
  }, [projectName, fetchProjectStatus])

  return (
    <div className="p-6 w-full h-[calc(100vh-64px)] flex flex-col">
      {/* Loading state */}
      {loading && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 text-blue-500 rounded-md">
          Loading project configuration...
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-md">
          <strong>Error:</strong> {error}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/projects" className="text-muted-foreground hover:text-primary mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold text-primary tracking-wider">
            DEV<span className="text-secondary">::</span>
            <span className="text-primary/90">{projectName}</span>
          </h1>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-500/50 rounded cursor-not-allowed opacity-70 shadow-sm" disabled>
            <Play className="h-4 w-4 mr-2" />
            Deploy
          </button>
          <button
            onClick={handleLocalDevToggle}
            disabled={isActionLoading || !projectName}
            className={`flex items-center px-4 py-2 ${
              statusData?.isRunning
                ? 'bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20'
                : 'bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20'
            } rounded shadow-sm transition-colors ${(isActionLoading || !projectName) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isActionLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Terminal className="h-4 w-4 mr-2" />
            )}
            {statusData?.isRunning ? 'Stop Local Dev' : 'Start Local Dev'}
          </button>
          {/* Expandable Status Button */}
          <StatusPanelButton statusData={statusData} />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Chat Interface */}
        <div className="lg:w-1/3 h-full">
          <ChatInterface projectName={projectName} />
        </div>
        
        {/* Preview Panel */}
        <div className="lg:w-2/3 h-full">
          <PreviewPanel 
            projectName={projectName}
            previewUrl={previewUrl}
            liveUrl={liveUrl}
            codeContent={`import React, { useState, useEffect } from 'react';
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
          />
        </div>
      </div>
    </div>
  )
}

const StatusPanelButton = ({ statusData }: { statusData: StatusData | null }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative">
      <button
        className={`flex items-center px-2 py-2 border rounded-full transition-colors ${statusData?.isRunning ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}
        title="Show Project Status"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <Server className="h-5 w-5" />
      </button>
      {expanded && statusData && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-border rounded-lg shadow-lg z-10 p-4 text-sm">
          <div className="flex items-center mb-2">
            <Server className="h-5 w-5 mr-2" />
            <span className="font-semibold">Project Status:</span>
            <span className={`ml-2 px-2 py-0.5 rounded text-xs ${statusData.isRunning ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{statusData.isRunning ? 'RUNNING' : 'STOPPED'}</span>
          </div>
          {statusData.isRunning && statusData.processes && (
            <div className="mt-2">
              <div className="flex items-center mb-1">
                <Activity className="h-4 w-4 mr-2" />
                <span className="text-sm">Running Processes: {statusData.processes.count}</span>
              </div>
              {statusData.processes.details && statusData.processes.details.map((process: ProcessDetail, index: number) => (
                <div key={index} className="ml-6 text-xs text-blue-400 font-mono">
                  PID: {process.pid} - Command: {process.command}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Development = () => {
  return (
    <Suspense fallback={<div className="p-6">Loading development environment...</div>}>
      <DevelopmentContent />
    </Suspense>
  )
}

export default Development