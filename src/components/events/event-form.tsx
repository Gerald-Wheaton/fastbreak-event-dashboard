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
import type { Event, Venue, Sport } from '@/db/types'
import { SportSelector, VenueSelector } from '../selectors'

interface EventFormProps {
	sports: Sport[]
	venues: Venue[]
	initialData?: Partial<Event> & {
		venue?: Venue
	}
	onSubmit: (data: Partial<Event>) => void
	submitLabel?: string
}

export function EventForm({
	sports,
	venues,
	initialData,
	onSubmit,
	submitLabel = 'Create Event',
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
		<Card>
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
						<VenueSelector
							venueId={venueId}
							setVenueId={setVenueId}
							venues={venues}
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

					<div className="flex gap-2">
						<Button type="submit" className="flex-1">
							{submitLabel}
						</Button>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
