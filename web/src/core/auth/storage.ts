export type Credentials = {
  accessToken: string
  refreshToken: string
}

const ACCESS_TOKEN_KEY = 'ldgr.accessToken'
const REFRESH_TOKEN_KEY = 'ldgr.refreshToken'

export const authStorage = {
  load(): Credentials | null {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

    if (!accessToken || !refreshToken) {
      return null
    }

    return { accessToken, refreshToken }
  },

  save(credentials: Credentials): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, credentials.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, credentials.refreshToken)
  },

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem('ldgr.userId')
    localStorage.removeItem('ldgr.email')
  },
}
