'use client'

import { useTransition } from 'react'
import { LogOut } from 'lucide-react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { logout } from '@/app/(auth)/login/actions'
import { toast } from 'sonner'
import { Button } from './ui/button'

export function LogoutButton() {
	const [isPending, startTransition] = useTransition()

	const handleLogout = () => {
		startTransition(async () => {
			const result = await logout()

			if (result && !result.success) {
				toast.error(result.error || 'Logout failed')
			}
		})
	}

	return (
		<Button
			className="cursor-pointer"
			onClick={handleLogout}
			disabled={isPending}
			size="icon"
		>
			{/* <DropdownMenuItem
			className="text-destructive cursor-pointer"
			onClick={handleLogout}
			disabled={isPending}
		> */}
			<LogOut className="h-4 w-4" />
			{/* </DropdownMenuItem> */}
		</Button>
	)
}
