# Generated API Client

This directory contains TypeScript files generated from the OpenAPI specification.

## How to Generate

Run the following command to generate the API client:

```bash
npm run generate:api-client
```

This will:
1. Read the OpenAPI specification from `developmentApi.json`
2. Generate TypeScript interfaces and API client code in this directory
3. Create type-safe models and services based on the API specification

## Generated Files

After running the generation script, this directory will contain:

- `models/` - TypeScript interfaces for request and response models
- `services/` - TypeScript service classes for API endpoints
- `core/` - Core utilities for the API client

## Usage

Do not edit the generated files directly as they will be overwritten when the generation script is run again.

Instead, use the wrapper client in `lib/projectsApi.ts` which provides a strongly-typed interface to the API that integrates with the project's existing API utility patterns.

## Documentation

For more information on how to use the Projects API client, see the [Projects API Client documentation](../../docs/projects-api-client.md).