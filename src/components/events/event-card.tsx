'use client'

import { useState } from 'react'
import {
	Calendar,
	MapPin,
	Trophy,
	Edit,
	Trash2,
	Clock,
	CalendarPlus,
} from 'lucide-react'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { EventWithRelations, Sport, Venue } from '@/db/types'
import {
	getCountdownText,
	formatDateRange,
	getDateGroup,
} from '@/lib/date-utils'
import { isPast } from 'date-fns'
import { cn } from '@/lib/utils'
import { EditEventDialog } from '@/components/events/edit-event-dialog'
import { CountdownTimer } from '@/components/events/count-down-timer'

interface EventCardProps {
	event: EventWithRelations
	sports?: Sport[]
	venues?: Venue[]
	onDelete?: (id: string) => void
	onEdit?: (eventId: string, data: Partial<EventWithRelations>) => void
}

export function EventCard({
	event,
	sports = [],
	venues = [],
	onDelete,
	onEdit,
}: EventCardProps) {
	const [editDialogOpen, setEditDialogOpen] = useState(false)

	const eventDate = new Date(event.startsAt)
	const hasEnded = isPast(eventDate)

	const dateGroup = getDateGroup(eventDate)
	const showLiveTimer =
		!hasEnded && (dateGroup === 'Today' || dateGroup === 'This Week')

	const countdownText = getCountdownText(eventDate)
	const dateRangeText = formatDateRange(eventDate)

	const handleAddToCalendar = () => {
		// TODO: Implement calendar export functionality
		console.log('[v0] Add to calendar clicked for event:', event.id)
	}

	return (
		<>
			<Card
				className={cn(
					'group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 transition-all duration-300 ease-out',
					!hasEnded && [
						'hover:scale-[1.02] hover:shadow-lg',
						'hover:-translate-y-2 hover:rotate-1 hover:backdrop-blur-sm',
						'hover:animate-subtle-bounce hover:border-l-[8px]',
						'before:absolute before:inset-0 before:rounded-2xl before:p-[1px]',
						'before:bg-gradient-to-r before:opacity-0 hover:before:opacity-100',
						'before:pointer-events-none before:-z-10 before:transition-opacity before:duration-300',
					],
					hasEnded && 'opacity-60 grayscale'
				)}
			style={{
				borderLeftWidth: '3px',
				borderLeftColor: event.sport.color || 'transparent',
				...(!hasEnded && {
					'--tw-shadow-color': `${event.sport.color}40`,
				}),
			} as React.CSSProperties}
			>
				<CardHeader className="pb-1">
					<div className="flex items-start justify-between">
						<div className="space-y-0">
							<CardTitle className="text-xl text-balance">
								{event.name}
							</CardTitle>
							<div className="mt-1 flex flex-wrap gap-1.5">
								<Badge
									variant="outline"
									className="w-fit border-2"
									style={{ borderColor: event.sport.color || 'transparent' }}
								>
									<Trophy className="mr-1 h-3 w-3" />
									{event.sport.name}
								</Badge>
								<Badge
									variant={hasEnded ? 'outline' : 'default'}
									className={cn(
										'w-fit',
										!hasEnded &&
											'bg-primary/10 text-primary hover:bg-primary/20'
									)}
								>
									<Clock className="mr-1 h-3 w-3" />
									{showLiveTimer ? (
										<CountdownTimer
											targetDate={eventDate}
											showTimer={showLiveTimer}
										/>
									) : (
										countdownText
									)}
								</Badge>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="relative flex-1 space-y-4 pb-0">
					<div className="space-y-0.5">
						<div className="text-muted-foreground flex items-center gap-1.5 text-sm">
							<Calendar className="h-4 w-4" />
							<span>{dateRangeText}</span>
						</div>
						<div className="text-muted-foreground flex items-start gap-1.5 text-sm">
							<MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
							<span>
								{event.venue.name}, {event.venue.city},{' '}
								{event.venue.state.abbreviation}
							</span>
						</div>
					</div>
					{event.description && (
						<p className="text-muted-foreground line-clamp-3 text-sm">
							{event.description}
						</p>
					)}
				</CardContent>

				<CardFooter className="relative flex justify-center gap-1.5 pt-0 pb-1">
					<div
						className={cn(
							'flex justify-center gap-1.5 transition-all duration-300 ease-out',
							!hasEnded
								? 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
								: 'translate-y-0 opacity-100'
						)}
					>
						{!hasEnded && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setEditDialogOpen(true)}
								>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</Button>
								<Button variant="ghost" size="sm" onClick={handleAddToCalendar}>
									<CalendarPlus className="mr-2 h-4 w-4" />
									Add to Calendar
								</Button>
							</>
						)}
						<Button
							variant="destructive"
							size="sm"
							// className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
							onClick={() => onDelete?.(event.id)}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</Button>
					</div>
				</CardFooter>
			</Card>

			{onEdit && (
				<EditEventDialog
					event={event}
					sports={sports}
					venues={venues}
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					onSave={onEdit}
				/>
			)}
		</>
	)
}
