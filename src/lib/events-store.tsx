'use client'

import { useState, useEffect } from 'react'
import type { EventWithRelations } from '@/db/types'
import {
	mockEvents,
	mockSports,
	mockVenues,
	mockUser,
	mockStates,
} from './mock-data'

const STORAGE_KEY = 'sports-events'
const VERSION_KEY = 'sports-events-version'
const CURRENT_VERSION = '4'

export function useEventsStore() {
	const [events, setEvents] = useState<EventWithRelations[]>([])
	const [isLoaded, setIsLoaded] = useState(false)

	useEffect(() => {
		const storedVersion = localStorage.getItem(VERSION_KEY)
		const stored = localStorage.getItem(STORAGE_KEY)

		if (stored && storedVersion === CURRENT_VERSION) {
			try {
				const parsed = JSON.parse(stored)
				const eventsWithDates = parsed.map((event: Event & { startsAt: string; endsAt: string | null; createdAt: string; updatedAt: string }) => ({
					...event,
					startsAt: new Date(event.startsAt),
					endsAt: event.endsAt ? new Date(event.endsAt) : null,
					createdAt: new Date(event.createdAt),
					updatedAt: new Date(event.updatedAt),
				}))
				setEvents(eventsWithDates)
			} catch (error) {
				console.error('[v0] Failed to parse stored events:', error)
				setEvents(mockEvents)
				localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
			}
		} else {
			setEvents(mockEvents)
			localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
		}
		setIsLoaded(true)
	}, [])

	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
		}
	}, [events, isLoaded])

	const addEvent = (eventData: {
		name: string
		sportId: string
		startsAt: Date
		venueId: string
		description: string
	}) => {
		const sport = mockSports.find((s) => s.id === eventData.sportId)
		const venue = mockVenues.find((v) => v.id === eventData.venueId)
		const state = mockStates.find((s) => s.abbreviation === venue?.stateAbbr)

		if (!sport || !venue || !state) {
			console.error('[v0] Invalid sport or venue')
			return
		}

		const newEvent: EventWithRelations = {
			id: `event-${Date.now()}`,
			name: eventData.name,
			sportId: eventData.sportId,
			startsAt: eventData.startsAt,
			description: eventData.description,
			venueId: eventData.venueId,
			ownerId: mockUser.id,
			createdAt: new Date(),
			updatedAt: new Date(),
			sport,
			venue: {
				...venue,
				state,
			},
			owner: mockUser,
		}

		setEvents((prev) => [...prev, newEvent])
	}

	const deleteEvent = (id: string) => {
		setEvents((prev) => prev.filter((event) => event.id !== id))
	}

	const updateEvent = (id: string, eventData: Partial<EventWithRelations>) => {
		setEvents((prev) =>
			prev.map((event) => {
				if (event.id === id) {
					// If sportId changed, update the sport relation
					let sport = event.sport
					if (eventData.sportId && eventData.sportId !== event.sportId) {
						const newSport = mockSports.find((s) => s.id === eventData.sportId)
						if (newSport) sport = newSport
					}

					// If venueId changed, update the venue relation
					let venue = event.venue
					if (eventData.venueId && eventData.venueId !== event.venueId) {
						const newVenue = mockVenues.find((v) => v.id === eventData.venueId)
						if (newVenue) {
							const state = mockStates.find(
								(s) => s.abbreviation === newVenue.stateAbbr
							)
							if (state) {
								venue = {
									...newVenue,
									state,
								}
							}
						}
					}

					return {
						...event,
						...eventData,
						sport,
						venue,
						updatedAt: new Date(),
					}
				}
				return event
			})
		)
	}

	return {
		events,
		addEvent,
		deleteEvent,
		updateEvent,
		isLoaded,
	}
}
