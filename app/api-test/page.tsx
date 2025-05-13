'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi } from '@/lib/projectsApi';
import { ApiError } from '@/lib/api';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

export default function ApiTestPage() {
  const { isAdmin, isLoading, user } = useAuth();
  const [activeEndpoint, setActiveEndpoint] = useState('listProjects');
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Define types for API responses and JSON parsing
  type ApiResponse = Record<string, unknown>;
  type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
  
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form states for each endpoint
  const [projectName, setProjectName] = useState('');
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [branch, setBranch] = useState('');
  const [instructions, setInstructions] = useState('');
  const [forkMode, setForkMode] = useState(false);
  const [initGit, setInitGit] = useState(true);
  const [configJson, setConfigJson] = useState('{\n  "repoUrl": "",\n  "isTemplate": false,\n  "projectName": "",\n  "deployment": {\n    "dev": []\n  },\n  "previewUrl": "",\n  "liveUrl": ""\n}');
  const [commandsJson, setCommandsJson] = useState('[]');

  // Helper function to format JSON for display
  const formatJson = (data: ApiResponse | null) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  // Helper function to parse JSON input
  const parseJson = <T extends JsonValue>(jsonString: string, defaultValue: T): T => {
    try {
      return JSON.parse(jsonString);
    } catch (e: unknown) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
      return defaultValue;
    }
  };

  // Execute API call based on active endpoint
  const executeApiCall = async () => {
    setIsExecuting(true);
    setError(null);
    setResult(null);
    
    try {
      let response;
      
      switch (activeEndpoint) {
        case 'listProjects':
          response = await projectsApi.listProjects();
          break;
          
        case 'initializeProject':
          response = await projectsApi.initializeProject(
            projectName,
            {
              commands: parseJson<string[]>(commandsJson, [] as string[]),
              config: parseJson<Record<string, JsonValue>>(configJson, {} as Record<string, JsonValue>),
              initGit
            }
          );
          break;
          
        case 'deployProject':
          response = await projectsApi.deployProject(
            projectName,
            {
              commitMessage,
              branch: branch || undefined
            }
          );
          break;
          
        case 'startProject':
          response = await projectsApi.startProject(projectName);
          break;
          
        case 'stopProject':
          response = await projectsApi.stopProject(projectName);
          break;
          
        case 'cloneRepository':
          response = await projectsApi.cloneRepository({
            repositoryUrl,
            projectName: projectName || undefined,
            forkMode
          });
          break;
          
        case 'createProject':
          response = await projectsApi.createProject(
            projectName,
            instructions || undefined
          );
          break;
          
        case 'deleteProject':
          response = await projectsApi.deleteProject(projectName);
          break;
          
        case 'getProjectConfig':
          response = await projectsApi.getProjectConfig(projectName);
          break;
          
        case 'updateProjectConfig':
          response = await projectsApi.updateProjectConfig(
            projectName,
            parseJson<Record<string, JsonValue>>(configJson, {} as Record<string, JsonValue>)
          );
          break;
          
        default:
          setError('Unknown endpoint selected');
          return;
      }
      
      setResult(response);
    } catch (err) {
      console.error('Error executing API call:', err);
      let errorMessage = 'Unknown error occurred';
      
      if (err instanceof ApiError) {
        errorMessage = `API Error (${err.status}): ${err.message}`;
      } else if (err instanceof Error) {
        errorMessage = `Error: ${err.message}`;
      } else {
        errorMessage = `Unexpected error: ${String(err)}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  };

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">API Test Console</h1>
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">API Test Console</h1>
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This page is only accessible to administrators. Please contact your system administrator if you need access.
          </AlertDescription>
        </Alert>
        
        {user && (
          <div className="bg-muted p-4 rounded">
            <p>Logged in as: {user.email}</p>
            <p>Your role does not have permission to access this page.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects API Test Console</h1>
        {user && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            <p className="font-semibold">Admin: {user.email}</p>
          </div>
        )}
      </div>
      
      <Alert className="mb-6">
        <AlertTitle>Admin Only Access</AlertTitle>
        <AlertDescription>
          This console provides full access to the Projects API. All operations require admin privileges.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>Select an endpoint to test</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                defaultValue="listProjects" 
                orientation="vertical"
                onValueChange={setActiveEndpoint}
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto items-stretch">
                  <TabsTrigger value="listProjects">List Projects</TabsTrigger>
                  <TabsTrigger value="initializeProject">Initialize Project</TabsTrigger>
                  <TabsTrigger value="deployProject">Deploy Project</TabsTrigger>
                  <TabsTrigger value="startProject">Start Project</TabsTrigger>
                  <TabsTrigger value="stopProject">Stop Project</TabsTrigger>
                  <TabsTrigger value="cloneRepository">Clone Repository</TabsTrigger>
                  <TabsTrigger value="createProject">Create Project</TabsTrigger>
                  <TabsTrigger value="deleteProject">Delete Project</TabsTrigger>
                  <TabsTrigger value="getProjectConfig">Get Project Config</TabsTrigger>
                  <TabsTrigger value="updateProjectConfig">Update Project Config</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeEndpoint === 'listProjects' && 'List Projects'}
                {activeEndpoint === 'initializeProject' && 'Initialize Project'}
                {activeEndpoint === 'deployProject' && 'Deploy Project'}
                {activeEndpoint === 'startProject' && 'Start Project'}
                {activeEndpoint === 'stopProject' && 'Stop Project'}
                {activeEndpoint === 'cloneRepository' && 'Clone Repository'}
                {activeEndpoint === 'createProject' && 'Create Project'}
                {activeEndpoint === 'deleteProject' && 'Delete Project'}
                {activeEndpoint === 'getProjectConfig' && 'Get Project Config'}
                {activeEndpoint === 'updateProjectConfig' && 'Update Project Config'}
              </CardTitle>
              <CardDescription>
                {activeEndpoint === 'listProjects' && 'List all projects in the projects directory'}
                {activeEndpoint === 'initializeProject' && 'Initialize a project with provided configuration and commands'}
                {activeEndpoint === 'deployProject' && 'Deploy a project by committing and pushing changes'}
                {activeEndpoint === 'startProject' && 'Start a project by running the development commands'}
                {activeEndpoint === 'stopProject' && 'Stop a project by terminating running processes'}
                {activeEndpoint === 'cloneRepository' && 'Clone or fork a repository into the projects folder'}
                {activeEndpoint === 'createProject' && 'Create a new project with given instructions and name'}
                {activeEndpoint === 'deleteProject' && 'Delete a project from the projects folder'}
                {activeEndpoint === 'getProjectConfig' && 'Get the configuration for a specific project'}
                {activeEndpoint === 'updateProjectConfig' && 'Update the configuration for a specific project'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); executeApiCall(); }} className="space-y-4">
                {/* List Projects - No parameters needed */}
                {activeEndpoint === 'listProjects' && (
                  <div className="text-sm text-muted-foreground">
                    This endpoint doesn&apos;t require any parameters.
                  </div>
                )}
                
                {/* Initialize Project */}
                {activeEndpoint === 'initializeProject' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input 
                        id="projectName" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)} 
                        placeholder="my-project"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="commands">Commands (JSON array)</Label>
                      <Textarea 
                        id="commands" 
                        value={commandsJson} 
                        onChange={(e) => setCommandsJson(e.target.value)} 
                        placeholder='["npm install", "npm run build"]'
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="config">Configuration (JSON object)</Label>
                      <Textarea 
                        id="config" 
                        value={configJson} 
                        onChange={(e) => setConfigJson(e.target.value)} 
                        rows={8}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="initGit" 
                        checked={initGit} 
                        onCheckedChange={setInitGit} 
                      />
                      <Label htmlFor="initGit">Initialize Git Repository</Label>
                    </div>
                  </>
                )}
                
                {/* Deploy Project */}
                {activeEndpoint === 'deployProject' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input 
                        id="projectName" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)} 
                        placeholder="my-project"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="commitMessage">Commit Message</Label>
                      <Input 
                        id="commitMessage" 
                        value={commitMessage} 
                        onChange={(e) => setCommitMessage(e.target.value)} 
                        placeholder="Update project files"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch (optional)</Label>
                      <Input 
                        id="branch" 
                        value={branch} 
                        onChange={(e) => setBranch(e.target.value)} 
                        placeholder="main"
                      />
                    </div>
                  </>
                )}
                
                {/* Start Project */}
                {activeEndpoint === 'startProject' && (
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input 
                      id="projectName" 
                      value={projectName} 
                      onChange={(e) => setProjectName(e.target.value)} 
                      placeholder="my-project"
                      required
                    />
                  </div>
                )}
                
                {/* Stop Project */}
                {activeEndpoint === 'stopProject' && (
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input 
                      id="projectName" 
                      value={projectName} 
                      onChange={(e) => setProjectName(e.target.value)} 
                      placeholder="my-project"
                      required
                    />
                  </div>
                )}
                
                {/* Clone Repository */}
                {activeEndpoint === 'cloneRepository' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="repositoryUrl">Repository URL</Label>
                      <Input 
                        id="repositoryUrl" 
                        value={repositoryUrl} 
                        onChange={(e) => setRepositoryUrl(e.target.value)} 
                        placeholder="https://github.com/username/repo.git"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name (optional)</Label>
                      <Input 
                        id="projectName" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)} 
                        placeholder="my-project"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="forkMode" 
                        checked={forkMode} 
                        onCheckedChange={setForkMode} 
                      />
                      <Label htmlFor="forkMode">Fork Mode</Label>
                    </div>
                  </>
                )}
                
                {/* Create Project */}
                {activeEndpoint === 'createProject' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input 
                        id="projectName" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)} 
                        placeholder="my-project"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions (optional)</Label>
                      <Textarea 
                        id="instructions" 
                        value={instructions} 
                        onChange={(e) => setInstructions(e.target.value)} 
                        placeholder="Create a React application with TypeScript"
                        rows={4}
                      />
                    </div>
                  </>
                )}
                
                {/* Delete Project */}
                {activeEndpoint === 'deleteProject' && (
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input 
                      id="projectName" 
                      value={projectName} 
                      onChange={(e) => setProjectName(e.target.value)} 
                      placeholder="my-project"
                      required
                    />
                    <p className="text-destructive text-sm mt-2">
                      Warning: This operation will permanently delete the project.
                    </p>
                  </div>
                )}
                
                {/* Get Project Config */}
                {activeEndpoint === 'getProjectConfig' && (
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input 
                      id="projectName" 
                      value={projectName} 
                      onChange={(e) => setProjectName(e.target.value)} 
                      placeholder="my-project"
                      required
                    />
                  </div>
                )}
                
                {/* Update Project Config */}
                {activeEndpoint === 'updateProjectConfig' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input 
                        id="projectName" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)} 
                        placeholder="my-project"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="config">Configuration (JSON object)</Label>
                      <Textarea 
                        id="config" 
                        value={configJson} 
                        onChange={(e) => setConfigJson(e.target.value)} 
                        rows={8}
                      />
                    </div>
                  </>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
              >
                Clear Results
              </Button>
              <Button 
                type="button" 
                onClick={executeApiCall} 
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <>
                    <span className="mr-2 animate-spin">⟳</span>
                    Executing...
                  </>
                ) : 'Execute API Call'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Results Section */}
          {(result || error) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>API Response</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                
                {result && (
                  <Accordion type="single" collapsible defaultValue="result">
                    <AccordionItem value="result">
                      <AccordionTrigger>Response Data</AccordionTrigger>
                      <AccordionContent>
                        <pre className="bg-muted p-4 rounded overflow-auto max-h-96">
                          {formatJson(result)}
                        </pre>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <Separator className="my-8" />
      
      <div className="text-sm text-muted-foreground">
        <p>This API Test Console is only accessible to administrators.</p>
        <p>All API calls are authenticated and require appropriate permissions.</p>
      </div>
    </div>
  );
}