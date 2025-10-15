'use client'

import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { DateTimePicker } from '@/components/events/date-time-picker'
import type { Event, Venue, Sport, State } from '@/db/types'
import { SportSelector } from '../selectors'
import { VenueSelectorEnhanced } from '../venue-selector-enhanced'

interface EventFormProps {
	sports: Sport[]
	venues: Venue[]
	states: State[]
	initialData?: Partial<Event> & {
		venue?: Venue
	}
	onSubmit: (data: Partial<Event>) => void
	onCancel?: () => void
	submitLabel?: string
	onVenueCreated?: (venue: Venue) => void
}

export function EventForm({
	sports,
	venues,
	states,
	initialData,
	onSubmit,
	onCancel,
	submitLabel = 'Create Event',
	onVenueCreated,
}: EventFormProps) {
	const [name, setName] = useState(initialData?.name || '')
	const [sportId, setSportId] = useState(initialData?.sportId || '')
	const [startsAt, setStartsAt] = useState<Date | undefined>(
		initialData?.startsAt ? new Date(initialData.startsAt) : undefined
	)
	const [venueId, setVenueId] = useState(initialData?.venueId || '')
	const [description, setDescription] = useState(initialData?.description || '')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit({
			name,
			sportId,
			startsAt,
			venueId,
			description,
		})
	}

	return (
		<Card className="dark:drop-shadow-primary dark:drop-shadow-lg">
			<CardHeader>
				<CardTitle>{submitLabel}</CardTitle>
				<CardDescription>
					Fill in the details for your sports event
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="name">Event Name</Label>
						<Input
							id="name"
							placeholder="Summer Basketball Tournament"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="sport-type">Sport Type</Label>
						<SportSelector
							sportId={sportId}
							setSportId={setSportId}
							sports={sports}
						/>
					</div>

					<DateTimePicker
						label="Event Date & Time"
						value={startsAt}
						onChange={setStartsAt}
						id="starts-at"
					/>

				<div className="space-y-2">
					<Label htmlFor="venue">Venue</Label>
					<VenueSelectorEnhanced
						venueId={venueId}
						setVenueId={setVenueId}
						venues={venues}
						states={states}
						onVenueCreated={onVenueCreated}
					/>
				</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Provide details about the event..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={4}
						/>
					</div>

					<div className="flex justify-end">
						<div className="flex w-fit gap-2">
							<Button className="flex-1">{submitLabel}</Button>
							{onCancel && (
								<Button type="button" variant="ghost" onClick={onCancel}>
									Cancel
								</Button>
							)}
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
