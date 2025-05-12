# Projects API Client

This document explains how to use the Projects API client in the PPMUI application.

## Overview

The Projects API client provides a strongly-typed interface to interact with the project management API endpoints defined in the OpenAPI specification (`developmentApi.json`). It integrates with the existing API utility patterns in the project and provides a consistent way to make API calls.

## Setup

### 1. Install Dependencies

The API client generation requires the `openapi-typescript-codegen` package, which has been added to the project's devDependencies.

```bash
npm install
```

### 2. Configure Authentication

The Projects API client uses a bearer token for authentication. This token is automatically loaded from environment variables:

#### Development Environment

1. Create a `.env.local` file in the project root (if it doesn't exist already)
2. Add the following environment variables:

```
NEXT_PUBLIC_PROJECTS_API_URL=http://localhost:2020
NEXT_PUBLIC_PROJECTS_API_TOKEN=jai_kjdImRVdnZaBzKR06qwkT0xCnBHfJ2JLqYeI527U
```

#### Production Environment

For production deployments, set these environment variables in your deployment platform:

- GitHub Actions: Use repository secrets and set them in your workflow files
- Vercel: Configure environment variables in the Vercel dashboard
- Other platforms: Follow the platform-specific instructions for setting environment variables

The default bearer token is `jai_kjdImRVdnZaBzKR06qwkT0xCnBHfJ2JLqYeI527U`, but you should use a different token in production.

### 3. Generate the API Client

To generate the API client from the OpenAPI specification, run:

```bash
npm run generate:api-client
```

This command will:
1. Read the OpenAPI specification from `developmentApi.json`
2. Generate TypeScript interfaces and API client code in `lib/generated/`
3. Create type-safe models and services based on the API specification

The generated code should not be edited directly as it will be overwritten when the command is run again.

## Usage

### Basic Usage

Import the `projectsApi` singleton from the `lib/projectsApi.ts` file:

```typescript
import { projectsApi } from '@/lib/projectsApi';
```

The API key is automatically set from the environment variable `NEXT_PUBLIC_PROJECTS_API_TOKEN`. You only need to manually set the API key if you want to override the environment variable:

```typescript
// Optional: Override the API key from the environment
projectsApi.setApiKey('your-custom-api-key');
```

### Examples

#### List All Projects

```typescript
async function getProjects() {
  try {
    const response = await projectsApi.listProjects();
    console.log('Projects:', response.directories);
    return response.directories;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
}
```

#### Initialize a Project

```typescript
async function initializeProject(projectName: string) {
  try {
    const response = await projectsApi.initializeProject(projectName, {
      commands: ['npm install', 'npm run build'],
      config: {
        repoUrl: 'https://github.com/example/repo.git',
        projectName: projectName,
        deployment: {
          dev: ['npm run dev']
        },
        previewUrl: 'http://localhost:3000',
        liveUrl: 'https://example.com'
      },
      initGit: true
    });
    
    console.log('Project initialized:', response.projectName);
    return response;
  } catch (error) {
    console.error('Failed to initialize project:', error);
    throw error;
  }
}
```

#### Deploy a Project

```typescript
async function deployProject(projectName: string) {
  try {
    const response = await projectsApi.deployProject(projectName, {
      commitMessage: 'Update project files',
      branch: 'main'
    });
    
    console.log('Project deployed:', response.projectName);
    return response;
  } catch (error) {
    console.error('Failed to deploy project:', error);
    throw error;
  }
}
```

#### Start and Stop a Project

```typescript
// Start a project
async function startProject(projectName: string) {
  try {
    const response = await projectsApi.startProject(projectName);
    console.log('Project started:', response.projectName);
    return response;
  } catch (error) {
    console.error('Failed to start project:', error);
    throw error;
  }
}

// Stop a project
async function stopProject(projectName: string) {
  try {
    const response = await projectsApi.stopProject(projectName);
    console.log('Project stopped:', response.projectName);
    return response;
  } catch (error) {
    console.error('Failed to stop project:', error);
    throw error;
  }
}
```

### Error Handling

The Projects API client integrates with the existing error handling in the API utility. Errors are thrown as `ApiError` instances with status codes and messages:

```typescript
import { ApiError } from '@/lib/api';

try {
  await projectsApi.listProjects();
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Handle unauthorized error
      console.error('Authentication required');
    } else if (error.status === 404) {
      // Handle not found error
      console.error('Project not found');
    } else {
      // Handle other API errors
      console.error(`API Error (${error.status}):`, error.message);
    }
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

## Server-Side Usage

For server components or server actions, you can create a new instance of the ProjectsApiClient. The API key will be automatically loaded from environment variables, but you can also set a server-specific API key:

```typescript
import { ProjectsApiClient } from '@/lib/projectsApi';

export async function getProjectsServerAction() {
  const serverProjectsApi = new ProjectsApiClient();
  
  // The API key is automatically set from environment variables
  // You can override it with a server-only environment variable if needed:
  // serverProjectsApi.setApiKey(process.env.PROJECTS_API_SERVER_KEY || '');
  
  try {
    return await serverProjectsApi.listProjects();
  } catch (error) {
    console.error('Server-side API error:', error);
    throw error;
  }
}
```

### Environment Variables for Server-Side

For server-side operations, you can use non-public environment variables:

```
# .env.local (not exposed to the client)
PROJECTS_API_SERVER_KEY=your_server_only_api_key
```

In production, set this environment variable in your deployment platform's settings.

## Updating the API Client

If the OpenAPI specification changes, simply run the generate command again to update the client:

```bash
npm run generate:api-client
```

This will regenerate all the TypeScript interfaces and services based on the updated specification.