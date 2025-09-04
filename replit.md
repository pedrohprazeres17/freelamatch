# Overview

FreelaMatch is a fullstack freelancer management application that provides complete CRUD operations for managing freelancer profiles. The application is built with a React frontend using TypeScript and modern UI components, while the backend uses Node.js/Express as a proxy server. The system originally integrated with Airtable as the database backend but is now configured to use PostgreSQL through Drizzle ORM. The app features a responsive design with a sunset theme (orange → amber → gold gradients) and includes search functionality, modal-based editing, and secure credential management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: Comprehensive component library built on Radix UI primitives with shadcn/ui styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod schema validation for type-safe form management
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design

## Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database Integration**: Drizzle ORM configured for PostgreSQL (with Neon Database serverless support)
- **API Design**: RESTful endpoints following standard HTTP conventions (GET, POST, PATCH, DELETE)
- **Proxy Pattern**: Server acts as a secure proxy to protect database credentials from frontend exposure
- **Development Tools**: Hot module replacement with Vite integration for seamless development experience

## Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle ORM
- **Schema Definition**: Centralized schema in `shared/schema.ts` with Zod validation
- **Migration Management**: Drizzle Kit for database schema migrations
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios

## Authentication and Authorization
- **Credential Management**: Environment variables for sensitive data (DATABASE_URL, AIRTABLE tokens)
- **Security Measures**: Server-side credential handling with no sensitive data exposed to client
- **Session Handling**: Express session configuration ready for authentication implementation

## External Dependencies
- **Database**: PostgreSQL with Neon Database serverless integration
- **Legacy Integration**: Airtable API support maintained for backward compatibility
- **Development Platform**: Replit-optimized with specific plugins and configuration
- **UI Framework**: Extensive Radix UI component ecosystem for accessible, unstyled components
- **Build System**: Vite with React plugin, TypeScript support, and custom path aliases
- **Validation**: Zod for runtime type checking and schema validation across the application stack