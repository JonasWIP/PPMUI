import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Projects from './Projects';
import { projectsApi } from '@/lib/projectsApi';

// We don't need to mock next/navigation here as it's already mocked in jest.setup.js

// Mock the projectsApi
jest.mock('@/lib/projectsApi', () => ({
  projectsApi: {
    listProjects: jest.fn(),
    startProject: jest.fn(),
  },
}));

describe('Projects Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on console methods to verify logging
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  test('displays loading state initially', () => {
    render(<Projects />);
    expect(screen.getByText('Loading projects...')).toBeInTheDocument();
  });

  test('displays projects when API returns valid data with directories array', async () => {
    // Mock successful API response with directories array
    const mockProjects = {
      status: 'success',
      message: 'Projects retrieved successfully',
      directories: ['project1', 'project2', 'template-test', 'archived-old']
    };
    
    (projectsApi.listProjects as jest.Mock).mockResolvedValue(mockProjects);
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Verify API response is logged
    expect(console.log).toHaveBeenCalledWith('API Response:', mockProjects);
    
    // Verify projects array is logged
    expect(console.log).toHaveBeenCalledWith('Projects from API:', mockProjects.directories);
    
    // Verify projects are displayed (only non-template, non-archived by default)
    expect(screen.getByText('project1')).toBeInTheDocument();
    expect(screen.getByText('project2')).toBeInTheDocument();
    
    // Template and archived projects should not be visible in the default tab
    expect(screen.queryByText('template-test')).not.toBeInTheDocument();
    expect(screen.queryByText('archived-old')).not.toBeInTheDocument();
  });

  test('displays projects when API returns valid data with projects array', async () => {
    // Mock successful API response with projects array
    const mockProjects = {
      status: 'success',
      message: 'Projects retrieved successfully',
      projects: ['project1', 'project2', 'template-test', 'archived-old']
    };
    
    (projectsApi.listProjects as jest.Mock).mockResolvedValue(mockProjects);
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Verify API response is logged
    expect(console.log).toHaveBeenCalledWith('API Response:', mockProjects);
    
    // Verify projects array is logged
    expect(console.log).toHaveBeenCalledWith('Projects from API:', mockProjects.projects);
    
    // Verify projects are displayed (only non-template, non-archived by default)
    expect(screen.getByText('project1')).toBeInTheDocument();
    expect(screen.getByText('project2')).toBeInTheDocument();
    
    // Template and archived projects should not be visible in the default tab
    expect(screen.queryByText('template-test')).not.toBeInTheDocument();
    expect(screen.queryByText('archived-old')).not.toBeInTheDocument();
  });

  test('displays templates when templates tab is clicked', async () => {
    // Mock successful API response with projects including templates
    const mockProjects = {
      status: 'success',
      message: 'Projects retrieved successfully',
      directories: ['project1', 'project2', 'template-test', 'archived-old']
    };
    
    (projectsApi.listProjects as jest.Mock).mockResolvedValue(mockProjects);
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Click on Templates tab
    await userEvent.click(screen.getByText('Templates'));
    
    // Verify only template projects are displayed
    await waitFor(() => {
      expect(screen.queryByText('project1')).not.toBeInTheDocument();
      expect(screen.queryByText('project2')).not.toBeInTheDocument();
      expect(screen.getByText('template-test')).toBeInTheDocument();
      expect(screen.queryByText('archived-old')).not.toBeInTheDocument();
    });
  });

  test('displays archived projects when archived tab is clicked', async () => {
    // Mock successful API response with projects including archived
    const mockProjects = {
      status: 'success',
      message: 'Projects retrieved successfully',
      directories: ['project1', 'project2', 'template-test', 'archived-old']
    };
    
    (projectsApi.listProjects as jest.Mock).mockResolvedValue(mockProjects);
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Click on Archived tab
    await userEvent.click(screen.getByText('Archived'));
    
    // Verify only archived projects are displayed
    await waitFor(() => {
      expect(screen.queryByText('project1')).not.toBeInTheDocument();
      expect(screen.queryByText('project2')).not.toBeInTheDocument();
      expect(screen.queryByText('template-test')).not.toBeInTheDocument();
      expect(screen.getByText('archived-old')).toBeInTheDocument();
    });
  });

  test('handles empty arrays correctly', async () => {
    // Mock API response with empty directories array
    const mockEmptyProjects = {
      status: 'success',
      message: 'No projects found',
      directories: []
    };
    
    (projectsApi.listProjects as jest.Mock).mockResolvedValue(mockEmptyProjects);
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Verify empty state message is displayed
    expect(screen.getByText('No projects found.')).toBeInTheDocument();
    expect(screen.getByText('Create a new project?')).toBeInTheDocument();
  });

  test('handles empty projects array correctly', async () => {
    // Mock API response with empty projects array
    const mockEmptyProjects = {
      status: 'success',
      message: 'No projects found',
      projects: []
    };
    
    (projectsApi.listProjects as jest.Mock).mockResolvedValue(mockEmptyProjects);
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Verify empty state message is displayed
    expect(screen.getByText('No projects found.')).toBeInTheDocument();
    expect(screen.getByText('Create a new project?')).toBeInTheDocument();
  });

  test('handles null arrays correctly', async () => {
    // Mock API response with null directories
    const mockNullProjects = {
      status: 'success',
      message: 'Projects retrieved successfully',
      directories: null
    };
    
    (projectsApi.listProjects as jest.Mock).mockResolvedValue(mockNullProjects);
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Verify error message is displayed
    expect(screen.getByText('Invalid API response format. Please try again later.')).toBeInTheDocument();
    
    // Verify error is logged
    expect(console.error).toHaveBeenCalledWith(
      'API response does not contain a valid projects or directories array:',
      mockNullProjects
    );
  });

  test('handles null projects array but valid directories array correctly', async () => {
    // Mock API response with null projects but valid directories
    const mockMixedProjects = {
      status: 'success',
      message: 'Projects retrieved successfully',
      projects: null,
      directories: ['project1', 'project2']
    };
    
    (projectsApi.listProjects as jest.Mock).mockResolvedValue(mockMixedProjects);
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Should use directories array as fallback
    expect(screen.getByText('project1')).toBeInTheDocument();
    expect(screen.getByText('project2')).toBeInTheDocument();
  });

  test('handles valid projects array but null directories array correctly', async () => {
    // Mock API response with valid projects but null directories
    const mockMixedProjects = {
      status: 'success',
      message: 'Projects retrieved successfully',
      projects: ['project1', 'project2'],
      directories: null
    };
    
    (projectsApi.listProjects as jest.Mock).mockResolvedValue(mockMixedProjects);
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Should use projects array
    expect(screen.getByText('project1')).toBeInTheDocument();
    expect(screen.getByText('project2')).toBeInTheDocument();
  });

  test('handles API error correctly', async () => {
    // Mock API error
    (projectsApi.listProjects as jest.Mock).mockRejectedValue(new Error('API error'));
    
    render(<Projects />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading projects...')).not.toBeInTheDocument();
    });
    
    // Verify error message is displayed
    expect(screen.getByText('Failed to load projects. Please try again later.')).toBeInTheDocument();
    
    // Verify error is logged
    expect(console.error).toHaveBeenCalledWith('Failed to fetch projects:', expect.any(Error));
  });
});