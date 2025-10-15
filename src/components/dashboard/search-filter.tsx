'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sport } from '@/db/types'

interface SearchFilterProps {
	sports: Sport[]
	onSearchChange: (search: string) => void
	onSportFilterChange: (sportIds: string[]) => void
	onTimePeriodChange: (period: 'all' | 'today' | 'month') => void
}

export function SearchFilter({
	sports,
	onSearchChange,
	onSportFilterChange,
	onTimePeriodChange,
}: SearchFilterProps) {
	const [search, setSearch] = useState('')
	const [sportFilters, setSportFilters] = useState<string[]>([])
	const [timePeriod, setTimePeriod] = useState<'all' | 'today' | 'month'>('all')

	const handleSearchChange = (value: string) => {
		setSearch(value)
		onSearchChange(value)
	}

	const handleSportFilterChange = (sportId: string) => {
		let newFilters: string[]

		if (sportId === 'all') {
			// Clicking "All" clears all filters
			newFilters = []
		} else {
			// Toggle sport in/out of filters
			if (sportFilters.includes(sportId)) {
				newFilters = sportFilters.filter((id) => id !== sportId)
			} else {
				newFilters = [...sportFilters, sportId]
			}
		}

		setSportFilters(newFilters)
		onSportFilterChange(newFilters)
	}

	const handleTimePeriodChange = (value: 'all' | 'today' | 'month') => {
		setTimePeriod(value)
		onTimePeriodChange(value)
	}

	return (
		<div className="space-y-4 rounded-lg border bg-card p-4 drop-shadow-sm drop-shadow-primary">
			{/* Top Row: Search Bar + View Filters */}
			<div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
				{/* Search Bar */}
				<div className="relative flex-1">
					<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
					<Input
						placeholder="Search events..."
						value={search}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="pl-9"
					/>
				</div>

				{/* View Filters */}
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">View:</span>
					<Badge
						variant={timePeriod === 'all' ? 'default' : 'outline'}
						className={cn(
							'cursor-pointer transition-colors',
							timePeriod === 'all' && 'bg-primary text-primary-foreground'
						)}
						onClick={() => handleTimePeriodChange('all')}
					>
						All
					</Badge>
					<Badge
						variant={timePeriod === 'today' ? 'default' : 'outline'}
						className={cn(
							'cursor-pointer transition-colors',
							timePeriod === 'today' && 'bg-primary text-primary-foreground'
						)}
						onClick={() => handleTimePeriodChange('today')}
					>
						Today
					</Badge>
					<Badge
						variant={timePeriod === 'month' ? 'default' : 'outline'}
						className={cn(
							'cursor-pointer transition-colors',
							timePeriod === 'month' && 'bg-primary text-primary-foreground'
						)}
						onClick={() => handleTimePeriodChange('month')}
					>
						Month
					</Badge>
				</div>
			</div>

			{/* Bottom Row: Sport Filters */}
			<div className="flex flex-wrap items-center gap-2">
				<span className="text-sm font-medium">Sport:</span>
				<Badge
					variant={sportFilters.length === 0 ? 'default' : 'outline'}
					className={cn(
						'cursor-pointer border-2 transition-colors',
						sportFilters.length === 0
							? 'bg-primary text-primary-foreground border-primary'
							: 'border-border'
					)}
					onClick={() => handleSportFilterChange('all')}
				>
					All
				</Badge>
				{sports.map((sport: Sport) => {
					const isSelected = sportFilters.includes(sport.id)
					return (
						<Badge
							key={sport.id}
							variant="outline"
							className={cn(
								'text-foreground cursor-pointer border-2 transition-all hover:scale-105',
								isSelected && 'scale-110'
							)}
							style={{
								borderColor: sport.color || 'transparent',
								backgroundColor: isSelected
									? `${sport.color}70`
									: 'transparent',
							}}
							onClick={() => handleSportFilterChange(sport.id)}
						>
							{sport.name}
						</Badge>
					)
				})}
			</div>
		</div>
	)
}
