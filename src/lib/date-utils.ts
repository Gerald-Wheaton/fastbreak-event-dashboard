import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	format,
	isToday,
	isTomorrow,
	isThisWeek,
	isThisMonth,
	isPast,
} from 'date-fns'

export function getCountdownText(date: Date): string {
	if (isPast(date)) {
		return 'Event has passed'
	}

	const now = new Date()
	const days = differenceInDays(date, now)
	const hours = differenceInHours(date, now)
	const minutes = differenceInMinutes(date, now)

	if (days > 0) {
		return `${days} day${days === 1 ? '' : 's'}`
	}

	if (hours > 0) {
		return `${hours} hour${hours === 1 ? '' : 's'}`
	}

	if (minutes > 0) {
		return `${minutes} minute${minutes === 1 ? '' : 's'}`
	}

	return 'Starting now'
}

export function formatDateRange(date: Date): string {
	if (isToday(date)) {
		return `Today at ${format(date, 'h:mm a')}`
	}

	if (isTomorrow(date)) {
		return `Tomorrow at ${format(date, 'h:mm a')}`
	}

	if (isThisWeek(date)) {
		return format(date, "EEEE 'at' h:mm a")
	}

	return format(date, "MMM d, yyyy 'at' h:mm a")
}

export function getDateGroup(date: Date): string {
	if (isToday(date)) {
		return 'Today'
	}

	if (isTomorrow(date)) {
		return 'Tomorrow'
	}

	if (isThisWeek(date)) {
		return 'This Week'
	}

	if (isThisMonth(date)) {
		return 'This Month'
	}

	if (isPast(date)) {
		return 'Past Events'
	}

	return 'Upcoming'
}

export function groupEventsByDate<T extends { startsAt: Date }>(
	events: T[]
): Record<string, T[]> {
	const groups: Record<string, T[]> = {
		Today: [],
		Tomorrow: [],
		'This Week': [],
		Upcoming: [],
		'Past Events': [],
	}

	events.forEach((event) => {
		const group = getDateGroup(new Date(event.startsAt))
		if (!groups[group]) {
			groups[group] = []
		}
		groups[group].push(event)
	})

	return groups
}
