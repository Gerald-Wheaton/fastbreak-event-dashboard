'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { signup } from '../login/actions'
import { toast } from 'sonner'
import { UserPlus } from 'lucide-react'

export default function SignupPage() {
	const [displayName, setDisplayName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isPending, startTransition] = useTransition()

	const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		// Client-side validation
		if (password !== confirmPassword) {
			toast.error('Passwords do not match')
			return
		}

		if (password.length < 8) {
			toast.error('Password must be at least 8 characters')
			return
		}

		startTransition(async () => {
			const formData = new FormData()
			formData.append('email', email)
			formData.append('password', password)
			formData.append('displayName', displayName)

			const result = await signup(formData)

			if (result) {
				if (!result.success) {
					toast.error(result.error || 'Sign up failed')
				} else if (result.requiresConfirmation) {
					toast.success(
						result.message || 'Please check your email to confirm your account'
					)
				}
			}
		})
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--muted)/0.3),hsl(var(--background)))] px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">
						Create an account
					</CardTitle>
					<CardDescription>
						Enter your information to get started
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<form onSubmit={handleSignup} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="displayName">Display Name</Label>
							<Input
								id="displayName"
								type="text"
								placeholder="John Doe"
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								required
								disabled={isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isPending}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={isPending}
							/>
							<p className="text-muted-foreground text-xs">
								Must be at least 8 characters with uppercase, lowercase, and
								number
							</p>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword">Confirm Password</Label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="Confirm your password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								disabled={isPending}
							/>
						</div>
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? (
								'Creating account...'
							) : (
								<>
									<UserPlus className="mr-2 h-4 w-4" />
									Create Account
								</>
							)}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col space-y-4">
					<div className="text-muted-foreground text-center text-sm">
						Already have an account?{' '}
						<Link
							href="/login"
							className="text-primary font-medium underline-offset-4 hover:underline"
						>
							Sign in
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
