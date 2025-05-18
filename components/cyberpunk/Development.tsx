'use client'

import React, { useState } from 'react'
import { ArrowLeft, Terminal, Play } from 'lucide-react'
import Link from 'next/link'
import ChatInterface from './ChatInterface'
import PreviewPanel from './PreviewPanel'

const Development = () => {
  const [projectName] = useState('PROJECT_ALPHA')
  const [previewUrl] = useState('https://preview.example.com/demo')
  const [liveUrl] = useState('https://live.example.com')

  return (
    <div className="p-6 w-full h-[calc(100vh-64px)] flex flex-col">
      {/* Notice about deprecated functionality */}
      <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-md">
        <strong>Notice:</strong> Development API functionality has been deprecated. This interface shows placeholder content.
      </div>
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
            Run Project
          </button>
          <Link href="/local-development" className="flex items-center px-4 py-2 bg-primary/10 border border-primary/30 text-primary/50 rounded cursor-not-allowed opacity-70 shadow-sm" onClick={(e) => e.preventDefault()}>
            <Terminal className="h-4 w-4 mr-2" />
            Local Dev
          </Link>
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

export default Development