'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Code, Loader2, AlertCircle, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { projectsApi } from '@/lib/projectsApi'
import { ProjectsService, OpenAPI } from '@/lib/generated/api'
import { apiClient } from '@/lib/apiClient'

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
  description?: string
}

// Type guard for projectsResponse
function hasProjectsProp(obj: unknown): obj is { projects: string[] } {
  return typeof obj === 'object' && obj !== null && 'projects' in obj && Array.isArray((obj as { [key: string]: unknown }).projects)
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
  const [mode, setMode] = useState<'template' | 'prompt'>('template')
  const [templates, setTemplates] = useState<Template[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [templatesError, setTemplatesError] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')

  // Fetch template projects on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setTemplatesLoading(true)
        setTemplatesError(null)
        await apiClient.initialize(false)
        OpenAPI.BASE = '/api/proxy'
        const projectsResponse = await ProjectsService.getProjects()
        const projectNames = projectsResponse.directories || (hasProjectsProp(projectsResponse) ? projectsResponse.projects : []) || []
        const templateProjects = []
        for (const projectName of projectNames) {
          try {
            const configResponse = await ProjectsService.getProjectsConfig({ projectName })
            const config = configResponse.config || {}
            if (config.isTemplate) {
              templateProjects.push({
                id: projectName,
                name: config.projectName || projectName,
                description: (config as ProjectConfig).description?.toString() || '',
                icon: <Code className="h-6 w-6" />, // You may want to improve icon logic
                config,
              })
            }
          } catch {
            // Ignore errors for individual projects
          }
        }
        setTemplates(templateProjects)
      } catch {
        setTemplatesError('Failed to load templates.')
      } finally {
        setTemplatesLoading(false)
      }
    }
    fetchTemplates()
  }, [])

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
      
      {/* Mode Toggle */}
      <div className="flex space-x-4 mb-8">
        <button
          type="button"
          className={`px-4 py-2 rounded ${mode === 'template' ? 'bg-primary/20 border border-primary/30 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}
          onClick={() => setMode('template')}
        >
          From Template
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded ${mode === 'prompt' ? 'bg-primary/20 border border-primary/30 text-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}
          onClick={() => setMode('prompt')}
        >
          From Prompt
        </button>
      </div>
      
      {mode === 'template' ? (
        <>
          {templatesLoading ? (
            <div className="flex items-center"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading templates...</div>
          ) : templatesError ? (
            <div className="text-destructive">{templatesError}</div>
          ) : (
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
                  {templates.length === 0 && !templatesLoading && !templatesError && (
                    <div className="col-span-2 text-center text-muted-foreground py-8 text-lg">
                      <AlertCircle className="inline-block h-6 w-6 mr-2 align-text-bottom text-yellow-500" />
                      No templates found. Please create a template project first or use the prompt mode.
                    </div>
                  )}
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
          )}
        </>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (!prompt.trim()) {
              setError('Prompt is required')
              return
            }
            setLoading(true)
            setError(null)
            try {
              // Create a new project/task with the prompt as the description
              await projectsApi.createProject(
                projectName || 'prompt-project',
                JSON.stringify({ description: prompt, fromPrompt: true })
              )
              router.push('/projects')
            } catch {
              setError('Failed to create project from prompt.')
            } finally {
              setLoading(false)
            }
          }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-6">
            <label className="block text-sm text-muted-foreground mb-2">
              What do you want to build?
            </label>
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="w-full bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="Describe your project (e.g. Create a CRM for freelancers)"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary/30 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create from Prompt'
              )}
            </button>
          </div>
          {error && <div className="text-destructive mt-2">{error}</div>}
        </form>
      )}
    </div>
  )
}

export default CreateProject