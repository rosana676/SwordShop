# Sword Shop - Gaming Items Marketplace

## Overview

Sword Shop is a secure marketplace platform for buying and selling gaming items, featuring an escrow-based transaction system. The application provides a gaming-focused user experience with separate interfaces for regular users and administrators. Built with a modern tech stack including React, Express, and PostgreSQL with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query (React Query) for server state management and data fetching

**UI Component System**
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Dark mode as the primary theme
- Gaming-inspired design language with custom fonts (Inter for UI, Rajdhani for headings)
- Component variant system using class-variance-authority

**State Management Strategy**
- React Query handles all server state with disabled refetching by default
- Session-based authentication with custom hooks (useAuth)
- Local component state for UI interactions

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- Session-based authentication using express-session
- RESTful API design pattern
- Custom storage abstraction layer (IStorage interface) for database operations

**Authentication & Authorization**
- Password hashing with bcryptjs
- Session management with HTTP-only cookies
- Role-based access control (regular users vs. admin users)
- Protected routes with middleware and client-side guards

**Database Layer**
- Drizzle ORM for type-safe database queries
- PostgreSQL as the primary database (via Neon serverless)
- Schema-first approach with Zod validation
- Database connection pooling for performance

**API Design Patterns**
- Centralized route registration in `server/routes.ts`
- Request/response logging middleware
- Error handling with try-catch and JSON error responses
- Input validation using Zod schemas from shared types

### External Dependencies

**Database & ORM**
- PostgreSQL (Neon Serverless driver: `@neondatabase/serverless`)
- Drizzle ORM for database operations and migrations
- WebSocket support for database connections

**Authentication & Security**
- bcryptjs for password hashing
- express-session for session management
- connect-pg-simple for PostgreSQL session storage (dependency listed but not yet configured)

**UI Component Libraries**
- Radix UI primitives (@radix-ui/*) for accessible components
- Lucide React for icons
- cmdk for command palette functionality
- date-fns for date formatting

**Development Tools**
- Replit-specific plugins for development environment
- tsx for TypeScript execution
- esbuild for production builds
- Vite plugins for runtime error overlay and development features

**Data Fetching & Forms**
- TanStack Query for async state management
- React Hook Form with Zod resolvers for form validation
- Custom query client configuration with disabled automatic refetching

**Design System Integration**
- Google Fonts CDN for custom typography (Inter, Rajdhani)
- Tailwind CSS with custom color palette for gaming aesthetic
- CSS variables for theme customization