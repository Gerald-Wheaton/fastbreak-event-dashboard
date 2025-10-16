'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { events, venues, sports, states, users } from '@/db/schema'
import { eq, desc, or, isNull } from 'drizzle-orm'
import { eventUpdateSchema, type EventUpdate } from '@/db/validations'
import type { EventWithRelations } from '@/db/types'
import { createClient } from '@/lib/supabase/server'

/**
 * Fetch all events with full relations (sport, venue with state, owner)
 * Only returns events that are public (owner_id = null) or owned by the current user
 */
export async function getEvents(): Promise<EventWithRelations[]> {
	try {
		// Get authenticated user
		const supabase = await createClient()
		const {
			data: { user },
		} = await supabase.auth.getUser()

		// Build where condition: show events with null owner_id OR events owned by current user
		const whereCondition = user
			? or(isNull(events.ownerId), eq(events.ownerId, user.id))
			: isNull(events.ownerId)

		const result = await db.query.events.findMany({
			where: whereCondition,
			with: {
				sport: true,
				venue: {
					with: {
						state: true,
					},
				},
				owner: true,
			},
			orderBy: [desc(events.startsAt)],
		})

		return result as EventWithRelations[]
	} catch (error) {
		console.error('Error fetching events:', error)
		return []
	}
}

/**
 * Fetch all sports from the database
 */
export async function getSports() {
	try {
		return await db.select().from(sports).orderBy(sports.name)
	} catch (error) {
		console.error('Error fetching sports:', error)
		return []
	}
}

/**
 * Fetch all venues with state relations
 */
export async function getVenues() {
	try {
		const result = await db.query.venues.findMany({
			with: {
				state: true,
			},
			orderBy: [venues.name],
		})
		return result
	} catch (error) {
		console.error('Error fetching venues:', error)
		return []
	}
}

/**
 * Update an existing event
 */
export async function updateEvent(id: string, data: EventUpdate) {
	try {
		// Validate data
		const validatedData = eventUpdateSchema.parse(data)

		// Update event
		const [updatedEvent] = await db
			.update(events)
			.set({
				...validatedData,
				updatedAt: new Date(),
			})
			.where(eq(events.id, id))
			.returning()

		if (!updatedEvent) {
			return { success: false, error: 'Event not found' }
		}

		revalidatePath('/dashboard')
		return { success: true, data: updatedEvent }
	} catch (error) {
		console.error('Error updating event:', error)

		if (error instanceof Error) {
			return { success: false, error: error.message }
		}

		return { success: false, error: 'Failed to update event' }
	}
}

/**
 * Delete an event by ID
 */
export async function deleteEvent(id: string) {
	try {
		const [deletedEvent] = await db
			.delete(events)
			.where(eq(events.id, id))
			.returning()

		if (!deletedEvent) {
			return { success: false, error: 'Event not found' }
		}

		revalidatePath('/dashboard')
		return { success: true }
	} catch (error) {
		console.error('Error deleting event:', error)

		if (error instanceof Error) {
			return { success: false, error: error.message }
		}

		return { success: false, error: 'Failed to delete event' }
	}
}
