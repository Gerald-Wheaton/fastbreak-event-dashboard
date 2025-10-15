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
import { login, loginWithGoogle } from './actions'
import { toast } from 'sonner'
import { LogIn, Mail } from 'lucide-react'

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

	const handleGoogleLogin = async () => {
		startTransition(async () => {
			await loginWithGoogle()
		})
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--muted)/0.3),hsl(var(--background)))] px-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription>
						Sign in to your account to continue
					</CardDescription>
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
						<Button
							type="submit"
							className="w-full"
							disabled={isPending}
						>
							{isPending ? (
								'Signing in...'
							) : (
								<>
									<LogIn className="mr-2 h-4 w-4" />
									Sign in with Email
								</>
							)}
						</Button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						className="w-full"
						onClick={handleGoogleLogin}
						disabled={isPending}
					>
						<Mail className="mr-2 h-4 w-4" />
						Sign in with Google
					</Button>
				</CardContent>
				<CardFooter className="flex flex-col space-y-4">
					<div className="text-sm text-muted-foreground text-center">
						Don&apos;t have an account?{' '}
						<Link
							href="/signup"
							className="text-primary underline-offset-4 hover:underline font-medium"
						>
							Sign up
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
