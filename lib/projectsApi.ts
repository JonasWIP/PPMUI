/**
 * Projects API Client
 * 
 * This file provides a wrapper around the generated Projects API client
 * to make it easier to use in the application.
 */

import { OpenAPI, ProjectsService } from './generated';
import { ApiError } from './api';

/**
 * ProjectsApiClient class provides a wrapper around the generated ProjectsService
 * with additional functionality for authentication and error handling.
 */
export class ProjectsApiClient {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    // Initialize from environment variables
    this.apiUrl = process.env.NEXT_PUBLIC_PROJECTS_API_URL || 'http://localhost:2020';
    this.apiKey = process.env.NEXT_PUBLIC_PROJECTS_API_TOKEN || '';
    
    // Configure the OpenAPI instance
    this.configureOpenAPI();
  }

  /**
   * Configure the OpenAPI instance with the API URL and token
   */
  private configureOpenAPI(): void {
    OpenAPI.BASE = this.apiUrl;
    OpenAPI.TOKEN = this.apiKey;
    OpenAPI.WITH_CREDENTIALS = false;
  }

  /**
   * Set the API key manually (overrides the environment variable)
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    OpenAPI.TOKEN = apiKey;
  }

  /**
   * Set the API URL manually (overrides the environment variable)
   */
  public setApiUrl(apiUrl: string): void {
    this.apiUrl = apiUrl;
    OpenAPI.BASE = apiUrl;
  }

  /**
   * List all projects
   */
  public async listProjects() {
    try {
      return await ProjectsService.getProjects();
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
      return await ProjectsService.postProjectsInitialize({
        projectName,
        requestBody: options
      });
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
      return await ProjectsService.postProjectsDeploy({
        projectName,
        requestBody: options
      });
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
      return await ProjectsService.postProjectsStart({ projectName });
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
      return await ProjectsService.postProjectsStop({ projectName });
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
      return await ProjectsService.postProjectsClone({
        requestBody: options
      });
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
      return await ProjectsService.postProjectsCreate({
        requestBody: {
          projectName,
          instructions
        }
      });
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
      return await ProjectsService.deleteProjects({ projectName });
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
      return await ProjectsService.getProjectsConfig({ projectName });
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
      return await ProjectsService.putProjectsConfig({
        projectName,
        requestBody: config
      });
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

    // If it's the generated ApiError, convert it to our ApiError
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      error.name === 'ApiError' &&
      'status' in error
    ) {
      throw new ApiError(
        Number(error.status),
        'message' in error && typeof error.message === 'string' ? error.message : 'API Error',
        'body' in error ? error.body : undefined
      );
    }

    // For other errors, wrap them in our ApiError
    throw new ApiError(
      500,
      error instanceof Error ? error.message : 'Unknown API error',
      { originalError: error }
    );
  }
}

// Create a singleton instance of the ProjectsApiClient
export const projectsApi = new ProjectsApiClient();