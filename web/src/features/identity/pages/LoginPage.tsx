import { useState } from 'react'
import type { FormEvent } from 'react'
import { identityService } from '../services/identity-service'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSubmitting(true)
    setError(null)

    try {
      await identityService.login({ email, password })
      window.location.href = '/app'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-8 py-7 lg:px-12">
        <a href="/" className="text-xl font-semibold tracking-[-0.05em]">
          LDGR
        </a>

        <a
          href="/"
          className="text-sm font-medium transition-opacity hover:opacity-50"
        >
          Back
        </a>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1400px] items-center justify-center px-8 pb-20 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              LDGR
            </p>

            <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Sign in.
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Access your LDGR account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-foreground"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-foreground"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs text-muted-foreground">
                  OR
                </span>
              </div>
            </div>

            <a
              href="/api/v1/auth/google/web"
              className="flex h-12 w-full items-center justify-center rounded-full border border-border text-sm font-medium transition-colors hover:bg-muted"
            >
              Continue with Google
            </a>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a
              href="/register"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Create one
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
