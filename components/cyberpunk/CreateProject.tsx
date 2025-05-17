'use client'

import React, { useState } from 'react'
import { ArrowLeft, Code, Loader2, AlertCircle, Check, Server, Database, Globe } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { projectsApi } from '@/lib/projectsApi'

// Define template types
type Template = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  config?: {
    repoUrl?: string
    deployment?: {
      dev?: string[]
    }
  }
}

// Project configuration type
type ProjectConfig = {
  repoUrl?: string
  isTemplate?: boolean
  deployment?: {
    dev?: string[]
  }
  previewUrl?: string
  liveUrl?: string
}

const CreateProject = () => {
  const router = useRouter()
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [config, setConfig] = useState<ProjectConfig>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Available templates
  const templates: Template[] = [
    {
      id: 'saas',
      name: 'SaaS Config Setup',
      description: 'Configure your project with our standard SaaS settings and integrations',
      icon: <Code className="h-6 w-6" />,
      config: {
        deployment: {
          dev: ['npm install', 'npm run dev']
        }
      }
    },
    {
      id: 'api',
      name: 'API Service',
      description: 'Backend API service with database integration',
      icon: <Server className="h-6 w-6" />,
      config: {
        deployment: {
          dev: ['npm install', 'npm run start:dev']
        }
      }
    },
    {
      id: 'database',
      name: 'Database Project',
      description: 'Database-focused project with migrations and ORM setup',
      icon: <Database className="h-6 w-6" />,
      config: {
        deployment: {
          dev: ['npm install', 'npm run migrate', 'npm run dev']
        }
      }
    },
    {
      id: 'web',
      name: 'Web Application',
      description: 'Frontend web application with modern UI framework',
      icon: <Globe className="h-6 w-6" />,
      config: {
        deployment: {
          dev: ['npm install', 'npm run dev']
        }
      }
    }
  ]

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    
    // Apply template configuration
    const template = templates.find(t => t.id === templateId)
    if (template && template.config) {
      setConfig(prevConfig => ({
        ...prevConfig,
        ...template.config
      }))
    }
  }

  // Handle project name change with validation
  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProjectName(value)
    
    // Validate project name
    if (value.trim() === '') {
      setNameError('Project name is required')
    } else if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
      setNameError('Project name can only contain letters, numbers, hyphens, and underscores')
    } else {
      setNameError(null)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (projectName.trim() === '') {
      setNameError('Project name is required')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      // Create project instructions based on template and configuration
      const instructions = JSON.stringify({
        template: selectedTemplate,
        description,
        config
      })
      
      // Call API to create project
      await projectsApi.createProject(projectName, instructions)
      
      // Navigate to projects page on success
      router.push('/projects')
    } catch (err) {
      console.error('Failed to create project:', err)
      setError('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle input change for configuration
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig(prev => ({ ...prev, [name]: value }))
  }

  // Handle dev command change
  const handleDevCommandChange = (index: number, value: string) => {
    setConfig(prev => {
      const newConfig = { ...prev }
      if (!newConfig.deployment) {
        newConfig.deployment = { dev: [] }
      }
      if (!newConfig.deployment.dev) {
        newConfig.deployment.dev = []
      }
      
      const newDevCommands = [...(newConfig.deployment.dev || [])]
      newDevCommands[index] = value
      
      return {
        ...newConfig,
        deployment: {
          ...newConfig.deployment,
          dev: newDevCommands
        }
      }
    })
  }

  // Add new dev command
  const addDevCommand = () => {
    setConfig(prev => {
      const newConfig = { ...prev }
      if (!newConfig.deployment) {
        newConfig.deployment = { dev: [] }
      }
      if (!newConfig.deployment.dev) {
        newConfig.deployment.dev = []
      }
      
      return {
        ...newConfig,
        deployment: {
          ...newConfig.deployment,
          dev: [...(newConfig.deployment.dev || []), '']
        }
      }
    })
  }

  // Remove dev command
  const removeDevCommand = (index: number) => {
    setConfig(prev => {
      if (!prev.deployment || !prev.deployment.dev) return prev
      
      const newDevCommands = [...prev.deployment.dev]
      newDevCommands.splice(index, 1)
      
      return {
        ...prev,
        deployment: {
          ...prev.deployment,
          dev: newDevCommands
        }
      }
    })
  }

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
      
      {error && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6 shadow-md mb-6">
          <div className="mb-6">
            <label className="block text-sm text-muted-foreground mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={handleProjectNameChange}
              className={`w-full bg-muted border ${nameError ? 'border-destructive' : 'border-input'} rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30`}
              placeholder="Enter project name"
            />
            {nameError && (
              <p className="mt-1 text-sm text-destructive">{nameError}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-muted-foreground mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="Brief description of your project"
            />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-md mb-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Select Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`bg-muted border ${selectedTemplate === template.id ? 'border-primary/50' : 'border-border'} rounded-md p-5 hover:bg-muted/80 hover:border-primary/50 cursor-pointer transition-all group`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="flex items-center mb-4">
                  <div className={`h-12 w-12 rounded-lg ${selectedTemplate === template.id ? 'bg-primary/20' : 'bg-primary/10'} flex items-center justify-center text-primary group-hover:text-primary/90 mr-4`}>
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-primary flex items-center">
                      {template.name}
                      {selectedTemplate === template.id && (
                        <Check className="h-4 w-4 ml-2 text-primary" />
                      )}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">
              Advanced Configuration
            </h2>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary hover:text-primary/80"
            >
              {showAdvanced ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showAdvanced && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Repository URL (Optional)
                </label>
                <input
                  type="text"
                  name="repoUrl"
                  value={config.repoUrl || ''}
                  onChange={handleConfigChange}
                  className="w-full bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Development Commands
                </label>
                
                {config.deployment?.dev && config.deployment.dev.length > 0 ? (
                  <div className="space-y-2">
                    {config.deployment.dev.map((command, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={command}
                          onChange={(e) => handleDevCommandChange(index, e.target.value)}
                          className="flex-1 bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                          placeholder="npm run dev"
                        />
                        <button
                          type="button"
                          onClick={() => removeDevCommand(index)}
                          className="ml-2 p-2 text-destructive hover:text-destructive/80"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-2">No development commands configured.</p>
                )}
                
                <button
                  type="button"
                  onClick={addDevCommand}
                  className="mt-2 text-sm text-primary hover:text-primary/80"
                >
                  + Add Command
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !!nameError}
            className="px-6 py-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary/30 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateProject