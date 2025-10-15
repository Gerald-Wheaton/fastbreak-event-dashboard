'use client'

import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'

interface DateTimePickerProps {
	label: string
	value: Date | undefined
	onChange: (date: Date | undefined) => void
	id?: string
}

export function DateTimePicker({
	label,
	value,
	onChange,
	id,
}: DateTimePickerProps) {
	const [isOpen, setIsOpen] = React.useState(false)
	const [time, setTime] = React.useState(
		value ? value.toTimeString().slice(0, 8) : '10:30:00'
	)

	const currentYear = new Date().getFullYear()
	const toYear = currentYear + 4

	const handleDateSelect = (selectedDate: Date | undefined) => {
		if (selectedDate) {
			const [hours, minutes, seconds] = time.split(':')
			selectedDate.setHours(
				Number.parseInt(hours),
				Number.parseInt(minutes),
				Number.parseInt(seconds || '0')
			)
			onChange(selectedDate)
			setIsOpen(false)
		} else {
			onChange(undefined)
		}
	}

	const handleTimeChange = (newTime: string) => {
		setTime(newTime)
		if (value) {
			const [hours, minutes, seconds] = newTime.split(':')
			const newDate = new Date(value)
			newDate.setHours(
				Number.parseInt(hours),
				Number.parseInt(minutes),
				Number.parseInt(seconds || '0')
			)
			onChange(newDate)
		}
	}

	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<div className="flex gap-2">
				<Popover open={isOpen} onOpenChange={setIsOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							id={id}
							className="w-32 justify-between bg-transparent font-normal"
						>
							{value ? value.toLocaleDateString() : 'Select date'}
							<ChevronDown className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto overflow-hidden p-0" align="start">
						<Calendar
							mode="single"
							selected={value}
							captionLayout="dropdown"
							onSelect={handleDateSelect}
							disabled={(date) =>
								date < new Date(new Date().setHours(0, 0, 0, 0))
							}
							fromYear={currentYear}
							toYear={toYear}
						/>
					</PopoverContent>
				</Popover>
				<Input
					type="time"
					id="time-picker"
					step="1"
					value={time}
					onChange={(e) => handleTimeChange(e.target.value)}
					className="bg-background w-32 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
			</div>
		</div>
	)
}
