"use client";

import { Calendar, Mail, Lock, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loginWithEmail, signupWithEmail } from "./actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result =
        mode === "login"
          ? await loginWithEmail(formData)
          : await signupWithEmail(formData);

      if (result.success) {
        toast.success(result.message);

        if (mode === "login") {
          router.push("/");
          router.refresh();
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="from-background via-muted/20 to-background relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute top-1/4 -left-4 h-72 w-72 animate-pulse rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -right-4 bottom-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl delay-1000" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="from-primary to-primary/80 shadow-primary/25 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg">
            <Calendar className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            SportEvents
          </h1>
          <p className="text-muted-foreground">
            {mode === "login"
              ? "Welcome back! Sign in to continue"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-muted mb-6 flex rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
              mode === "login"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            disabled={isLoading}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={cn(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all",
              mode === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 pl-10"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 pl-10"
                  required
                  disabled={isLoading}
                  minLength={mode === "signup" ? 6 : undefined}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </div>
              {mode === "signup" && (
                <p className="text-muted-foreground text-xs">
                  Must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-11 w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {mode === "signup" && <Sparkles className="h-4 w-4" />}
                  <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                </div>
              )}
            </Button>
          </form>

          {/* Additional Info */}
          {mode === "signup" && (
            <div className="bg-muted/50 mt-6 rounded-lg p-4">
              <p className="text-muted-foreground text-center text-xs">
                By creating an account, you&apos;ll receive a confirmation email
                to verify your address
              </p>
            </div>
          )}

          {mode === "login" && (
            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
                onClick={() => toast.info("Password reset coming soon!")}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-xs">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
