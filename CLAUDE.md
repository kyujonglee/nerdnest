# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Development Server
```bash
npm run dev  # Uses Next.js with Turbopack for faster rebuilds
```
The development server runs on `http://localhost:3000`

### Building and Running Production
```bash
npm run build  # Build the production application
npm run start  # Start the production server
```

### Code Quality
```bash
npm run lint  # Run ESLint for code quality checks
```

## Architecture Overview

### Application Structure
This is a **Next.js 15** application using the App Router architecture with the following tech stack:
- **UI Framework**: HeroUI (beta) with Tailwind CSS v4
- **State Management**: React Query (TanStack Query) for server state
- **Authentication**: NextAuth v5 (beta) with JWT strategy
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom Pretendard font

### Directory Organization
- `/app` - Next.js app router pages and API routes
  - `/api/[...path]` - Proxy route to backend API (handles CORS)
  - `/auth` - Authentication pages (signin/signup)
  - `/boards` - Board-related pages
- `/services` - Feature-specific business logic and components
  - Each service has its own hooks, components, and actions
- `/shared` - Shared utilities and components
  - `/layout` - Header and Footer components
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
- `/lib` - Core application utilities
  - `api-client.ts` - Centralized API client with auth integration
  - `query-client.ts` - React Query configuration

### API Architecture
The application uses a **proxy pattern** for API calls:
1. Frontend calls local Next.js API routes (`/api/*`)
2. API routes proxy to backend (`https://nerdnest.onrender.com`)
3. This pattern solves CORS issues in development

The `ApiClient` class in `/lib/api-client.ts`:
- Handles authentication tokens from NextAuth sessions
- Provides typed HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Includes comprehensive error handling and logging

### Authentication Flow
Uses NextAuth with custom credentials provider:
1. User submits credentials to `/auth/signin`
2. NextAuth validates against backend `/api/members/auth`
3. JWT token stored in session
4. Token automatically attached to API requests via `api-client.ts`

### Component Architecture
- **Providers** (`/app/providers.tsx`): Wraps app with SessionProvider, QueryClientProvider, and HeroUIProvider
- **Feature Services**: Each feature in `/services` is self-contained with its own components and hooks
- **Shared Components**: Reusable UI components in `/shared/components`

### Key Patterns
1. **Custom Hooks**: Business logic encapsulated in `.hooks.ts` files
2. **Server Actions**: NextAuth and form submissions use server actions
3. **Type Safety**: Comprehensive TypeScript types in `/types` and `/shared/types`
4. **Path Aliases**: `@/*` maps to project root for clean imports

## Current Implementation Status

### Completed Features
- User authentication (signup/signin)
- Board listing by category
- Board creation
- Main page with latest/popular posts

### Backend API Endpoints
Base URL: `https://nerdnest.onrender.com`

Key endpoints:
- `POST /api/members` - User registration
- `POST /api/members/auth` - User login
- `GET /api/boards/category/{categoryId}` - Get boards by category
- `GET /api/boards/latest` - Get latest posts
- `GET /api/boards/like` - Get popular posts
- `POST /api/boards` - Create new board post

## Development Notes

### HeroUI Beta
The project uses HeroUI beta components. Be aware of potential breaking changes and check the HeroUI documentation for the latest updates.

### Environment Variables
Required environment variables:
- `AUTH_SECRET` - NextAuth secret for JWT signing
- `NEXT_PUBLIC_API_BASE_URL` - Backend API URL (defaults to `https://nerdnest.onrender.com`)

### TypeScript Configuration
- Strict mode enabled
- Path alias `@/*` configured
- Target: ES2017 for compatibility