'use client'

import React from 'react'
import { ArrowLeft, Monitor, Smartphone, Tablet, Laptop } from 'lucide-react'
import Link from 'next/link'

const OpenProject = () => {
  return (
    <div className="p-6 w-full">
      <div className="flex items-center mb-8">
        <Link href="/projects" className="text-muted-foreground hover:text-primary mr-3">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-primary tracking-wider">
          SELECT<span className="text-secondary">::</span>
          <span className="text-primary/90">DEVICE</span>
        </h1>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6 shadow-md">
          <h2 className="text-xl text-primary font-medium mb-6">
            Select Device to Open Project
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted border border-border rounded-md p-5 hover:bg-muted/80 hover:border-primary/50 cursor-pointer transition-all group">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:text-primary/90 mr-4">
                  <Monitor className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary">Desktop</h3>
                  <p className="text-sm text-muted-foreground">1920×1080 resolution</p>
                </div>
              </div>
            </div>
            <div className="bg-muted border border-border rounded-md p-5 hover:bg-muted/80 hover:border-primary/50 cursor-pointer transition-all group">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:text-primary/90 mr-4">
                  <Laptop className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary">Laptop</h3>
                  <p className="text-sm text-muted-foreground">1366×768 resolution</p>
                </div>
              </div>
            </div>
            <div className="bg-muted border border-border rounded-md p-5 hover:bg-muted/80 hover:border-primary/50 cursor-pointer transition-all group">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:text-primary/90 mr-4">
                  <Tablet className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary">Tablet</h3>
                  <p className="text-sm text-muted-foreground">1024×768 resolution</p>
                </div>
              </div>
            </div>
            <div className="bg-muted border border-border rounded-md p-5 hover:bg-muted/80 hover:border-primary/50 cursor-pointer transition-all group">
              <div className="flex items-center">
                <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:text-primary/90 mr-4">
                  <Smartphone className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary">Mobile</h3>
                  <p className="text-sm text-muted-foreground">375×667 resolution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenProject