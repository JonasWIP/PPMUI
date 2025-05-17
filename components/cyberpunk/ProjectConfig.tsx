'use client'

import React, { useState, useEffect } from 'react'
import { Save, Loader2, AlertCircle } from 'lucide-react'
import { projectsApi } from '@/lib/projectsApi'

type ProjectConfigProps = {
  projectName: string
}

type ProjectConfig = {
  repoUrl?: string
  isTemplate?: boolean
  projectName?: string
  deployment?: {
    dev?: string[]
    live?: string[]
  }
  previewUrl?: string
  liveUrl?: string
}

const ProjectConfig: React.FC<ProjectConfigProps> = ({ projectName }) => {
  const [config, setConfig] = useState<ProjectConfig | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await projectsApi.getProjectConfig(projectName)
        setConfig(data)
      } catch (err) {
        console.error('Failed to fetch project config:', err)
        setError('Failed to load project configuration. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (projectName) {
      fetchConfig()
    }
  }, [projectName])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setConfig(prev => {
      if (!prev) return prev
      return { ...prev, [name]: value }
    })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setConfig(prev => {
      if (!prev) return prev
      return { ...prev, [name]: checked }
    })
  }

  const handleDevCommandChange = (index: number, value: string) => {
    setConfig(prev => {
      if (!prev) return prev
      
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

  const addDevCommand = () => {
    setConfig(prev => {
      if (!prev) return prev
      
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

  const removeDevCommand = (index: number) => {
    setConfig(prev => {
      if (!prev) return prev
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!config) return
    
    try {
      setSaving(true)
      setError(null)
      setSaveSuccess(false)
      
      await projectsApi.updateProjectConfig(projectName, config)
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to update project config:', err)
      setError('Failed to save configuration. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2 text-primary">Loading configuration...</span>
      </div>
    )
  }

  if (error && !config) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold text-primary mb-6">
        Project Configuration
      </h2>
      
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-3 rounded-md mb-4">
          Configuration saved successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Repository URL
            </label>
            <input
              type="text"
              name="repoUrl"
              value={config?.repoUrl || ''}
              onChange={handleInputChange}
              className="w-full bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="https://github.com/username/repo"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isTemplate"
              name="isTemplate"
              checked={config?.isTemplate || false}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
            />
            <label htmlFor="isTemplate" className="ml-2 block text-sm text-muted-foreground">
              Is Template Project
            </label>
          </div>
          
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Preview URL
            </label>
            <input
              type="text"
              name="previewUrl"
              value={config?.previewUrl || ''}
              onChange={handleInputChange}
              className="w-full bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="https://preview.example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Live URL
            </label>
            <input
              type="text"
              name="liveUrl"
              value={config?.liveUrl || ''}
              onChange={handleInputChange}
              className="w-full bg-muted border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              placeholder="https://live.example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Development Commands
            </label>
            
            {config?.deployment?.dev && config.deployment.dev.length > 0 ? (
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
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary/30 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectConfig