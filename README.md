# FB Event Dashboard

Sports event management platform for creating, viewing, editing, and deleting events. Built with Next.js 15 App Router, Supabase, and Drizzle ORM.

## Tech Stack

**Runtime & Framework**
- Bun (package manager)
- Next.js 15 (App Router, RSC, Server Actions)
- TypeScript
- React 19

**Database & Auth**
- Supabase (Postgres + Auth)
- Drizzle ORM (direct SQL via postgres-js)
- Zod (runtime validation)

**UI**
- Tailwind CSS 4
- shadcn/ui components
- next-themes (dark mode)
- react-hook-form + sonner (forms + toasts)

**Testing**
- Vitest + React Testing Library

## Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.local.example .env.local
# Add your Supabase credentials

# Push schema to database
bun db:push

# Seed reference data (US states + sports)
bun db:seed

# Start dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Commands

```bash
bun db:push           # Push schema changes (dev)
bun db:generate       # Generate migrations
bun db:migrate        # Run migrations
bun db:studio         # Open Drizzle Studio
bun db:seed           # Seed states + sports
```

## Key Features

- **Event CRUD**: Create, view, edit, delete events via dialogs (no separate edit pages)
- **Venue Management**: Enhanced command palette selector with inline creation
- **Search & Filters**: Sport filters, time period filters, search by name/description
- **Dual DB Access**: Drizzle for mutations, Supabase client for auth
- **Type-Safe Validation**: Drizzle schema → Zod schemas → form validation

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login page (public)
│   ├── (dashboard)/         # Main dashboard + actions
│   ├── create-event/        # Event creation page
│   └── venues/              # Venue actions
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── events/              # Event-related components
│   └── dashboard/           # Dashboard-specific
├── db/
│   ├── schema.ts            # Drizzle schema
│   ├── validations.ts       # Zod schemas
│   └── seeds/               # Seed scripts
└── lib/
    ├── supabase.ts          # Supabase client
    └── utils.ts             # Utilities (cn, etc.)
```

## Architecture Notes

**Validation Strategy**: Three-layer validation (Drizzle schema → Zod schemas → form validation). See `src/db/validations.ts` for Insert/Update/Select schemas.

**Database Pattern**: Drizzle for server actions (mutations), Supabase client for auth. Reference data (states, sports) is seeded, not user-managed.

**Server Actions**: Located in `actions.ts` files within the same directory as the page consuming them. Return `{ success, error }` objects instead of throwing.

**Route Pattern**: Edit/delete via dialogs on dashboard, not separate routes.

For detailed development guidelines, see [CLAUDE.md](./CLAUDE.md).
