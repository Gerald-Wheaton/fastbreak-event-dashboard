'use client'

import { EventForm } from '@/components/events/event-form'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { createEvent } from '../../app/create-event/actions'
import { toast } from 'sonner'
import type { Event, Sport, Venue, State } from '@/db/types'
import type { EventInsert } from '@/db/validations'

interface EventFormClientProps {
	sports: Sport[]
	venues: Venue[]
	states: State[]
}

export function EventFormClient({ sports, venues, states }: EventFormClientProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [localVenues, setLocalVenues] = useState(venues)

	const handleSubmit = async (data: Partial<Event>) => {
		startTransition(async () => {
			const result = await createEvent(data as EventInsert)

			if (!result.success) {
				toast.error(result.error || 'Failed to create event')
				return
			}

			toast.success('Event created successfully!')
			router.push('/dashboard')
		})
	}

	const handleCancel = () => {
		router.push('/dashboard')
	}

	const handleVenueCreated = (newVenue: Venue) => {
		setLocalVenues((prev) => [...prev, newVenue])
	}

	return (
		<>
			<EventForm
				sports={sports}
				venues={localVenues}
				states={states}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				onVenueCreated={handleVenueCreated}
				submitLabel="Create Event"
			/>
			{isPending && (
				<div className="bg-background/50 pointer-events-none fixed inset-0 flex items-center justify-center">
					<p className="text-muted-foreground">Creating event...</p>
				</div>
			)}
		</>
	)
}
