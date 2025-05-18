/**
 * API Client Wrapper for the OpenAPI-generated client
 *
 * This wrapper integrates with Supabase authentication to provide
 * authorized API requests using the user's access token.
 */

import { ApiError } from './api';
import { SupabaseClientHelper } from './supabase/client';
import {
  OpenAPI,
  ProjectsService,
  ChatService,
  GitHubService
} from './generated/api';

/**
 * Error thrown when attempting to make an authenticated API request without being logged in
 */
export class NotAuthenticatedError extends Error {
  constructor(message = 'You must be logged in to perform this action') {
    super(message);
    this.name = 'NotAuthenticatedError';
  }
}

/**
 * Interface for the legacy client API
 * This maintains backward compatibility with existing code
 */
export interface LegacyApiClient {
  createChatTask: (params: Record<string, unknown>) => Promise<{ data?: unknown }>;
  getChatTasks: () => Promise<{ data?: unknown }>;
  getChatTaskDetails: (taskId: string) => Promise<{ data?: unknown }>;
  resumeChatTask: (taskId: string) => Promise<{ data?: unknown }>;
  sendMessageToTask: (taskId: string, message: Record<string, unknown>) => Promise<{ data?: unknown }>;
  getProjects: () => Promise<{ data?: unknown }>;
  getProjectDetails: (projectName: string) => Promise<{ data?: unknown }>;
}

/**
 * API Client class that wraps the generated client with authentication
 */
export class ApiClient {
  private initialized = false;
  private supabase = SupabaseClientHelper.createBrowserClient();

  /**
   * Initialize the OpenAPI configuration with authentication
   * @param requireAuth Whether to require authentication (throws if not authenticated)
   * @throws NotAuthenticatedError if requireAuth is true and user is not authenticated
   */
  public async initialize(requireAuth = true): Promise<void> {
    // Skip if already initialized
    if (this.initialized) {
      return;
    }

    // Get the current session
    const { data: { session } } = await this.supabase.auth.getSession();

    // If authentication is required but user is not logged in, throw an error
    if (requireAuth && !session?.access_token) {
      throw new NotAuthenticatedError();
    }

    // Configure the OpenAPI instance
    // Use localhost:2020 for local development and jonasreitz.de:2020 for production
    const isLocalDevelopment = typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    OpenAPI.BASE = isLocalDevelopment
      ? 'http://localhost:2020'
      : 'https://jonasreitz.de:2020';
    
    // Set the token resolver function to provide the access token
    if (session?.access_token) {
      OpenAPI.TOKEN = session.access_token;
    } else {
      OpenAPI.TOKEN = undefined;
    }

    this.initialized = true;
  }

  /**
   * Get the authenticated API client instance (for backward compatibility)
   * @param requireAuth Whether to require authentication (throws if not authenticated)
   * @returns A proxy object that simulates the old client interface
   * @throws NotAuthenticatedError if requireAuth is true and user is not authenticated
   */
  public async getClient(requireAuth = true): Promise<LegacyApiClient> {
    await this.initialize(requireAuth);
    
    // Create a proxy object that simulates the old client interface
    // This maintains backward compatibility with existing code
    return {
      // Add methods that existing code might be using
      createChatTask: async (params: Record<string, unknown>) => {
        const ChatService = await this.getChatService(requireAuth);
        const response = await ChatService.postApiChatTasks({ requestBody: params });
        return { data: response };
      },
      getChatTasks: async () => {
        const ChatService = await this.getChatService(requireAuth);
        const response = await ChatService.getApiChatTasks();
        return { data: response };
      },
      getChatTaskDetails: async (taskId: string) => {
        const ChatService = await this.getChatService(requireAuth);
        const response = await ChatService.getApiChatTasks1({ taskId });
        return { data: response };
      },
      resumeChatTask: async (taskId: string) => {
        const ChatService = await this.getChatService(requireAuth);
        const response = await ChatService.putApiChatTasksResume({ taskId });
        return { data: response };
      },
      sendMessageToTask: async (taskId: string, message: Record<string, unknown>) => {
        const ChatService = await this.getChatService(requireAuth);
        const response = await ChatService.postApiChatTasksMessages({ taskId, requestBody: message });
        return { data: response };
      },
      getProjects: async () => {
        const ProjectsService = await this.getProjectsService(requireAuth);
        const response = await ProjectsService.getProjects();
        return { data: response };
      },
      getProjectDetails: async (projectName: string) => {
        const ProjectsService = await this.getProjectsService(requireAuth);
        const response = await ProjectsService.getProjectsConfig({ projectName });
        return { data: response };
      }
      // Add more methods as needed based on what existing code is using
    };
  }

  /**
   * Reset the client configuration
   * Call this when the authentication state changes
   */
  public resetClient(): void {
    this.initialized = false;
    OpenAPI.TOKEN = undefined;
  }

  /**
   * Get the Projects service with authentication
   * @param requireAuth Whether to require authentication
   * @returns The Projects service
   */
  public async getProjectsService(requireAuth = true): Promise<typeof ProjectsService> {
    await this.initialize(requireAuth);
    return ProjectsService;
  }

  /**
   * Get the Chat service with authentication
   * @param requireAuth Whether to require authentication
   * @returns The Chat service
   */
  public async getChatService(requireAuth = true): Promise<typeof ChatService> {
    await this.initialize(requireAuth);
    return ChatService;
  }

  /**
   * Get the GitHub service with authentication
   * @param requireAuth Whether to require authentication
   * @returns The GitHub service
   */
  public async getGitHubService(requireAuth = true): Promise<typeof GitHubService> {
    await this.initialize(requireAuth);
    return GitHubService;
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

// Create a singleton instance of the ApiClient
export const apiClient = new ApiClient();

/**
 * Hook into Supabase auth state changes to reset the API client when auth changes
 * This should be called during application initialization
 */
export function setupApiClientAuthListener(): () => void {
  const supabase = SupabaseClientHelper.createBrowserClient();
  
  // Subscribe to auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
    // Reset the client when auth state changes
    apiClient.resetClient();
  });

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
}