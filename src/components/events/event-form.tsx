'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { DateTimePicker } from '@/components/events/date-time-picker'
import type { Event, Venue, Sport, State } from '@/db/types'
import { SportSelector } from '../selectors'
import { VenueSelectorEnhanced } from '../venue-selector-enhanced'

const eventFormSchema = z.object({
	name: z.string().min(1, 'Event name is required').max(200),
	sportId: z.string().min(1, 'Sport is required'),
	startsAt: z.date(),
	venueId: z.string().min(1, 'Venue is required'),
	description: z.string().max(2000).optional(),
})

type EventFormValues = z.infer<typeof eventFormSchema>

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
	const form = useForm<EventFormValues>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: {
			name: initialData?.name || '',
			sportId: initialData?.sportId || '',
			startsAt: initialData?.startsAt ? new Date(initialData.startsAt) : undefined,
			venueId: initialData?.venueId || '',
			description: initialData?.description || '',
		},
	})

	const handleSubmit = (data: EventFormValues) => {
		onSubmit(data)
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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Summer Basketball Tournament"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sportId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sport Type</FormLabel>
									<FormControl>
										<SportSelector
											sportId={field.value}
											setSportId={field.onChange}
											sports={sports}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="startsAt"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<DateTimePicker
											label="Event Date & Time"
											value={field.value}
											onChange={field.onChange}
											id="starts-at"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="venueId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Venue</FormLabel>
									<FormControl>
										<VenueSelectorEnhanced
											venueId={field.value}
											setVenueId={field.onChange}
											venues={venues}
											states={states}
											onVenueCreated={onVenueCreated}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Provide details about the event..."
											rows={4}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end">
							<div className="flex w-fit gap-2">
								<Button type="submit" className="flex-1">
									{submitLabel}
								</Button>
								{onCancel && (
									<Button type="button" variant="ghost" onClick={onCancel}>
										Cancel
									</Button>
								)}
							</div>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
