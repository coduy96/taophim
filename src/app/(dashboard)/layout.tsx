import { createClient } from "@/lib/supabase/server"
import DashboardLayout from "./dashboard-layout"
import { redirect } from "next/navigation"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  // Middleware should handle redirect, but redundancy is safe here or we can let client handle null user
  // However, for profile fetch we need user.
  
  let profile = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <DashboardLayout user={user} profile={profile}>
      {children}
    </DashboardLayout>
  )
}
