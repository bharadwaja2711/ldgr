import { useEffect, useState } from 'react'
import { authStorage } from '../../../core/auth/storage'
import { identityService } from '../services/identity-service'

function GoogleCallbackPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function completeLogin() {
      const fragment = window.location.hash.slice(1)
      const params = new URLSearchParams(fragment)

      const userId = params.get('userId')
      const email = params.get('email')
      const accessToken = params.get('accessToken')
      const refreshToken = params.get('refreshToken')

      if (!userId || !email || !accessToken || !refreshToken) {
        setError('Unable to complete Google sign in')
        return
      }

      authStorage.save({
        accessToken,
        refreshToken,
      })

      localStorage.setItem('ldgr.userId', userId)
      localStorage.setItem('ldgr.email', email)

      window.history.replaceState(
        {},
        document.title,
        '/login/google/callback',
      )

      try {
        await identityService.me()
        window.location.href = '/app'
      } catch {
        authStorage.clear()
        setError('Unable to complete Google sign in')
      }
    }

    void completeLogin()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-sm text-destructive">{error}</p>
            <a
              href="/login"
              className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
            >
              Return to sign in
            </a>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Completing Google sign in...
          </p>
        )}
      </div>
    </main>
  )
}

export default GoogleCallbackPage
