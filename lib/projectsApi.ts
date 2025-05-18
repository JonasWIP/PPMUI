/**
 * Projects API Client (Mock Implementation)
 *
 * This file provides a mock client that returns placeholder data.
 * The actual Development API has been deprecated.
 */

import { ApiError } from './api';

/**
 * Mock configuration function (no-op)
 * Kept for backward compatibility
 */
export const configureProjectsApi = () => {
  console.log('Development API has been deprecated. Using mock implementation.');
};

/**
 * ProjectsApiClient class provides mock methods that return placeholder data
 */
export class ProjectsApiClient {
  /**
   * List all projects (mock implementation)
   */
  public async listProjects() {
    console.log('Using mock implementation for listProjects');
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated.",
      directories: ["example-project-1", "example-project-2", "example-project-3"]
    };
  }

  /**
   * Initialize a project (mock implementation)
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
    console.log('Using mock implementation for initializeProject', { projectName, options });
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated.",
      projectName: projectName,
      projectPath: `/path/to/projects/${projectName}`,
      config: options.config || {
        projectName: projectName,
        deployment: {
          dev: ["npm run dev"]
        },
        previewUrl: "http://localhost:3000",
      },
      commands: options.commands || [],
      output: [],
      gitInitialized: options.initGit || false,
      nextSteps: ["Project functionality has been deprecated"]
    };
  }

  /**
   * Deploy a project (mock implementation)
   */
  public async deployProject(
    projectName: string,
    options: {
      commitMessage: string;
      branch?: string;
    }
  ) {
    console.log('Using mock implementation for deployProject', { projectName, options });
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated.",
      projectName: projectName,
      gitStatus: {
        hasChanges: false,
        branch: options.branch || "main"
      },
      commit: {
        hash: "mock-commit-hash",
        message: options.commitMessage
      },
      push: {
        success: true,
        remote: "origin",
        branch: options.branch || "main"
      }
    };
  }

  /**
   * Start a project (mock implementation)
   */
  public async startProject(projectName: string) {
    console.log('Using mock implementation for startProject', { projectName });
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated.",
      projectName: projectName,
      commands: ["npm run dev"],
      output: [],
      duration: 0
    };
  }

  /**
   * Stop a project (mock implementation)
   */
  public async stopProject(projectName: string) {
    console.log('Using mock implementation for stopProject', { projectName });
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated.",
      projectName: projectName
    };
  }

  /**
   * Clone a repository (mock implementation)
   */
  public async cloneRepository(
    options: {
      repositoryUrl: string;
      projectName?: string;
      forkMode?: boolean;
    }
  ) {
    console.log('Using mock implementation for cloneRepository', { options });
    const projectName = options.projectName || options.repositoryUrl.split('/').pop()?.replace('.git', '') || 'example-project';
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated.",
      projectName: projectName,
      projectPath: `/path/to/projects/${projectName}`,
      isFork: options.forkMode || false
    };
  }

  /**
   * Create a new project (mock implementation)
   */
  public async createProject(
    projectName: string,
    instructions?: string
  ) {
    console.log('Using mock implementation for createProject', { projectName, instructions });
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated.",
      projectName: projectName,
      projectPath: `/path/to/projects/${projectName}`
    };
  }

  /**
   * Delete a project (mock implementation)
   */
  public async deleteProject(projectName: string) {
    console.log('Using mock implementation for deleteProject', { projectName });
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated."
    };
  }

  /**
   * Get project configuration (mock implementation)
   */
  public async getProjectConfig(projectName: string) {
    console.log('Using mock implementation for getProjectConfig', { projectName });
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated.",
      config: {
        repoUrl: "https://github.com/example/repo.git",
        isTemplate: false,
        projectName: projectName,
        deployment: {
          dev: ["npm run dev"],
          live: ["npm run build"]
        },
        previewUrl: "http://localhost:3000",
        liveUrl: "https://example.com"
      }
    };
  }

  /**
   * Update project configuration (mock implementation)
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
    console.log('Using mock implementation for updateProjectConfig', { projectName, config });
    return {
      status: "success",
      message: "This is a placeholder response. The Projects API has been deprecated."
    };
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