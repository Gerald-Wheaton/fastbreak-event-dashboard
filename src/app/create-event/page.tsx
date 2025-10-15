import { EventFormClient } from './event-form-client'
import { getSports, getVenues } from '@/app/dashboard/actions'

export default async function CreateEventPage() {
	const [sports, venues] = await Promise.all([getSports(), getVenues()])

	return (
		<div className="min-h-screen">
			<main className="container mx-auto max-w-2xl px-4 py-8">
				<div className="mb-8 space-y-2">
					<h1 className="text-3xl font-bold text-balance">Create Event</h1>
					<p className="text-muted-foreground">
						Add a new sports event to your calendar
					</p>
				</div>

				<EventFormClient sports={sports} venues={venues} />
			</main>
		</div>
	)
}
