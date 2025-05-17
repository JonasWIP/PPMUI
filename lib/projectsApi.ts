/**
 * Projects API Client
 *
 * This file provides a client for the server-side Projects API routes.
 * All API requests are made through server-side API routes for security.
 */

import { ApiError } from './api';
import { OpenAPI } from './generated';

/**
 * Configure the OpenAPI instance for server-side use
 * This function should be used in all server-side API routes
 * to ensure consistent configuration
 */
export const configureProjectsApi = () => {
  // Set the base URL for the Projects API
  OpenAPI.BASE = process.env.NEXT_PUBLIC_PROJECTS_API_URL || 'http://localhost:2020';
  
  // Get the token from environment variables
  const token = process.env.NEXT_PUBLIC_PROJECTS_API_TOKEN || '';
  
  // Set the token for Bearer authentication
  OpenAPI.TOKEN = token;
  
  // Add a log to help with debugging
  console.log(`Configuring Projects API with base URL: ${OpenAPI.BASE}`);

  
  OpenAPI.WITH_CREDENTIALS = false;
  
  // Add custom headers including a direct Authorization header
  // This ensures the header is sent even if the token validation fails
  OpenAPI.HEADERS = {
    'X-API-Source': 'server-side-route',
    'Authorization': `Bearer ${token || 'dev-default-token'}`
  };
};

/**
 * ProjectsApiClient class provides methods to interact with the Projects API
 * through server-side API routes.
 */
export class ProjectsApiClient {
  /**
   * List all projects
   */
  public async listProjects() {
    try {
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to list projects',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Initialize a project
   */
  public async initializeProject(
    projectName: string,
    options: {
      commands?: string[];
      config?: {
        repoUrl?: string;
        isTemplate?: boolean;
        projectName?: string;
        deployment?: {
          dev?: string[];
        };
        previewUrl?: string;
        liveUrl?: string;
      };
      initGit?: boolean;
    }
  ) {
    try {
      const response = await fetch(`/api/projects/${projectName}/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to initialize project',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Deploy a project
   */
  public async deployProject(
    projectName: string,
    options: {
      commitMessage: string;
      branch?: string;
    }
  ) {
    try {
      const response = await fetch(`/api/projects/${projectName}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to deploy project',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Start a project
   */
  public async startProject(projectName: string) {
    try {
      const response = await fetch(`/api/projects/${projectName}/start`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to start project',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Stop a project
   */
  public async stopProject(projectName: string) {
    try {
      const response = await fetch(`/api/projects/${projectName}/stop`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to stop project',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Clone a repository
   */
  public async cloneRepository(
    options: {
      repositoryUrl: string;
      projectName?: string;
      forkMode?: boolean;
    }
  ) {
    try {
      const response = await fetch('/api/projects/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to clone repository',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  public async createProject(
    projectName: string,
    instructions?: string
  ) {
    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          instructions
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to create project',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  public async deleteProject(projectName: string) {
    try {
      const response = await fetch(`/api/projects/${projectName}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to delete project',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Get project configuration
   */
  public async getProjectConfig(projectName: string) {
    try {
      const response = await fetch(`/api/projects/${projectName}/config`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to get project config',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Update project configuration
   */
  public async updateProjectConfig(
    projectName: string,
    config: {
      repoUrl?: string;
      isTemplate?: boolean;
      projectName?: string;
      deployment?: {
        dev?: string[];
        live?: string[];
      };
      previewUrl?: string;
      liveUrl?: string;
    }
  ) {
    try {
      const response = await fetch(`/api/projects/${projectName}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          response.status,
          errorData.error || 'Failed to update project config',
          errorData
        );
      }
      
      return await response.json();
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }

  /**
   * Handle API errors by converting them to our application's ApiError format
   */
  private handleApiError(error: unknown): never {
    // If it's already our ApiError type, just rethrow it
    if (error instanceof ApiError) {
      throw error;
    }

    // For fetch errors or other errors, wrap them in our ApiError
    throw new ApiError(
      500,
      error instanceof Error ? error.message : 'Unknown API error',
      { originalError: error }
    );
  }
}

// Create a singleton instance of the ProjectsApiClient
export const projectsApi = new ProjectsApiClient();