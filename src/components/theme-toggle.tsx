'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
	const [theme, setTheme] = useState<'light' | 'dark'>('dark')

	useEffect(() => {
		// Check localStorage and system preference on mount
		const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
		const systemPrefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches

		const initialTheme = stored || (systemPrefersDark ? 'dark' : 'light')
		setTheme(initialTheme)
		document.documentElement.classList.toggle('dark', initialTheme === 'dark')
	}, [])

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark'
		setTheme(newTheme)
		localStorage.setItem('theme', newTheme)
		document.documentElement.classList.toggle('dark', newTheme === 'dark')
	}

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			className="rounded-full border-none hover:border-none"
			aria-label="Toggle theme"
		>
			{theme === 'dark' ? (
				<Sun className="h-5 w-5" />
			) : (
				<Moon className="h-5 w-5" />
			)}
		</Button>
	)
}

