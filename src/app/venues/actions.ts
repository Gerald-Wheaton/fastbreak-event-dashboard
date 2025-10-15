'use server'

import { db } from '@/db'
import { venues, states } from '@/db/schema'
import { venueInsertSchema } from '@/db/validations'
import { revalidatePath } from 'next/cache'
import type { VenueInsert } from '@/db/validations'

export async function getStates() {
	try {
		return await db.select().from(states).orderBy(states.name)
	} catch (error) {
		console.error('Error fetching states:', error)
		return []
	}
}

export async function createVenue(data: VenueInsert) {
	try {
		const validatedData = venueInsertSchema.parse(data)
		const [newVenue] = await db.insert(venues).values(validatedData).returning()
		
		revalidatePath('/create-event')
		revalidatePath('/dashboard')
		
		return { success: true, data: newVenue }
	} catch (error) {
		console.error('Error creating venue:', error)

		if (error instanceof Error) {
			return { success: false, error: error.message }
		}

		return { success: false, error: 'Failed to create venue' }
	}
}

