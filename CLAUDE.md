# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FB Event Dashboard - A sports event management application where authenticated users can create, view, edit, and delete events. Built with Next.js 15 App Router, Supabase, and Drizzle ORM.

**Package Manager:** This project uses **Bun**, not npm. All commands use `bun` instead of `npm`.

## Development Commands

```bash
# Development
bun dev                  # Start dev server with Turbopack
bun build                # Build for production with Turbopack
bun start                # Start production server

# Code Quality
bun lint                 # Run ESLint
bun format               # Format all files with Prettier
bun format:check         # Check formatting without changes

# Testing
bun test                 # Run Vitest in watch mode
bun test:ui              # Open Vitest UI
bun test:run             # Run tests once (CI mode)
bun test:coverage        # Run tests with coverage report

# Database
bun db:push              # Push schema changes to Supabase (development)
bun db:generate          # Generate migration files from schema changes
bun db:migrate           # Run migrations
bun db:studio            # Open Drizzle Studio

# Database Seeding
bun db:seed              # Seed all reference data (states + sports)
bun db:seed:states       # Seed only US states
bun db:seed:sports       # Seed only sports types
```

## Architecture

### Database Layer

**Dual Database Access Pattern:**

- **Drizzle ORM** (`src/db/`) - Direct SQL access via `postgres-js` for server actions and mutations
- **Supabase Client** (`src/lib/supabase.ts`) - For authentication and real-time features (conditionally created)

**Important:** The codebase uses environment variables loaded via `dotenv` for seed scripts and Drizzle operations. The `src/db/index.ts` file automatically loads `.env.local` when not in Next.js runtime to support standalone TypeScript execution.

### Validation Strategy

**Three-layer validation approach:**

1. **Drizzle Schema** (`src/db/schema.ts`) - Database schema with TypeScript types
2. **Zod Schemas** (`src/db/validations.ts`) - Runtime validation for:
   - `*InsertSchema` - Creating records (excludes auto-generated fields)
   - `*UpdateSchema` - Updating records (all fields optional via `.partial()`)
   - `*Schema` - Full record validation (includes timestamps)
3. **Form Integration** - react-hook-form with `zodResolver` for client-side validation

**Pattern:** Use `.extend()` and `.omit()` for schema composition to avoid duplication. See `src/db/validations.ts` for examples.

### Route Architecture

**App Router Structure:**

- `(auth)/login` - Authentication (client component, no auth protection)
- `(dashboard)/` - Main dashboard (RSC with search params)
- `(dashboard)/create-event` - Event creation form (RSC parent, client form)

**Important:** Edit and delete operations happen via **dialogs on the dashboard**, NOT separate pages. There are no `/events/[id]` routes.

### Server Actions Pattern

**Location:** Server actions live in `actions.ts` files **within the same directory** as the page that uses them.

```
/app/(dashboard)/page.tsx
/app/(dashboard)/actions.ts          # Actions for dashboard
/app/(dashboard)/create-event/page.tsx
/app/(dashboard)/create-event/actions.ts  # Actions for create-event
```

**Standard Pattern:**

```typescript
"use server";

export async function myAction(data: MyType) {
  try {
    // 1. Validate with Zod
    const validated = mySchema.parse(data);

    // 2. Database operation
    const result = await db.insert(table).values(validated).returning();

    // 3. Revalidate & redirect
    revalidatePath("/");
    redirect("/");
  } catch (error) {
    // 4. Return error (don't throw to allow client handling)
    return { success: false, error: error.message };
  }
}
```

### Database Schema

**Core Tables:**

- `states` - US states (PK: abbreviation, seeded data)
- `sports` - Sport types (PK: kebab-case id, seeded data)
- `users` - User profiles (FK to Supabase auth.users)
- `venues` - Event locations (FK to states)
- `events` - Sports events (FK to sports, venues, users)

**Relations:** Drizzle relations are defined for type-safe joins. See `*Relations` exports in `src/db/schema.ts`.

### Forms

All forms use:

- `react-hook-form` with `zodResolver`
- shadcn/ui `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`
- Server actions for submission
- `sonner` for toast notifications

### Component Organization

**shadcn/ui components:** Located in `src/components/ui/` (auto-generated, minimal edits)

**Custom components:** Organized by feature:

```
src/components/
  events/              # Event-related components
    event-list.tsx
    event-filters.tsx
    create-event-form.tsx
    edit-event-dialog.tsx    # Dialog-based editing
```

### Testing

**Framework:** Vitest with React Testing Library

**Test Location:** Use `__tests__/` directories:

```
src/lib/__tests__/utils.test.ts
src/components/ui/__tests__/button.test.tsx
```

**Configuration:** `vitest.config.mts` with jsdom environment, global test APIs, and path aliases.

## Key Patterns & Conventions

1. **Imports:** Use `@/` alias for all absolute imports from `src/`
2. **Server Components:** Default to RSC, mark client components with `"use client"`
3. **Loading States:** Use `useTransition()` for client-side loading, Suspense boundaries for RSC
4. **Error Handling:** Server actions return `{ success, error }` objects, not throws
5. **Styling:** Tailwind with `cn()` utility from `src/lib/utils.ts` for conditional classes
6. **Icons:** Use `lucide-react` for all icons

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=              # Supabase Postgres connection string
```

## Project Constraints

- **No page-based editing:** Use dialogs instead of routes like `/events/[id]/edit`
- **Reference data is seeded:** States and sports are pre-populated, not user-managed
- **Bun only:** Do not use npm/yarn commands
- **Authentication planned:** Email/password + Google OAuth via Supabase (skeleton in place)
