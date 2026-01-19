import { cookies } from 'next/headers'

/**
 * Fast, non-blocking check if user might be logged in based on cookies.
 * This does NOT verify the session - just checks for cookie presence.
 * Use this for initial render optimization on public pages.
 */
export async function mightBeLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  // Check for Supabase auth cookie patterns
  // Supabase stores tokens in cookies like: sb-{ref}-auth-token
  const hasAuthCookie = allCookies.some(
    cookie => cookie.name.includes('auth-token') ||
              cookie.name.includes('sb-') && cookie.name.includes('-auth')
  )

  return hasAuthCookie
}
