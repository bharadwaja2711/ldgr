import { useState } from 'react'
import type { FormEvent } from 'react'
import { identityService } from '../services/identity-service'

function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSubmitting(true)
    setError(null)

    try {
      const normalizedEmail = email.trim().toLowerCase()

      await identityService.register({
        email: normalizedEmail,
        password,
        firstName,
        lastName,
      })

      window.location.href = `/login?registered=true&email=${encodeURIComponent(normalizedEmail)}`
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to create account',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-8 py-7 lg:px-12">
        <a
          href="/"
          className="text-xl font-semibold tracking-[-0.05em]"
        >
          LDGR
        </a>

        <a
          href="/login"
          className="text-sm font-medium transition-opacity hover:opacity-50"
        >
          Sign In
        </a>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1400px] items-center justify-center px-8 pb-20 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
              LDGR
            </p>

            <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Create account.
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Create your LDGR account to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First name
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  maxLength={100}
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-foreground"
                  placeholder="First name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last name
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  maxLength={100}
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-foreground"
                  placeholder="Last name"
                />
              </div>
            </div>

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
                maxLength={320}
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
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={100}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-foreground"
                placeholder="Minimum 8 characters"
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
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-sm text-muted-foreground">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Sign in
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
