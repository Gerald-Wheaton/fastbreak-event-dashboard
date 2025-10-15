# FB Event Dashboard

A Next.js application with Supabase, Drizzle ORM, Zod, and Tailwind CSS.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service (Auth, Database, Storage)
- **Drizzle ORM** - TypeScript ORM for database operations
- **Zod** - Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project ([create one here](https://supabase.com))

### Installation

1. Clone or navigate to this repository

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials from your Supabase project settings

4. Push database schema to Supabase:

```bash
npm run db:push
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Commands

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes directly to database (useful for development)
- `npm run db:studio` - Open Drizzle Studio to view and edit your database

## Project Structure

```
├── src/
│   ├── app/          # Next.js app router pages
│   ├── db/
│   │   ├── index.ts  # Drizzle database client
│   │   └── schema.ts # Database schema definitions
│   └── lib/
│       └── supabase.ts # Supabase client
├── drizzle/          # Migration files
└── drizzle.config.ts # Drizzle configuration
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)
