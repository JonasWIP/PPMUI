import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Projects from './Projects';

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

  test('displays notice about deprecated functionality', () => {
    render(<Projects />);
    expect(screen.getByText(/Project management functionality has been deprecated/i)).toBeInTheDocument();
  });

  test('displays placeholder projects', () => {
    render(<Projects />);
    
    // Verify placeholder projects are displayed
    expect(screen.getByText('example-project-1')).toBeInTheDocument();
    expect(screen.getByText('example-project-2')).toBeInTheDocument();
    
    // Verify descriptions
    expect(screen.getByText('Example project with placeholder data')).toBeInTheDocument();
    expect(screen.getByText('Another example project with placeholder data')).toBeInTheDocument();
  });

  test('displays project status correctly', () => {
    render(<Projects />);
    
    // Verify status is displayed
    const statusElements = screen.getAllByText('Inactive');
    expect(statusElements.length).toBeGreaterThan(0);
  });

  test('displays templates when templates tab is clicked', async () => {
    render(<Projects />);
    
    // Click on Templates tab
    await userEvent.click(screen.getByText('Templates'));
    
    // Verify template project is displayed
    expect(screen.getByText('template-example')).toBeInTheDocument();
    expect(screen.getByText('Example template project')).toBeInTheDocument();
    
    // Regular projects should not be visible
    expect(screen.queryByText('example-project-1')).not.toBeInTheDocument();
    expect(screen.queryByText('example-project-2')).not.toBeInTheDocument();
  });

  test('displays archived projects when archived tab is clicked', async () => {
    render(<Projects />);
    
    // Click on Archived tab
    await userEvent.click(screen.getByText('Archived'));
    
    // Verify archived project is displayed
    expect(screen.getByText('archived-example')).toBeInTheDocument();
    expect(screen.getByText('Example archived project')).toBeInTheDocument();
    
    // Regular projects should not be visible
    expect(screen.queryByText('example-project-1')).not.toBeInTheDocument();
    expect(screen.queryByText('example-project-2')).not.toBeInTheDocument();
  });

  test('logs debug information', () => {
    render(<Projects />);
    
    // Verify debug logs are called
    expect(console.log).toHaveBeenCalledWith('Active Tab:', 'projects');
    expect(console.log).toHaveBeenCalledWith('Projects State:', expect.any(Array));
    expect(console.log).toHaveBeenCalledWith('Filtered Projects:', expect.any(Array));
    expect(console.log).toHaveBeenCalledWith('Debug - Projects:', expect.any(Object));
  });
});