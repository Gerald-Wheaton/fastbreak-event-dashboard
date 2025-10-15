import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get('code')
	const origin = requestUrl.origin

	if (code) {
		const supabase = await createClient()
		const { data } = await supabase.auth.exchangeCodeForSession(code)

		// Create user in database if this is a new OAuth user
		if (data?.user) {
			const existingUser = await db.query.users.findFirst({
				where: eq(users.id, data.user.id),
			})

			if (!existingUser) {
				await db.insert(users).values({
					id: data.user.id,
					displayName:
						data.user.user_metadata.display_name ||
						data.user.user_metadata.full_name ||
						data.user.email?.split('@')[0] ||
						null,
					avatarUrl: data.user.user_metadata.avatar_url || null,
				})
			}
		}
	}

	// URL to redirect to after sign in process completes
	return NextResponse.redirect(`${origin}/dashboard`)
}
