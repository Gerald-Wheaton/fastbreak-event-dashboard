import { Sport, Venue } from '@/db/types'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface VenueSelectorProps {
	venueId: string
	setVenueId: (venueId: string) => void
	venues: Venue[]
}

export function VenueSelector({
	venueId,
	setVenueId,
	venues,
}: VenueSelectorProps) {
	return (
		<Select value={venueId} onValueChange={setVenueId} required>
			<SelectTrigger id="venue">
				<SelectValue placeholder="Select a venue" />
			</SelectTrigger>
			<SelectContent>
				{venues.map((venue: Venue) => (
					<SelectItem key={venue.id} value={venue.id}>
						{venue.name} - {venue.city}, {venue.stateAbbr}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

interface SportSelectorProps {
	sportId: string
	setSportId: (sportId: string) => void
	sports: Sport[]
}

export function SportSelector({
	sportId,
	setSportId,
	sports,
}: SportSelectorProps) {
	return (
		<Select value={sportId} onValueChange={setSportId} required>
			<SelectTrigger id="edit-sport-type">
				<SelectValue placeholder="Select a sport" />
			</SelectTrigger>
			<SelectContent>
				{sports.map((sport) => (
					<SelectItem key={sport.id} value={sport.id}>
						{sport.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
