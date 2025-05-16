'use client'

import React from 'react'
import {
  BarChart3,
  LineChart,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'

const Dashboard = () => {
  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-wider">
          DASHBOARD<span className="text-secondary">::</span>
          <span className="text-primary/90">MAIN</span>
        </h1>
        <div className="flex items-center space-x-2 text-primary">
          <span>SYSTEM STATUS:</span>
          <span className="text-green-400 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            ONLINE
          </span>
          <span className="text-xs opacity-70">|</span>
          <span className="text-xs opacity-70">ID: XR-7829</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Overview */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-primary font-medium tracking-wide">
              Status Overview
            </h2>
            <div className="flex space-x-2">
              <button className="p-1 hover:text-primary text-muted-foreground">
                <LineChart className="h-5 w-5" />
              </button>
              <button className="p-1 hover:text-primary text-muted-foreground">
                <BarChart3 className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted border border-border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold text-primary">12</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-400">
                +3 from last week
              </div>
            </div>
            <div className="bg-muted border border-border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Tickets</p>
                  <p className="text-2xl font-bold text-primary">28</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 text-xs text-yellow-400">
                5 require attention
              </div>
            </div>
            <div className="bg-muted border border-border rounded-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-primary">3</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-2 text-xs text-destructive">
                1 new since yesterday
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg text-primary mb-3">
              Ticket Status Summary
            </h3>
            <div className="h-60 w-full bg-muted border border-border rounded-md flex items-center justify-center">
              <div className="text-muted-foreground flex flex-col items-center">
                <BarChart3 className="h-8 w-8 mb-2" />
                <span className="text-sm">Analytics Visualization</span>
              </div>
            </div>
          </div>
        </div>
        {/* Global Analytics */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-md">
          <h2 className="text-xl text-primary font-medium tracking-wide mb-4">
            Global Analytics
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">CPU Usage</span>
                <span className="text-primary">78%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: '78%',
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Memory</span>
                <span className="text-primary">45%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: '45%',
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Network</span>
                <span className="text-primary">92%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: '92%',
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Revenue</span>
                <span className="text-primary">$42,589</span>
              </div>
              <div className="h-40 w-full bg-muted border border-border rounded-md flex items-center justify-center">
                <div className="text-muted-foreground flex flex-col items-center">
                  <LineChart className="h-6 w-6 mb-2" />
                  <span className="text-xs">Revenue Chart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard