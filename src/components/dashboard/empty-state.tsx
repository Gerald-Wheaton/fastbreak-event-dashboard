'use client'

import { Button } from '@/components/ui/button'
import { Calendar, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function EmptyState() {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		// Trigger animation after mount
		const timer = setTimeout(() => setIsVisible(true), 100)
		return () => clearTimeout(timer)
	}, [])

	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div
				className={`mb-6 transition-all duration-700 ${
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				}`}
				style={{
					animation: isVisible ? 'bounce 1s ease-in-out' : 'none',
				}}
			>
				<Calendar
					className="text-muted-foreground/40 h-24 w-24"
					strokeWidth={1.5}
				/>
			</div>

			<h3
				className={`mb-2 text-2xl font-bold transition-all delay-150 duration-700 ${
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				}`}
			>
				No events yet
			</h3>

			<p
				className={`text-muted-foreground mb-6 transition-all delay-300 duration-700 ${
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				}`}
			>
				Get started by creating your first sports event
			</p>

			<Link
				href="/create-event"
				className={`transition-all delay-500 duration-700 ${
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				}`}
			>
				<Button size="lg" className="gap-2">
					<Sparkles className="h-4 w-4" />
					Create an event!
				</Button>
			</Link>

			<style jsx>{`
				@keyframes bounce {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-20px);
					}
				}
			`}</style>
		</div>
	)
}
