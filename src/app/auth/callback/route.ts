import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { parseUserAgent } from '@/lib/user-agent'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Log device info for OAuth logins
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const ua = request.headers.get('user-agent')
          const parsed = parseUserAgent(ua)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any).from('login_logs').insert({
            user_id: user.id,
            device_type: parsed.device_type,
            browser_name: parsed.browser_name,
            os_name: parsed.os_name,
            user_agent: ua,
          })
        }
      } catch {
        // Never block auth flow
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_error`)
}
