# SupaNext Template

A modern,  production-ready template for building web applications with Next.js and Supabase, featuring TypeScript and Tailwind CSS.

## Overview

SupaNext Template provides a solid foundation for developing web applications with:

- **Next.js 14+** with App Router for server components, streaming, and more
- **Supabase** for authentication, database, and edge functions
- **TypeScript** for type safety and improved developer experience
- **Tailwind CSS** with a customizable multi-theme system
- **shadcn/ui** components for beautiful, accessible UI elements
- **Testing** framework with Jest and React Testing Library

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Documentation Home](./docs/README.md) - Overview of all documentation
- [Project Overview](./docs/project-overview.md) - Introduction to the project structure and technologies
- [Quick Start Guide](./docs/quick-start.md) - Set up your development environment

### Core Technologies

- [Styling Guide](./docs/styling-guide.md) - How to use Tailwind CSS and the styling system
- [Theme System Guide](./docs/theme-system-guide.md) - Customize the multi-theme capabilities
- [shadcn/ui Guide](./docs/shadcn-ui-guide.md) - Use and customize UI components
- [Server vs. Client Rendering](./docs/ssr-guide.md) - Understanding Next.js rendering strategies

### Development Guides

- [Authentication Guide](./docs/auth-guide.md) - Working with Supabase authentication
- [API Integration](./docs/api-guide.md) - Using Supabase data and Next.js API routes
- [Testing Guide](./docs/testing-guide.md) - Writing and running tests

## Quick Start

### Creating Your Project

```bash
# Using npx create-supabase-next
npx create-supabase-next <project-name>

# Or with custom template
npx create-supabase-next --template <template-url>
```

### Local Setup

1. **Start Supabase** (ensure Docker is running):
   ```bash
   npm run supabase:start
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-start>
   ```

3. **Start Next.js Development Server**:
   ```bash
   npm run dev
   ```

4. **Access Local Development**:
   - Next.js: http://localhost:3000
   - Supabase Studio: http://127.0.0.1:54323

### Deployment

> **Important Note:** Steps 2-5 below are about gathering different secrets that all need to be added to your GitHub repository as environment secrets. You'll be collecting these values from different sources but adding them all to the same place in GitHub.

1. **Commit and push to GitHub**

2. **Set up GitHub environment for secrets**:
   - Go to Settings → Secrets and Variables → Actions
   - Under Manage environment secrets → production → add environment secret

3. **Create a new Supabase project and gather secrets**:
   - Create a project and copy the database password
   - Add to GitHub secrets: `SUPABASE_DB_PASSWORD`
   - Open the project, click on "Connect" in the navbar
   - Copy credentials from App-Frameworks section for these GitHub secrets:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     YOUR_PROJECT_REF (your Supabase project ID)
     ```

4. **Create Supabase Access Token for GitHub secrets**:
   - Go to Account → Account settings → Access tokens
   - Create a new token (name it "github" or similar) 
   - Add to GitHub secrets: `SUPABASE_ACCESS_TOKEN`

5. **Setup Vercel Token for GitHub secrets**:
   - Go to https://vercel.com/account/settings/tokens
   - Create a new token (name it "github" or similar)
   - Add to GitHub secrets: `VERCEL_TOKEN`

6. **Deploy**:
   - After adding all GitHub secrets, commit changes to trigger the GitHub workflow
   - After it finishes, your site will be live at the Vercel URL

7. **Configure Auth Redirect**:
   - Set your Vercel live URL in your Supabase project dashboard as the redirect link for authentication

### Connect Local and Remote Environments

To connect your local Supabase instance with the public one, use the npm tasks in package.json:

```bash
# Link to your Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF
```

## Database Migrations

```bash
# Create a new migration
npx supabase migration new migration_name

# Apply migrations
npx supabase db reset  # For development (destructive)
# Or
npx supabase db push   # For production
```

## Supabase Edge Functions

This template includes support for [Supabase Edge Functions](https://supabase.com/docs/guides/functions).

```bash
# Serve all functions locally
npm run supabase:functions:serve

# Create a new function
npm run supabase:functions:new my-function-name

# Deploy all functions
npm run supabase:functions:deploy
```

## Troubleshooting

### Supabase CLI Issues
```bash
# Update Supabase CLI to latest version
npm install -g supabase@latest
```

### GitHub Workflow Deployment Issues
- Verify all secrets are correctly set in GitHub repository
- Ensure your database password doesn't contain special characters
- Confirm your project reference matches exactly with your Supabase project ID
- Test linking process locally: `npx supabase link --project-ref YOUR_PROJECT_REF`

### Authentication Setup
1. Open Supabase Dashboard → your project
2. Go to Settings → Auth → URL Configuration
3. Update "Site URL" with your production domain


## License

MIT
