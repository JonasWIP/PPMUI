'use client';

import { useState, useEffect } from 'react';
import { ProjectsService } from '@/lib/generated/api/services/ProjectsService';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * Example component demonstrating the use of the Projects API client
 */
export default function ProjectsApiExample() {
  const [projects, setProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // The API key is automatically set from environment variables
      // You can override it if needed with: projectsApi.setApiKey('custom-api-key');
      
      // Call the Projects API to list all projects
      const response = await ProjectsService.getProjects();
      setProjects(response.directories || []);
    } catch (err) {
      // Handle API errors
      if (err instanceof ApiError) {
        setError(`API Error (${err.status}): ${err.message}`);
      } else {
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Projects API Example</CardTitle>
        <CardDescription>
          This example demonstrates using the generated Projects API client
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Show error if any */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Show loading state */}
        {loading ? (
          <div className="py-8 text-center">Loading projects...</div>
        ) : (
          <>
            <h3 className="text-lg font-medium mb-2">Available Projects:</h3>
            {projects.length > 0 ? (
              <ul className="list-disc pl-6 space-y-1">
                {projects.map((project) => (
                  <li key={project}>{project}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No projects found.</p>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={fetchProjects}
          disabled={loading}
        >
          Refresh Projects
        </Button>
        
        {/* This button would typically be connected to a form or modal */}
        <Button disabled={loading}>Create New Project</Button>
      </CardFooter>
    </Card>
  );
}