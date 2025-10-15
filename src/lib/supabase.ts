import { createClient } from '@supabase/supabase-js'
import { pgTable, uuid } from 'drizzle-orm/pg-core'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create Supabase client if credentials are available
// (seed scripts don't need the Supabase client, only Drizzle)
export const supabase =
	supabaseUrl && supabaseAnonKey
		? createClient(supabaseUrl, supabaseAnonKey)
		: null

// Reference to Supabase's auth.users table
export const authUsers = pgTable(
	'users',
	{
		id: uuid('id').primaryKey(),
	},
	() => ({ schema: 'auth' }) as { schema: string }
)
