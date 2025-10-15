'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, User, LayoutDashboard, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'

interface MobileNavProps {
	displayName: string
	onLogout: () => Promise<void>
}

export function MobileNav({ displayName, onLogout }: MobileNavProps) {
	const [open, setOpen] = useState(false)

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu className="h-5 w-5" />
					<span className="sr-only">Toggle menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[300px] sm:w-[400px]">
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<div className="mt-6 flex flex-col gap-4">
					<Link
						href="/dashboard"
						onClick={() => setOpen(false)}
						className="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-lg transition-colors"
					>
						<LayoutDashboard className="h-5 w-5" />
						Dashboard
					</Link>
					<Link
						href="/create-event"
						onClick={() => setOpen(false)}
						className="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-lg transition-colors"
					>
						<PlusCircle className="h-5 w-5" />
						Create Event
					</Link>
					<div className="bg-border my-4 h-px" />
					<div className="flex items-center gap-3 rounded-lg px-3 py-2 text-lg">
						<User className="h-5 w-5" />
						<div className="flex flex-col">
							<span className="font-medium">Profile</span>
							<span className="text-muted-foreground text-sm">
								{displayName}
							</span>
						</div>
					</div>
					<button
						onClick={async () => {
							await onLogout()
							setOpen(false)
						}}
						className="hover:bg-accent flex items-center gap-3 rounded-lg px-3 py-2 text-left text-lg transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-5 w-5"
						>
							<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
							<polyline points="16 17 21 12 16 7" />
							<line x1="21" x2="9" y1="12" y2="12" />
						</svg>
						Logout
					</button>
				</div>
			</SheetContent>
		</Sheet>
	)
}
