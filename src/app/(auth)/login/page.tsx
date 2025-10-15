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
import { login } from './actions'
import { toast } from 'sonner'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isPending, startTransition] = useTransition()

	const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		startTransition(async () => {
			const formData = new FormData()
			formData.append('email', email)
			formData.append('password', password)

			const result = await login(formData)

			if (result && !result.success) {
				toast.error(result.error || 'Login failed')
			}
		})
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--muted)/0.3),hsl(var(--background)))] px-4">
			<Card className="drop-shadow-primary w-full max-w-md drop-shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription>Sign in to your account to continue</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<form onSubmit={handleEmailLogin} className="space-y-4">
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
						</div>
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? (
								'Signing in...'
							) : (
								<>
									<LogIn className="mr-2 h-4 w-4" />
									Sign in
								</>
							)}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col space-y-4">
					<div className="text-muted-foreground text-center text-sm">
						Don&apos;t have an account?{' '}
						<Link
							href="/signup"
							className="text-primary font-medium underline-offset-4 hover:underline"
						>
							Sign up
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
