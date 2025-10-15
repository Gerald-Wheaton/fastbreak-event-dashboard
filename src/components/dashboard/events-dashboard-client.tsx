'use client'

import { EventCard } from '@/components/events/event-card'
import { SearchFilter } from '@/components/dashboard/search-filter'
import { EmptyState } from '@/components/dashboard/empty-state'
import { groupEventsByDate } from '@/lib/date-utils'
import { useState, useTransition } from 'react'
import { isToday, isThisMonth } from 'date-fns'
import type { EventWithRelations, Sport, Venue } from '@/db/types'
import {
	deleteEvent as deleteEventAction,
	updateEvent as updateEventAction,
} from '@/app/dashboard/actions'
import { toast } from 'sonner'

interface EventsDashboardClientProps {
	initialEvents: EventWithRelations[]
	sports: Sport[]
	venues: Venue[]
}

export function EventsDashboardClient({
	initialEvents,
	sports,
	venues,
}: EventsDashboardClientProps) {
	const [events, setEvents] = useState<EventWithRelations[]>(initialEvents)
	const [searchTerm, setSearchTerm] = useState('')
	const [sportFilters, setSportFilters] = useState<string[]>([])
	const [timePeriod, setTimePeriod] = useState<'all' | 'today' | 'month'>('all')
	const [isPending, startTransition] = useTransition()

	const filteredEvents = events.filter((event: EventWithRelations) => {
		const matchesSearch = event.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
		const matchesSport =
			sportFilters.length === 0 || sportFilters.includes(event.sportId)

		let matchesTimePeriod = true
		if (timePeriod === 'today') {
			matchesTimePeriod = isToday(new Date(event.startsAt))
		} else if (timePeriod === 'month') {
			matchesTimePeriod = isThisMonth(new Date(event.startsAt))
		}

		return matchesSearch && matchesSport && matchesTimePeriod
	})

	const groupedEvents = groupEventsByDate(filteredEvents)
	const hasEvents = filteredEvents.length > 0

	const getVisibleGroups = (): string[] => {
		if (timePeriod === 'today') {
			return ['Today']
		}
		if (timePeriod === 'month') {
			return ['Today', 'This Week', 'Upcoming']
		}
		return ['Today', 'This Week', 'Upcoming', 'Past Events']
	}

	const visibleGroups = getVisibleGroups()

	const handleDelete = async (id: string) => {
		startTransition(async () => {
			const result = await deleteEventAction(id)

			if (result.success) {
				setEvents((prev) => prev.filter((event) => event.id !== id))
				toast.success('Event deleted successfully')
			} else {
				toast.error(result.error || 'Failed to delete event')
			}
		})
	}

	const handleUpdate = async (
		id: string,
		data: Partial<EventWithRelations>
	) => {
		startTransition(async () => {
			const updateData = {
				name: data.name,
				sportId: data.sportId,
				startsAt: data.startsAt,
				description: data.description ?? undefined,
				venueId: data.venueId,
			}

			const result = await updateEventAction(id, updateData)

			if (result.success) {
				// Optimistically update the UI
				setEvents((prev) =>
					prev.map((event) =>
						event.id === id
							? { ...event, ...data, updatedAt: new Date() }
							: event
					)
				)
				toast.success('Event updated successfully')
			} else {
				toast.error(result.error || 'Failed to update event')
			}
		})
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--muted)/0.3),hsl(var(--background)))]">
			<main className="container mx-auto px-4 py-8">
				<div className="mb-8 space-y-2">
					<h1 className="text-3xl font-bold text-balance">Event Dashboard</h1>
					<p className="text-muted-foreground">
						Manage and organize your sports events
					</p>
				</div>

				<div className="mb-6">
					<SearchFilter
						sports={sports}
						onSearchChange={setSearchTerm}
						onSportFilterChange={setSportFilters}
						onTimePeriodChange={setTimePeriod}
					/>
				</div>

				{hasEvents ? (
					<div className="space-y-8">
						{visibleGroups.map((group) => {
							const groupEvents = groupedEvents[group] || []
							if (groupEvents.length === 0) return null

							return (
								<div key={group} className="space-y-4">
									<h2 className="text-2xl font-semibold">{group}</h2>
									<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
										{groupEvents.map((event: EventWithRelations) => (
											<EventCard
												key={event.id}
												event={event}
												sports={sports}
												venues={venues}
												onDelete={handleDelete}
												onEdit={handleUpdate}
											/>
										))}
									</div>
								</div>
							)
						})}
					</div>
				) : (
					<EmptyState />
				)}

				{isPending && (
					<div className="bg-background/50 pointer-events-none fixed inset-0 flex items-center justify-center">
						<p className="text-muted-foreground">Updating...</p>
					</div>
				)}
			</main>
		</div>
	)
}
