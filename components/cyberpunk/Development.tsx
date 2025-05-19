'use client'

import React, { useState, useEffect, Suspense, useCallback, useRef } from 'react'
import { ArrowLeft, Terminal, Play, Loader2, Server, Activity, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import ChatInterface from './ChatInterface'
import PreviewPanel from './PreviewPanel'
import { ProjectsService } from '@/lib/generated/api'

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
  const [statusData, setStatusData] = useState<{
    isRunning: boolean;
    processes?: {
      count?: number;
      details?: Array<{
        pid?: number;
        command?: string;
      }>;
    };
  } | null>(null)
  
  // Refresh mechanism state
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshAttempts, setRefreshAttempts] = useState(0)
  const [refreshSuccess, setRefreshSuccess] = useState(false)
  const [refreshError, setRefreshError] = useState<string | null>(null)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const maxRefreshAttempts = 30 // 30 attempts with 1-second intervals = 30 seconds timeout

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
        // Reset refresh state when stopping the server
        stopRefreshCycle();
      } else {
        // Start the local development server
        await ProjectsService.postProjectsStart({ projectName });
        // Start refresh cycle after server is started
        startRefreshCycle();
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
  
  // Function to handle preview load success
  const handlePreviewLoadSuccess = () => {
    if (isRefreshing) {
      setRefreshSuccess(true);
      setIsRefreshing(false);
      stopRefreshCycle();
    }
  };
  
  // Function to start the refresh cycle
  const startRefreshCycle = () => {
    // Reset refresh state
    setIsRefreshing(true);
    setRefreshAttempts(0);
    setRefreshSuccess(false);
    setRefreshError(null);
    
    // Clear any existing timer
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    
    // Refresh the iframe content immediately
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.location.reload();
    }
    
    // Start the refresh interval
    refreshTimerRef.current = setInterval(() => {
      setRefreshAttempts(prev => {
        const newCount = prev + 1;
        
        // Check if we've reached the maximum attempts (30 second timeout)
        if (newCount >= maxRefreshAttempts) {
          setRefreshError('Preview refresh timed out after 30 seconds');
          stopRefreshCycle();
        }
        
        return newCount;
      });
    }, 1000); // Check every second
  };
  
  // Function to stop the refresh cycle
  const stopRefreshCycle = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    setIsRefreshing(false);
  };

  // Effect to handle preview URL changes
  useEffect(() => {
    if (previewUrl && statusData?.isRunning) {
      // Reset refresh state
      setRefreshSuccess(false);
      setRefreshError(null);
      
      // Start the refresh cycle when preview URL is available and project is running
      startRefreshCycle();
    }
  }, [previewUrl, statusData?.isRunning]);
  
  // Manual refresh function that can be triggered by user
  const handleManualRefresh = () => {
    if (previewUrl && statusData?.isRunning) {
      // Reset refresh state
      setIsRefreshing(true);
      setRefreshAttempts(0);
      setRefreshSuccess(false);
      setRefreshError(null);
      
      // Clear any existing timer
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      
      // Refresh the iframe content immediately
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.location.reload();
      }
      
      // Start the refresh interval
      refreshTimerRef.current = setInterval(() => {
        setRefreshAttempts(prev => {
          const newCount = prev + 1;
          
          // Check if we've reached the maximum attempts (30 second timeout)
          if (newCount >= maxRefreshAttempts) {
            setRefreshError('Preview refresh timed out after 30 seconds');
            if (refreshTimerRef.current) {
              clearInterval(refreshTimerRef.current);
              refreshTimerRef.current = null;
            }
            setIsRefreshing(false);
          }
          
          return newCount;
        });
      }, 1000); // Check every second
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
    
    return () => {
      clearInterval(statusInterval);
      // Clean up refresh timer on unmount
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    }
  }, [projectName])

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
          
          {statusData?.isRunning && (
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-500 hover:bg-blue-500/20 rounded shadow-sm transition-colors ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Preview
            </button>
          )}
          
          {/* Project Status Panel - Collapsible */}
          {statusData && (
            <Collapsible className="relative">
              <CollapsibleTrigger className={`flex items-center px-3 py-2 rounded shadow-sm transition-colors border ${
                statusData.isRunning
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-500 hover:bg-blue-500/20'
                  : 'bg-gray-500/10 border-gray-500/30 text-gray-500 hover:bg-gray-500/20'
              }`}>
                <Server className="h-4 w-4 mr-2" />
                <span className="font-medium">Status:</span>
                <span className={`ml-1 text-xs font-medium px-1.5 py-0.5 rounded ${
                  statusData.isRunning ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                }`}>
                  {statusData.isRunning ? 'RUNNING' : 'STOPPED'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 ml-1.5 collapsible-closed" />
                <ChevronUp className="h-3.5 w-3.5 ml-1.5 collapsible-open" />
              </CollapsibleTrigger>
              
              <CollapsibleContent className="absolute right-0 top-full mt-1 z-10 w-72 bg-blue-500/10 border border-blue-500/30 text-blue-500 rounded-md p-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center mb-2">
                  <Server className="h-5 w-5 mr-2" />
                  <span className="font-semibold">Project Status:</span>
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    statusData.isRunning ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {statusData.isRunning ? 'RUNNING' : 'STOPPED'}
                  </span>
                </div>
                
                {statusData.isRunning && statusData.processes && (
                  <div className="mt-2">
                    <div className="flex items-center mb-1">
                      <Activity className="h-4 w-4 mr-2" />
                      <span className="text-sm">Running Processes: {statusData.processes.count}</span>
                    </div>
                    
                    {statusData.processes.details && statusData.processes.details.map((process, index) => (
                      <div key={index} className="ml-6 text-xs text-blue-400 font-mono">
                        PID: {process.pid} - Command: {process.command}
                      </div>
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
      
      {/* Status Information - Removed from here and moved to header */}
      
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
            isRefreshing={isRefreshing}
            refreshAttempts={refreshAttempts}
            refreshSuccess={refreshSuccess}
            refreshError={refreshError}
            onPreviewLoad={handlePreviewLoadSuccess}
            onRefresh={() => {
              if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.location.reload();
              }
            }}
            iframeRef={iframeRef}
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


// Custom CSS for the collapsible component
const collapsibleStyles = `
  .collapsible-open {
    display: none;
  }
  
  [data-state="open"] .collapsible-open {
    display: block;
  }
  
  [data-state="open"] .collapsible-closed {
    display: none;
  }
  
  @keyframes slide-in-from-top-2 {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-in {
    animation-duration: 200ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-fill-mode: both;
  }
  
  .slide-in-from-top-2 {
    animation-name: slide-in-from-top-2;
  }
  
  .duration-200 {
    animation-duration: 200ms;
  }
`;

const Development = () => {
  return (
    <Suspense fallback={<div className="p-6">Loading development environment...</div>}>
      {/* Add style for collapsible component */}
      <style dangerouslySetInnerHTML={{ __html: collapsibleStyles }} />
      <DevelopmentContent />
    </Suspense>
  )
}

export default Development