'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { DateTimePicker } from '@/components/events/date-time-picker'
import type { EventWithRelations, Sport, Venue, State } from '@/db/types'
import { SportSelector } from '@/components/selectors'
import { VenueSelectorEnhanced } from '@/components/venue-selector-enhanced'

const editEventSchema = z.object({
	name: z.string().min(1, 'Event name is required').max(200),
	sportId: z.string().min(1, 'Sport is required'),
	startsAt: z.date(),
	venueId: z.string().min(1, 'Venue is required'),
	description: z.string().max(2000).optional(),
})

type EditEventFormValues = z.infer<typeof editEventSchema>

interface EditEventDialogProps {
	event: EventWithRelations
	sports: Sport[]
	venues: Venue[]
	states: State[]
	open: boolean
	onOpenChange: (open: boolean) => void
	onSave: (eventId: string, data: Partial<EventWithRelations>) => void
	onVenueCreated?: (venue: Venue) => void
}

export function EditEventDialog({
	event,
	sports,
	venues,
	states,
	open,
	onOpenChange,
	onSave,
	onVenueCreated,
}: EditEventDialogProps) {
	const form = useForm<EditEventFormValues>({
		resolver: zodResolver(editEventSchema),
		defaultValues: {
			name: event.name,
			sportId: event.sportId,
			startsAt: new Date(event.startsAt),
			venueId: event.venueId,
			description: event.description || '',
		},
	})

	const handleSubmit = (data: EditEventFormValues) => {
		onSave(event.id, data)
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-x-hidden overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Edit Event</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="min-w-0 space-y-6"
					>
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
											id="edit-starts-at"
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
									Save Changes
								</Button>
								<Button
									type="button"
									variant="ghost"
									onClick={() => onOpenChange(false)}
								>
									Cancel
								</Button>
							</div>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
