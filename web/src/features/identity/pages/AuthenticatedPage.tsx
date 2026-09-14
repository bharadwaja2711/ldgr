import { useEffect, useState } from 'react'
import { identityService } from '../services/identity-service'
import type { MeResponse } from '../api/identity-api'

function AuthenticatedPage() {
  const [identity, setIdentity] = useState<MeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    identityService.me()
      .then((response) => {
        if (!cancelled) {
          setIdentity(response)
        }
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return
        }

        if (err instanceof Error && err.message === 'Not authenticated') {
          window.location.href = '/login'
          return
        }

        setError(err instanceof Error ? err.message : 'Unable to load identity')
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogout() {
    try {
      await identityService.logout()
    } finally {
      window.location.href = '/login'
    }
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-destructive">{error}</p>
      </main>
    )
  }

  if (!identity) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </main>
    )
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

        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium transition-opacity hover:opacity-50"
        >
          Sign Out
        </button>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1400px] items-center px-8 pb-20 lg:px-12">
        <div>
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            Authenticated
          </p>

          <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
            Welcome back.
          </h1>

          <p className="mt-5 text-sm text-muted-foreground">
            {identity.email}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Status: {identity.status}
          </p>
        </div>
      </section>
    </main>
  )
}

export default AuthenticatedPage
