'use client'

import React from 'react'
import { ArrowLeft, Code } from 'lucide-react'
import Link from 'next/link'

const CreateProject = () => {
  return (
    <div className="p-6 w-full">
      <div className="flex items-center mb-8">
        <Link href="/projects" className="text-muted-foreground hover:text-primary mr-3">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-primary tracking-wider">
          CREATE<span className="text-secondary">::</span>
          <span className="text-primary/90">PROJECT</span>
        </h1>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6 shadow-md">
          <div className="mb-6">
            <label className="block text-sm text-muted-foreground mb-2">
              Project Name
            </label>
            <input
              type="text"
              className="w-full bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="Enter project name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-muted border border-border rounded-md p-5 hover:bg-muted/80 hover:border-primary/50 cursor-pointer transition-all group">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:text-primary/90 mr-4">
                  <Code className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary">
                    SaaS Config Setup
                  </h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure your project with our standard SaaS settings and
                integrations
              </p>
            </div>
            <div className="bg-muted border border-border rounded-md p-5 hover:bg-muted/80 hover:border-primary/50 cursor-pointer transition-all group">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary group-hover:text-secondary/90 mr-4">
                  <div className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-primary">
                    Template
                  </h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Start with one of our pre-built templates for faster development
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary/30 transition-all shadow-sm">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProject