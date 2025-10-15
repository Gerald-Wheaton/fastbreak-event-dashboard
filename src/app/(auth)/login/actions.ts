'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { db } from '@/db'
import { users } from '@/db/schema'

// ---------- VALIDATION SCHEMAS ----------

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			'Password must contain at least one uppercase letter, one lowercase letter, and one number'
		),
	displayName: z.string().min(2, 'Display name must be at least 2 characters'),
})

// ---------- AUTH ACTIONS ----------

/**
 * Login with email and password
 */
export async function login(formData: FormData) {
	const email = formData.get('email') as string
	const password = formData.get('password') as string

	try {
		// Validate input
		const validated = loginSchema.parse({ email, password })

		const supabase = await createClient()

		const { error } = await supabase.auth.signInWithPassword({
			email: validated.email,
			password: validated.password,
		})

		if (error) {
			return {
				success: false,
				error: error.message,
			}
		}

		revalidatePath('/', 'layout')
		redirect('/dashboard')
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0].message,
			}
		}

		if (error instanceof Error) {
			// Check if it's a redirect error (which is expected)
			if (error.message.includes('NEXT_REDIRECT')) {
				throw error
			}
			return {
				success: false,
				error: error.message,
			}
		}

		return {
			success: false,
			error: 'An unexpected error occurred',
		}
	}
}

/**
 * Sign up with email and password
 */
export async function signup(formData: FormData) {
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const displayName = formData.get('displayName') as string

	try {
		// Validate input
		const validated = signupSchema.parse({ email, password, displayName })

		const supabase = await createClient()

	const { data, error } = await supabase.auth.signUp({
		email: validated.email,
		password: validated.password,
		options: {
			data: {
				display_name: validated.displayName,
			},
		},
	})

	if (error) {
		return {
			success: false,
			error: error.message,
		}
	}

	// Create user in database if auth user was created
	if (data?.user) {
		await db.insert(users).values({
			id: data.user.id,
			displayName: validated.displayName,
			avatarUrl: data.user.user_metadata.avatar_url || null,
		})
	}

	// If email confirmation is required, show message
	if (data?.user && !data.session) {
		return {
			success: true,
			requiresConfirmation: true,
			message: 'Please check your email to confirm your account',
		}
	}

	revalidatePath('/', 'layout')
	redirect('/dashboard')
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.issues[0].message,
			}
		}

		if (error instanceof Error) {
			// Check if it's a redirect error (which is expected)
			if (error.message.includes('NEXT_REDIRECT')) {
				throw error
			}
			return {
				success: false,
				error: error.message,
			}
		}

		return {
			success: false,
			error: 'An unexpected error occurred',
		}
	}
}

/**
 * Logout current user
 */
export async function logout() {
	const supabase = await createClient()

	const { error } = await supabase.auth.signOut()

	if (error) {
		return {
			success: false,
			error: error.message,
		}
	}

	revalidatePath('/', 'layout')
	redirect('/login')
}
