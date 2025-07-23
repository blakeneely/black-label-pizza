import { v4 as uuidv4 } from 'uuid'

// Client-side version for use in client components
export function getUserIdClient(): string {
  if (typeof window === 'undefined') {
    return uuidv4() // Fallback for SSR
  }

  let userId = document.cookie
    .split('; ')
    .find((row) => row.startsWith('userId='))
    ?.split('=')[1]

  if (!userId) {
    userId = uuidv4()
    document.cookie = `userId=${userId}; path=/; max-age=${
      60 * 60 * 24 * 365
    }; SameSite=Strict`
  }

  return userId
}
