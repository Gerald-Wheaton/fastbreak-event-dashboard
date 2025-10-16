'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { Venue, State } from '@/db/types'
import { createVenue } from '@/app/venues/actions'
import { toast } from 'sonner'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VenueSelectorEnhancedProps {
	venueId: string
	setVenueId: (venueId: string) => void
	venues: Venue[]
	states: State[]
	onVenueCreated?: (venue: Venue) => void
}

export function VenueSelectorEnhanced({
	venueId,
	setVenueId,
	venues,
	states,
	onVenueCreated,
}: VenueSelectorEnhancedProps) {
	const [open, setOpen] = useState(false)
	const [createDialogOpen, setCreateDialogOpen] = useState(false)
	const [isPending, startTransition] = useTransition()

	// New venue form state
	const [newVenueName, setNewVenueName] = useState('')
	const [newVenueCity, setNewVenueCity] = useState('')
	const [newVenueState, setNewVenueState] = useState('')

	const selectedVenue = venues.find((v) => v.id === venueId)

	const handleCreateVenue = () => {
		startTransition(async () => {
			const result = await createVenue({
				name: newVenueName,
				city: newVenueCity,
				stateAbbr: newVenueState,
			})

			if (!result.success || !result.data) {
				toast.error(result.error || 'Failed to create venue')
				return
			}

			toast.success('Venue created successfully!')
			setVenueId(result.data.id)
			setCreateDialogOpen(false)
			setOpen(false)

			// Reset form
			setNewVenueName('')
			setNewVenueCity('')
			setNewVenueState('')

			if (onVenueCreated) {
				onVenueCreated(result.data)
			}
		})
	}

	return (
		<>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-full justify-between"
					>
						<span className="truncate">
							{selectedVenue
								? `${selectedVenue.name} - ${selectedVenue.city}, ${selectedVenue.stateAbbr}`
								: 'Select a venue'}
						</span>
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[min(400px,90vw)] p-0" align="start">
					<Command className="h-auto">
						<CommandInput placeholder="Search venues..." />
						<CommandList>
							<CommandEmpty>
								<div className="py-6 text-center">
									<p className="text-muted-foreground mb-3 text-sm">
										No venues found
									</p>
									<Button
										variant="outline"
										size="sm"
										onClick={() => {
											setCreateDialogOpen(true)
											setOpen(false)
										}}
										className="mx-auto"
									>
										<Plus className="mr-2 h-4 w-4" />
										Create new venue
									</Button>
								</div>
							</CommandEmpty>
							<CommandGroup>
								{venues.map((venue) => (
									<CommandItem
										key={venue.id}
										value={`${venue.name} ${venue.city} ${venue.stateAbbr}`}
										onSelect={() => {
											setVenueId(venue.id)
											setOpen(false)
										}}
										className={cn(
											venueId === venue.id && 'bg-primary/25 border-primary'
										)}
									>
										<Check
											className={cn(
												'text-primary mr-2 h-4 w-4',
												venueId === venue.id ? 'opacity-100' : 'opacity-0'
											)}
										/>
										<div className="flex flex-col">
											<span className="font-medium">{venue.name}</span>
											<span className="text-muted-foreground text-xs">
												{venue.city}, {venue.stateAbbr}
											</span>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setCreateDialogOpen(true)
										setOpen(false)
									}}
								>
									<Plus className="mr-2 h-4 w-4" />
									Create new venue
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
				<DialogContent className="overflow-x-hidden">
					<DialogHeader>
						<DialogTitle>Create New Venue</DialogTitle>
						<DialogDescription>
							Add a new venue to your event options
						</DialogDescription>
					</DialogHeader>
					<div className="min-w-0 space-y-4">
						<div className="space-y-2">
							<Label htmlFor="new-venue-name">Venue Name</Label>
							<Input
								id="new-venue-name"
								placeholder="Madison Square Garden"
								value={newVenueName}
								onChange={(e) => setNewVenueName(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="new-venue-city">City</Label>
							<Input
								id="new-venue-city"
								placeholder="New York"
								value={newVenueCity}
								onChange={(e) => setNewVenueCity(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="new-venue-state">State</Label>
							<Select
								value={newVenueState}
								onValueChange={setNewVenueState}
								required
							>
								<SelectTrigger id="new-venue-state">
									<SelectValue placeholder="Select a state" />
								</SelectTrigger>
								<SelectContent className="max-h-[300px]">
									{states.map((state) => (
										<SelectItem
											key={state.abbreviation}
											value={state.abbreviation}
										>
											{state.name} ({state.abbreviation})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex justify-end gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setCreateDialogOpen(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateVenue}
								disabled={
									!newVenueName || !newVenueCity || !newVenueState || isPending
								}
							>
								{isPending ? 'Creating...' : 'Create Venue'}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
