'use client'

import { EventForm } from '@/components/events/event-form'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { createEvent } from './actions'
import { toast } from 'sonner'
import type { Event, Sport, Venue } from '@/db/types'
import type { EventInsert } from '@/db/validations'

interface EventFormClientProps {
	sports: Sport[]
	venues: Venue[]
}

export function EventFormClient({ sports, venues }: EventFormClientProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleSubmit = async (data: Partial<Event>) => {
		startTransition(async () => {
			const result = await createEvent(data as EventInsert)

			if (result && !result.success) {
				toast.error(result.error || 'Failed to create event')
			} else {
				toast.success('Event created successfully!')
				router.push('/dashboard')
			}
		})
	}

	return (
		<>
			<EventForm
				sports={sports}
				venues={venues}
				onSubmit={handleSubmit}
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
