'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/apiClient';
import { ApiError } from '@/lib/api';
import {
  ChatService,
  ProjectsService,
  GitHubService,
  OpenAPI
} from '@/lib/generated/api';
import {
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
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

// Define types for API endpoints and parameters
type ApiEndpoint = {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  tag: string;
  summary: string;
  description: string;
  parameters: ApiParameter[];
  requestBody?: ApiRequestBody;
};

type ApiParameter = {
  name: string;
  in: 'path' | 'query' | 'header';
  required: boolean;
  description: string;
  type: string;
  example?: string;
};

type ApiRequestBody = {
  required: boolean;
  content: {
    [key: string]: {
      schema: {
        type?: string;
        properties?: Record<string, {
          type?: string;
          example?: unknown;
          properties?: Record<string, unknown>;
          items?: unknown;
        }>;
      };
    };
  };
};

// Define types for API responses and JSON parsing
type ApiResponse = Record<string, unknown>;
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export default function ApiTestPage() {
  const { isLoading, user } = useAuth();
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [activeTag, setActiveTag] = useState<string>('');
  const [activeEndpoint, setActiveEndpoint] = useState<ApiEndpoint | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Form states for parameters and request body
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [requestBodyValue, setRequestBodyValue] = useState<string>('{}');
  
  // Helper function to format JSON for display
  const formatJson = (data: ApiResponse | null) => {
    try {
      // Special handling for HTML or raw content
      if (data && typeof data === 'object' && ('_type' in data)) {
        const type = data._type;
        if (type === 'html' || type === 'raw' || type === 'error') {
          // Format HTML/raw content in a more readable way
          return JSON.stringify(data, null, 2);
        }
      }
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error formatting JSON:', error);
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

  // Load API endpoints from the OpenAPI specification
  useEffect(() => {
    const loadEndpoints = async () => {
      try {
        // Initialize API client with proxy
        await apiClient.initialize(false);
        
        // Override the OpenAPI.BASE to use our proxy
        // This ensures all API calls go through our proxy
        OpenAPI.BASE = '/api/proxy';
        
        // Create endpoints dynamically from the service classes
        const realEndpoints: ApiEndpoint[] = [];
        
        // Chat API endpoints
        realEndpoints.push({
          path: '/api/chat/tasks',
          method: 'POST',
          tag: 'Chat',
          summary: 'Create a new chat task',
          description: 'Create a new chat task with the provided configuration and message',
          parameters: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    configuration: {
                      type: 'object',
                      properties: {
                        model: { type: 'string', example: 'claude-3-opus-20240229' },
                        temperature: { type: 'number', example: 0.7 },
                        maxTokens: { type: 'number', example: 2000 },
                        apiKey: { type: 'string', example: 'your-api-key' },
                        apiEndpoint: { type: 'string', example: 'https://api.anthropic.com' }
                      }
                    },
                    text: { type: 'string', example: 'Hello, how can you help me today?' },
                    images: { type: 'array', items: { type: 'string' }, example: [] },
                    newTab: { type: 'boolean', example: true }
                  }
                }
              }
            }
          }
        });
        
        realEndpoints.push({
          path: '/api/chat/tasks',
          method: 'GET',
          tag: 'Chat',
          summary: 'Get all chat tasks',
          description: 'Get a list of all chat tasks',
          parameters: []
        });
        
        realEndpoints.push({
          path: '/api/chat/tasks/{taskId}',
          method: 'GET',
          tag: 'Chat',
          summary: 'Get chat task details',
          description: 'Get details for a specific chat task',
          parameters: [
            {
              name: 'taskId',
              in: 'path',
              required: true,
              description: 'ID of the chat task',
              type: 'string',
              example: 'task-123456'
            }
          ]
        });
        
        realEndpoints.push({
          path: '/api/chat/tasks/{taskId}/resume',
          method: 'PUT',
          tag: 'Chat',
          summary: 'Resume a chat task',
          description: 'Resume a previously created chat task',
          parameters: [
            {
              name: 'taskId',
              in: 'path',
              required: true,
              description: 'ID of the chat task to resume',
              type: 'string',
              example: 'task-123456'
            }
          ]
        });
        
        realEndpoints.push({
          path: '/api/chat/tasks/{taskId}/messages',
          method: 'POST',
          tag: 'Chat',
          summary: 'Send a message to a task',
          description: 'Send a message to an existing chat task',
          parameters: [
            {
              name: 'taskId',
              in: 'path',
              required: true,
              description: 'ID of the chat task',
              type: 'string',
              example: 'task-123456'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    text: { type: 'string', example: 'Hello, how can you help me today?' },
                    images: { type: 'array', items: { type: 'string' }, example: [] }
                  }
                }
              }
            }
          }
        });
        
        realEndpoints.push({
          path: '/api/chat/config',
          method: 'GET',
          tag: 'Chat',
          summary: 'Get the current configuration',
          description: 'Get the current configuration settings for the chat',
          parameters: []
        });
        
        // Projects API endpoints
        realEndpoints.push({
          path: '/projects',
          method: 'GET',
          tag: 'Projects',
          summary: 'List all projects',
          description: 'List all projects in the projects directory',
          parameters: []
        });
        
        realEndpoints.push({
          path: '/projects/{projectName}',
          method: 'GET',
          tag: 'Projects',
          summary: 'Get project details',
          description: 'Get details for a specific project',
          parameters: [
            {
              name: 'projectName',
              in: 'path',
              required: true,
              description: 'Name of the project',
              type: 'string',
              example: 'my-project'
            }
          ]
        });
        
        // GitHub API endpoints
        realEndpoints.push({
          path: '/projects/fork',
          method: 'POST',
          tag: 'GitHub',
          summary: 'Fork a repository',
          description: 'Fork a repository to the user\'s GitHub account and clone it',
          parameters: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    repositoryUrl: { type: 'string', example: 'https://github.com/user/repo' },
                    projectName: { type: 'string', example: 'my-fork' },
                    organization: { type: 'string', example: 'my-org' }
                  }
                }
              }
            }
          }
        });
        
        setEndpoints(realEndpoints);
        
        // Set initial active tag and endpoint
        if (realEndpoints.length > 0) {
          const tags = [...new Set(realEndpoints.map(e => e.tag))];
          setActiveTag(tags[0]);
          setActiveEndpoint(realEndpoints.find(e => e.tag === tags[0]) || null);
        }
      } catch (err) {
        console.error('Error loading API endpoints:', err);
        setError('Failed to load API endpoints');
      }
    };
    
    loadEndpoints();
  }, []);
  
  // Reset parameter values when active endpoint changes
  useEffect(() => {
    if (activeEndpoint) {
      // Initialize parameter values with examples if available
      const initialParams: Record<string, string> = {};
      activeEndpoint.parameters.forEach(param => {
        initialParams[param.name] = param.example || '';
      });
      setParamValues(initialParams);
      
      // Initialize request body with example if available
      if (activeEndpoint.requestBody?.content?.['application/json']?.schema) {
        try {
          const schema = activeEndpoint.requestBody.content['application/json'].schema;
          const exampleBody: Record<string, unknown> = {};
          
          // Try to build an example from the schema
          if (schema.properties) {
            Object.entries(schema.properties).forEach(([key, prop]: [string, {
              type?: string;
              example?: unknown;
              properties?: Record<string, unknown>;
            }]) => {
              if (prop.example !== undefined) {
                exampleBody[key] = prop.example;
              } else if (prop.type === 'string') {
                exampleBody[key] = '';
              } else if (prop.type === 'number') {
                exampleBody[key] = 0;
              } else if (prop.type === 'boolean') {
                exampleBody[key] = false;
              } else if (prop.type === 'object' && prop.properties) {
                exampleBody[key] = {};
              } else if (prop.type === 'array') {
                exampleBody[key] = [];
              }
            });
          }
          
          setRequestBodyValue(JSON.stringify(exampleBody, null, 2));
        } catch {
          setRequestBodyValue('{}');
        }
      } else {
        setRequestBodyValue('{}');
      }
    }
  }, [activeEndpoint]);
  
  // Execute API call based on active endpoint
  const executeApiCall = async () => {
    if (!activeEndpoint) return;
    
    setIsExecuting(true);
    setError(null);
    setResult(null);
    
    try {
      // Allow testing without authentication in development mode
      if (!user) {
        console.log("No authenticated user, proceeding in development mode");
      }
      
      // Initialize API client
      await apiClient.initialize(false);
      
      // Parse request body if needed
      let requestBody: Record<string, unknown> = {};
      if (activeEndpoint.requestBody && (activeEndpoint.method === 'POST' || activeEndpoint.method === 'PUT')) {
        requestBody = parseJson(requestBodyValue, {});
      }
      
      // Replace path parameters
      let url = activeEndpoint.path;
      const pathParams: Record<string, string> = {};
      const queryParams: Record<string, string> = {};
      
      // Extract path and query parameters
      activeEndpoint.parameters.forEach(param => {
        const value = paramValues[param.name] || '';
        
        if (param.in === 'path') {
          pathParams[param.name] = value;
          url = url.replace(`{${param.name}}`, encodeURIComponent(value));
        } else if (param.in === 'query') {
          queryParams[param.name] = value;
        }
      });
      
      let response;
      
      // Execute the appropriate API call based on the endpoint
      switch (activeEndpoint.path) {
        // Chat API endpoints
        case '/api/chat/tasks':
          if (activeEndpoint.method === 'POST') {
            response = await ChatService.postApiChatTasks({ 
              requestBody: requestBody as {
                configuration?: {
                  model?: string;
                  temperature?: number;
                  maxTokens?: number;
                  apiKey?: string;
                  apiEndpoint?: string;
                };
                text?: string;
                images?: string[];
                newTab?: boolean;
              }
            });
          } else if (activeEndpoint.method === 'GET') {
            response = await ChatService.getApiChatTasks();
          }
          break;
          
        case '/api/chat/tasks/{taskId}':
          if (activeEndpoint.method === 'GET') {
            response = await ChatService.getApiChatTasks1({ taskId: pathParams.taskId });
          }
          break;
          
        case '/api/chat/tasks/{taskId}/resume':
          if (activeEndpoint.method === 'PUT') {
            response = await ChatService.putApiChatTasksResume({ taskId: pathParams.taskId });
          }
          break;
          
        case '/api/chat/tasks/{taskId}/messages':
          if (activeEndpoint.method === 'POST') {
            response = await ChatService.postApiChatTasksMessages({ 
              taskId: pathParams.taskId, 
              requestBody: requestBody as {
                text?: string;
                images?: string[];
              }
            });
          }
          break;
          
        case '/api/chat/config':
          if (activeEndpoint.method === 'GET') {
            response = await ChatService.getApiChatConfig();
          }
          break;
          
        // Projects API endpoints
        case '/projects':
          if (activeEndpoint.method === 'GET') {
            response = await ProjectsService.getProjects();
          }
          break;
          
        case '/projects/{projectName}':
          if (activeEndpoint.method === 'GET') {
            response = await ProjectsService.getProjectsConfig({ projectName: pathParams.projectName });
          }
          break;
          
        // GitHub API endpoints
        case '/projects/fork':
          if (activeEndpoint.method === 'POST') {
            response = await GitHubService.postProjectsFork({ 
              requestBody: requestBody as {
                repositoryUrl: string;
                projectName?: string;
                organization?: string;
              }
            });
          }
          break;
          
        default:
          throw new Error(`Endpoint ${activeEndpoint.path} not implemented`);
      }
      
      // Set the result from the API response
      setResult(response || {});
      
      console.log('API call successful:', response);
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
  
  // Handle parameter value change
  const handleParamChange = (name: string, value: string) => {
    setParamValues(prev => ({
      ...prev,
      [name]: value
    }));
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
  
  // Get unique tags from endpoints
  const tags = [...new Set(endpoints.map(e => e.tag))];
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">API Test Console</h1>
        {user && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            <p className="font-semibold">User: {user.email}</p>
          </div>
        )}
      </div>
      
      <Alert className="mb-6">
        <AlertTitle>API Test Interface</AlertTitle>
        <AlertDescription>
          This console allows you to test the API endpoints. Select an endpoint, provide parameters, and execute the request to see the response.
          {!user && (
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
              <strong>Note:</strong> You are not logged in. API calls will be simulated. Please log in to make real API calls.
            </div>
          )}
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>API Categories</CardTitle>
              <CardDescription>Select an API category</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTag} 
                onValueChange={setActiveTag}
                orientation="vertical"
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto items-stretch">
                  {tags.map(tag => (
                    <TabsTrigger key={tag} value={tag}>{tag}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Endpoints</CardTitle>
              <CardDescription>Select an endpoint to test</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                orientation="vertical"
                className="w-full"
              >
                <TabsList className="flex flex-col h-auto items-stretch">
                  {endpoints
                    .filter(endpoint => endpoint.tag === activeTag)
                    .map((endpoint) => (
                      <TabsTrigger 
                        key={`${endpoint.path}-${endpoint.method}`}
                        value={`${endpoint.path}-${endpoint.method}`}
                        onClick={() => setActiveEndpoint(endpoint)}
                        className={activeEndpoint?.path === endpoint.path && activeEndpoint?.method === endpoint.method ? 'bg-primary/10' : ''}
                      >
                        <span className="font-mono text-xs mr-2 px-1.5 py-0.5 rounded bg-muted">
                          {endpoint.method}
                        </span>
                        <span className="truncate text-left">
                          {endpoint.summary}
                        </span>
                      </TabsTrigger>
                    ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {activeEndpoint ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                    {activeEndpoint.method}
                  </span>
                  <CardTitle className="font-mono text-sm md:text-base overflow-auto">
                    {activeEndpoint.path}
                  </CardTitle>
                </div>
                <CardDescription>
                  {activeEndpoint.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); executeApiCall(); }} className="space-y-4">
                  {/* Path and Query Parameters */}
                  {activeEndpoint.parameters.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Parameters</h3>
                      {activeEndpoint.parameters.map(param => (
                        <div key={param.name} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={param.name} className="flex-grow">
                              {param.name}
                              {param.required && <span className="text-red-500 ml-1">*</span>}
                              <span className="text-xs text-muted-foreground ml-2">({param.in})</span>
                            </Label>
                            <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {param.type}
                            </span>
                          </div>
                          <Input 
                            id={param.name} 
                            value={paramValues[param.name] || ''} 
                            onChange={(e) => handleParamChange(param.name, e.target.value)} 
                            placeholder={param.description}
                            required={param.required}
                          />
                          {param.description && (
                            <p className="text-xs text-muted-foreground">{param.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Request Body */}
                  {activeEndpoint.requestBody && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Request Body</h3>
                      <Textarea 
                        value={requestBodyValue} 
                        onChange={(e) => setRequestBodyValue(e.target.value)} 
                        rows={10}
                        className="font-mono text-sm"
                        placeholder="Enter request body as JSON"
                      />
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={isExecuting}
                      className="w-full"
                    >
                      {isExecuting ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Executing...
                        </>
                      ) : (
                        <>Execute Request</>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <p>Select an endpoint from the list to test</p>
              </CardContent>
            </Card>
          )}
          
          {/* Results Section */}
          {(result || error) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Response</CardTitle>
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
                        <pre className="bg-muted p-4 rounded-md overflow-auto text-sm font-mono">
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
    </div>
  );
}