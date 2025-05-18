# Projects API Client (DEPRECATED)

> **IMPORTANT**: The Development API and Projects API client have been deprecated. This document is kept for historical reference only.

## Overview

The Projects API client previously provided an interface to interact with the project management API endpoints. It has been replaced with a mock implementation that returns placeholder data.

## Current Implementation

The current implementation in `lib/projectsApi.ts` is a mock that returns placeholder data. It maintains the same interface as the original client but does not make actual API calls.

### Example Usage

```typescript
import { projectsApi } from '@/lib/projectsApi';

// This will return placeholder data
const projects = await projectsApi.listProjects();
```

## UI Components

UI components that previously used the Projects API have been updated to:

1. Display placeholder data
2. Show notices about deprecated functionality
3. Disable interactive features that would have triggered API calls

## Removal of Development API

The Development API has been completely removed from the codebase, including:

1. The OpenAPI specification file (`developmentApi.json`)
2. The generated API client code (`lib/generated/`)
3. The API routes that proxied to the Development API (`app/api/projects/`)
4. The API client generation script in `package.json`

The mock implementation in `lib/projectsApi.ts` maintains the same interface as the original client to minimize disruption to the codebase, but it returns placeholder data instead of making actual API calls.