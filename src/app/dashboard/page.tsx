import { Suspense } from 'react'
import { getEvents, getSports, getVenues } from './actions'
import { EventsDashboardClient } from '../../components/dashboard/events-dashboard-client'

function LoadingDashboard() {
	return (
		<div className="min-h-screen">
			<main className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center py-16">
					<p className="text-muted-foreground">Loading events...</p>
				</div>
			</main>
		</div>
	)
}

export default async function DashboardPage() {
	const [events, sports, venues] = await Promise.all([
		getEvents(),
		getSports(),
		getVenues(),
	])

	return (
		<Suspense fallback={<LoadingDashboard />}>
			<EventsDashboardClient
				initialEvents={events}
				sports={sports}
				venues={venues}
			/>
		</Suspense>
	)
}
