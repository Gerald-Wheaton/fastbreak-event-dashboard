import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, LogOut, User } from 'lucide-react'
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

export async function Header() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	// Don't show header on auth pages
	if (!user) {
		return null
	}

	const displayName = user.user_metadata?.display_name || user.email

	return (
		<header className="border-border bg-card border-b">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link href="/dashboard" className="flex items-center gap-2">
					<Calendar className="text-primary h-6 w-6" />
					<span className="text-foreground text-xl font-bold">SportEvents</span>
				</Link>

				<nav className="flex items-center gap-4">
					<Link href="/dashboard">
						<Button variant="ghost">Dashboard</Button>
					</Link>
					<Link href="/create-event">
						<Button variant="default">Create Event</Button>
					</Link>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="rounded-full">
								<User className="h-5 w-5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>{displayName}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<LogoutButton />
						</DropdownMenuContent>
					</DropdownMenu>
				</nav>
			</div>
		</header>
	)
}
