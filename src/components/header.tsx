import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LandPlot, User } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from './logout-button'
import { ThemeToggle } from './theme-toggle'
import { MobileNav } from './mobile-nav'
import { logout } from '@/app/actions'

export async function Header() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	// Don&apos;t show header on auth pages
	if (!user) {
		return null
	}

	const displayName = user.user_metadata?.display_name || user.email

	return (
		<header className="border-border bg-card/95 supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50 border-b backdrop-blur">
			<div className="container mx-auto h-16 px-4">
				{/* Mobile Layout */}
				<div className="flex h-full items-center justify-between md:hidden">
					<MobileNav displayName={displayName} onLogout={logout} />
					<Link href="/dashboard" className="flex items-center gap-2">
						<LandPlot className="text-primary h-6 w-6" />
						<span className="text-foreground text-xl font-bold">
							Put Me In Coach
						</span>
					</Link>
					<ThemeToggle />
				</div>

				{/* Desktop Layout */}
				<div className="hidden h-full items-center justify-between md:flex">
					<Link href="/dashboard" className="flex items-center gap-2">
						<LandPlot className="text-primary h-6 w-6" />
						<span className="text-foreground text-xl font-bold">
							Put Me In Coach
						</span>
					</Link>

					<nav className="flex items-center gap-4">
						<Link href="/dashboard">
							<Button variant="ghost">Dashboard</Button>
						</Link>
						<Link href="/create-event">
							<Button variant="ghost">Create Event</Button>
						</Link>

						<ThemeToggle />

						<LogoutButton />
					</nav>
				</div>
			</div>
		</header>
	)
}
