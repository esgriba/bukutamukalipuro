# GitHub Copilot Instructions for Buku Tamu Digital

This document provides contextual information about the project to help GitHub Copilot provide better assistance with development tasks.

## Project Overview

This is a digital guest book application for the Kalipuro District Office. The application allows visitors to register their details digitally, while providing administrators with tools to manage and review visitor entries.

## Tech Stack

- **Framework**: Next.js 15 with TypeScript and App Router
- **UI**: Tailwind CSS 4
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma 6
- **Forms**: React Hook Form with Zod validation
- **Storage**: Supabase Storage
- **Notifications**: React Hot Toast

## Key Files

### Data Models

- `prisma/schema.prisma` - Contains the `GuestEntry` model and database schema

### API Routes

- `src/app/api/guestbook/route.ts` - Handles GET (list) and POST (create) operations
- `src/app/api/guestbook/[id]/route.ts` - Handles GET, PUT, DELETE for single entries
- `src/app/api/upload/route.ts` - Handles file upload to Supabase Storage

### Pages

- `src/app/page.tsx` - Home page
- `src/app/buku-tamu/page.tsx` - Guest book form page
- `src/app/admin/page.tsx` - Admin dashboard
- `src/app/admin/detail/[id]/page.tsx` - Entry detail page

### Components

- `src/components/GuestBookForm.tsx` - Form for guest entries
- `src/components/GuestList.tsx` - List of guest entries with pagination
- `src/components/Header.tsx` - Site header
- `src/components/Footer.tsx` - Site footer

### Utilities

- `src/lib/prisma.ts` - Prisma client setup
- `src/lib/supabase.ts` - Supabase client setup

## Coding Standards

- Use TypeScript for all files
- Maintain a clean component structure (one component per file)
- Use React Hooks and functional components
- Follow Next.js best practices
- Maintain accessibility standards
- Add comments for complex logic

## Feature Ideas

- Authentication system for admin pages
- QR code generation for entry confirmation
- Export to Excel/CSV functionality
- Statistics dashboard for visitor analytics
- Email notifications for new entries
- Print functionality for guest details
