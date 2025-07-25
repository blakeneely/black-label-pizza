// This file is kept for backwards compatibility
// We now use phone numbers for user identification instead of UUIDs

export function getUserPhone(): string | null {
  if (typeof window === 'undefined') {
    return null // Not available in server-side rendering
  }

  return localStorage.getItem('userPhone')
}

export function setUserPhone(phone: string): void {
  if (typeof window === 'undefined') {
    return // Not available in server-side rendering
  }

  localStorage.setItem('userPhone', phone)
}

export function clearUserPhone(): void {
  if (typeof window === 'undefined') {
    return // Not available in server-side rendering
  }

  localStorage.removeItem('userPhone')
}
